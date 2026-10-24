import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ChangeEvent, ReactNode } from 'react';
import { MoodStamp, PaperSheet, Stamp, TagChip, Tape } from '../../components/ui';
import { diaryStore, previewImport } from '../../lib/diary/store';
import type { DiaryEntry, DiaryInput } from '../../lib/diary/types';
import { entryMarkdown, preloadBackup } from '../../lib/export/backup';
import type { ImportPreview } from '../../lib/export/backup';
import { validDate } from '../../lib/diary/validation';
import MarkdownPreview from './MarkdownPreview';
import './diary.css';

type View = 'editor' | 'calendar' | 'list';
type Modal = { kind: 'delete' | 'unseal'; entry: DiaryEntry } | { kind: 'import'; preview: ImportPreview };
const weatherOptions = [{ value: 'rain', label: '雨', icon: '☂' }, { value: 'sun', label: '晴', icon: '☀' }, { value: 'cloud', label: '云', icon: '☁' }, { value: 'night', label: '夜', icon: '☾' }] as const;
function localDate(date = new Date()): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
const fresh = (date = localDate()): DiaryInput => ({ date, body: '', tags: [], sealed: false });
const snapshot = (entry: DiaryInput): DiaryInput => ({ ...entry, tags: [...entry.tags] });
const errorText = (error: unknown) => error instanceof Error ? error.message : '操作失败，请重试。';
function timeLabel(time: number) { return new Date(time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }); }
function download(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function ModalDialog({ title, children, onCancel }: { title: string; children: ReactNode; onCancel: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; if (dialog && !dialog.open) dialog.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className="diary-dialog" aria-labelledby="diary-dialog-title" onCancel={onCancel} onKeyDown={event => { if (event.key === 'Escape') event.stopPropagation(); }}><h2 id="diary-dialog-title" className="display-zh">{title}</h2>{children}</dialog>;
}

export default function Diary() {
  const [ready, setReady] = useState(false); const [acknowledged, setAcknowledged] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]); const [draft, setDraft] = useState<DiaryInput>(() => fresh());
  const [view, setView] = useState<View>('editor'); const [writing, setWriting] = useState(false); const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState('今天还没有写'); const [error, setError] = useState(''); const [revision, setRevision] = useState(0);
  const [tagText, setTagText] = useState(''); const [query, setQuery] = useState(''); const [month, setMonth] = useState(() => localDate().slice(0,7));
  const [modal, setModal] = useState<Modal>(); const [undo, setUndo] = useState<DiaryEntry>();
  const draftRef = useRef<DiaryInput>(draft); const version = useRef(0); const savedVersion = useRef(-1); const dirty = useRef(false);
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve()); const alive = useRef(true); const undoTimer = useRef<ReturnType<typeof setTimeout>>();
  const bodyRef = useRef<HTMLTextAreaElement>(null); const fileRef = useRef<HTMLInputElement>(null);
  const refresh = useCallback(async () => { const next = await diaryStore.list(); if (alive.current) setEntries(next); return next; }, []);
  const installDraft = useCallback((entry: DiaryInput, exists: boolean) => { version.current++; savedVersion.current = version.current; dirty.current = false; draftRef.current = snapshot(entry); setDraft(snapshot(entry)); setWriting(exists); setPreview(false); setTagText(''); setError(''); setStatus(exists && 'updatedAt' in entry ? `已保存 · ${timeLabel(Number(entry.updatedAt))}` : '今天还没有写'); }, []);
  const saveNow = useCallback(async (): Promise<boolean> => {
    if (!dirty.current || draftRef.current.sealed) return true;
    const captured = snapshot(draftRef.current); const capturedVersion = version.current;
    const task = saveQueue.current.then(async () => {
      if (savedVersion.current >= capturedVersion) return true;
      if (alive.current) setStatus('正在保存…');
      try {
        const saved = await diaryStore.upsert(captured); savedVersion.current = capturedVersion;
        if (capturedVersion === version.current) { draftRef.current = snapshot(saved); dirty.current = false; if (alive.current) { setDraft(snapshot(saved)); setStatus(`已保存 · ${timeLabel(saved.updatedAt)}`); setError(''); } }
        else if (draftRef.current.date === saved.date && !draftRef.current.id) { draftRef.current = { ...draftRef.current, id: saved.id }; if (alive.current) setDraft(snapshot(draftRef.current)); }
        await refresh(); return true;
      } catch (failure) { if (alive.current) { setError(errorText(failure)); setStatus('保存失败，正文仍留在当前页面'); } return false; }
    });
    saveQueue.current = task; return task;
  }, [refresh]);
  useEffect(() => {
    alive.current = true; let cancelled = false;
    const initialize = async () => {
      try {
        await preloadBackup(); const list = await diaryStore.list(); const ack = await diaryStore.getMeta<boolean>('disclosureAcknowledged');
        if (cancelled) return; setEntries(list); setAcknowledged(!!ack);
        const today = list.filter(e => e.date === localDate()).sort((a,b) => Number(a.sealed) - Number(b.sealed))[0]; installDraft(today ?? fresh(), !!today);
        await document.fonts.ready; if (!cancelled) setReady(true);
      } catch (failure) { if (!cancelled) setError(errorText(failure)); }
    }; void initialize();
    return () => { cancelled = true; alive.current = false; void saveNow(); clearTimeout(undoTimer.current); };
  }, [installDraft, saveNow]);
  useEffect(() => { if (!revision || !dirty.current) return; const timer = setTimeout(() => { void saveNow(); }, 1200); return () => clearTimeout(timer); }, [revision, saveNow]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); void saveNow(); } };
    const leaving = (event: BeforeUnloadEvent) => { if (dirty.current) { void saveNow(); event.preventDefault(); event.returnValue = ''; } };
    const pagehide = () => { void saveNow(); };
    window.addEventListener('keydown', key); window.addEventListener('beforeunload', leaving); window.addEventListener('pagehide', pagehide);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('beforeunload', leaving); window.removeEventListener('pagehide', pagehide); };
  }, [saveNow]);
  useEffect(() => {
    const leaveThroughLink = (event: MouseEvent) => {
      if (!dirty.current || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.target === '_blank') return;
      const next = new URL(link.href, location.href);
      if (next.origin !== location.origin || next.hash === location.hash || next.hash === '#main') return;
      event.preventDefault(); event.stopImmediatePropagation();
      void saveNow().then(saved => { if (saved) location.href = next.href; });
    };
    const leaveThroughEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !dirty.current || document.querySelector('dialog[open]')) return;
      event.preventDefault(); event.stopImmediatePropagation();
      void saveNow().then(saved => { if (saved) location.hash = '/corridor'; });
    };
    window.addEventListener('click', leaveThroughLink, true); window.addEventListener('keydown', leaveThroughEscape, true);
    return () => { window.removeEventListener('click', leaveThroughLink, true); window.removeEventListener('keydown', leaveThroughEscape, true); };
  }, [saveNow]);
  useEffect(() => { if (acknowledged && writing && view === 'editor' && !preview && !draft.sealed && matchMedia('(min-width:1024px)').matches) bodyRef.current?.focus(); }, [acknowledged, writing, view, preview, draft.id, draft.sealed, ready]);
  const update = (patch: Partial<DiaryInput>) => { if (draftRef.current.sealed) return; const next = { ...draftRef.current, ...patch }; draftRef.current = snapshot(next); version.current++; dirty.current = true; setDraft(snapshot(next)); setRevision(version.current); setStatus('等待保存…'); setError(''); };
  const chooseEntry = async (entry: DiaryEntry) => { try { if (!await saveNow()) return; installDraft(entry, true); setView('editor'); } catch (failure) { setError(errorText(failure)); } };
  const chooseDate = async (date: string) => { try { if (!validDate(date) || !await saveNow()) return; const list = await refresh(); const found = list.filter(e => e.date === date).sort((a,b) => Number(a.sealed) - Number(b.sealed))[0]; installDraft(found ?? fresh(date), !!found); setView('editor'); } catch (failure) { setError(errorText(failure)); } };
  const switchView = async (next: View) => { if (await saveNow()) setView(next); };
  const acceptDisclosure = async () => { try { await diaryStore.setMeta('disclosureAcknowledged', true); setAcknowledged(true); } catch (failure) { setError(errorText(failure)); } };
  const addTag = () => { const tag = tagText.trim(); if (!tag) return; if (draft.tags.length >= 8) { setError('最多添加八个标签。'); return; } if (tag.length > 80) { setError('标签请保持在八十字以内。'); return; } if (!draft.tags.includes(tag)) update({ tags: [...draft.tags, tag] }); setTagText(''); };
  const seal = async () => { if (!await saveNow()) return; const id = draftRef.current.id; if (!id) return; try { await diaryStore.seal(id); const saved = await diaryStore.get(id); if (saved) installDraft(saved,true); await refresh(); } catch (failure) { setError(errorText(failure)); } };
  const ask = async (kind: 'delete' | 'unseal') => { try { if (!await saveNow()) return; const id = draftRef.current.id; if (!id) return; const entry = await diaryStore.get(id); if (entry) setModal({ kind, entry }); } catch (failure) { setError(errorText(failure)); } };
  const confirmModal = async () => {
    if (!modal) return;
    try {
      if (modal.kind === 'import') { const result = await diaryStore.importEntries(modal.preview.entries); await refresh(); setStatus(`已导入 ${result.added} 篇，同日保留 ${result.conflicts} 份副本`); }
      else if (modal.kind === 'unseal') { await diaryStore.unseal(modal.entry.id); const saved = await diaryStore.get(modal.entry.id); if (saved) installDraft(saved,true); await refresh(); }
      else { await diaryStore.remove(modal.entry.id); clearTimeout(undoTimer.current); setUndo(modal.entry); undoTimer.current = setTimeout(() => setUndo(undefined),5000); installDraft(fresh(modal.entry.date),false); await refresh(); }
      setModal(undefined);
    } catch (failure) { setError(errorText(failure)); }
  };
  const undoDelete = async () => { if (!undo) return; try { if (!await saveNow()) return; const restored = await diaryStore.restoreEntry(undo); installDraft(restored,true); setUndo(undefined); clearTimeout(undoTimer.current); await refresh(); } catch (failure) { setError(errorText(failure)); } };
  const exportAll = async () => { if (!await saveNow()) return; try { download(await diaryStore.exportAll(),`diary-${localDate()}.zip`); } catch (failure) { setError(errorText(failure)); } };
  const exportOne = async () => { if (!await saveNow()) return; const id = draftRef.current.id; if (!id) return; try { const saved = await diaryStore.get(id); if (saved) download(new Blob([entryMarkdown(saved)], { type: 'text/markdown;charset=utf-8' }),`${saved.id}.md`); } catch (failure) { setError(errorText(failure)); } };
  const importFile = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; event.target.value = ''; if (!file || !await saveNow()) return; try { setModal({ kind: 'import', preview: await previewImport(file) }); } catch (failure) { setError(errorText(failure)); } };
  const filtered = entries.filter(e => !query || `${e.date}\n${e.title ?? ''}\n${e.body}\n${e.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  const currentMonth = localDate().slice(0,7); const totalWords = entries.reduce((sum,e) => sum + Array.from(e.body.replace(/\s/g,'')).length,0);
  const monthDate = new Date(`${month}-01T12:00:00`); const firstWeekday = (monthDate.getDay() + 6) % 7; const days = new Date(monthDate.getFullYear(),monthDate.getMonth()+1,0).getDate();
  const moveMonth = (by: number) => { const date = new Date(`${month}-01T12:00:00`); date.setMonth(date.getMonth()+by); setMonth(localDate(date).slice(0,7)); };
  const sealed = draft.sealed;
  return <section className="diary-page" data-testid="diary-ready" data-diary-ready={ready && acknowledged ? 'true' : 'false'}>
    <div className="diary-heading"><div><p className="mono">PRIVATE NOTEBOOK / LOCAL ONLY</p><h1 className="display-zh">私人<br className="diary-title-break"/>笔记本。</h1></div><span className="diary-heading-mark decor display-en" aria-hidden="true">P.</span></div>
    <p className="diary-public-separation">这里是本地书写空间，内容不会成为公开文章。<Link to="/notes">阅读公开随笔 ↗</Link></p>
    {error && <p className="diary-error" role="alert">{error}</p>}
    {!ready ? <PaperSheet><p role="status">正在打开本地笔记本…</p>{error && <button className="comic-button" onClick={() => location.reload()}>重新打开</button>}</PaperSheet> : !acknowledged ? <PaperSheet className="diary-disclosure"><Tape/><p className="mono">BEFORE YOU WRITE</p><h2 className="display-zh">这本日记，留在这里。</h2><p>日记仅保存在当前浏览器。清理站点数据、使用无痕模式或更换设备都可能使记录丢失，请定期导出备份。</p><p>每位访客写下的内容都属于各自的浏览器，没有登录、云同步或公开列表。共用同一浏览器的人能够读取这些记录。</p><button type="button" className="comic-button primary" onClick={() => { void acceptDisclosure(); }}>我明白了，开始写</button></PaperSheet> : <>
      <nav className="diary-toolbar" aria-label="日记视图与备份"><div className="diary-view-tabs">{([{id:'editor',label:'今日'},{id:'calendar',label:'日历'},{id:'list',label:'全部'}] as const).map(tab => <button type="button" aria-pressed={view===tab.id} key={tab.id} onClick={() => { if (tab.id==='editor') void chooseDate(localDate()); else void switchView(tab.id); }}>{tab.label}</button>)}</div><div className="diary-backup-actions"><button className="comic-button" onClick={() => { void exportAll(); }}>导出全部 ZIP</button><button className="comic-button" onClick={() => fileRef.current?.click()}>导入备份</button><input ref={fileRef} data-testid="diary-import-file" hidden type="file" accept=".md,.zip" aria-label="选择日记备份" onChange={event => { void importFile(event); }}/></div></nav>
      <div className="diary-statistics mono" aria-label="日记统计"><span>总条数 <strong>{entries.length}</strong></span><span>总字数 <strong>{totalWords}</strong></span><span>本月条数 <strong>{entries.filter(e=>e.date.startsWith(currentMonth)).length}</strong></span></div>
      {view==='editor' && <PaperSheet className="diary-notebook"><Tape/><aside className="diary-sidebar"><p className="mono">THE DATE</p><label htmlFor="diary-date">日记日期</label><input id="diary-date" data-testid="diary-date" type="date" value={draft.date} disabled={sealed} onChange={event => { void chooseDate(event.target.value); }}/><p className="diary-date-large display-en" aria-hidden="true">{draft.date.slice(8)}</p><span className="mono">{draft.date.slice(0,7).replace('-',' / ')}</span>
        {writing && <><fieldset disabled={sealed} className="diary-weather"><legend>天气</legend><div role="radiogroup" aria-label="天气">{weatherOptions.map(option => <label key={option.value}><input type="radio" name="weather" value={option.value} checked={draft.weather===option.value} onChange={() => update({weather:option.value})}/><span aria-hidden="true">{option.icon}</span>{option.label}</label>)}</div></fieldset><fieldset disabled={sealed} className="diary-moods"><legend>此刻的心情</legend><div role="radiogroup" aria-label="心情">{([1,2,3,4,5] as const).map(mood => <label key={mood}><input type="radio" name="mood" checked={draft.mood===mood} onChange={() => update({mood})}/><MoodStamp mood={mood}/></label>)}</div></fieldset><div className="diary-tags"><label htmlFor="diary-tag">标签 · 最多八个</label><div className="diary-tag-list">{draft.tags.map(tag => <TagChip key={tag} onRemove={sealed ? undefined : () => update({tags:draft.tags.filter(t=>t!==tag)})}>{tag}</TagChip>)}</div><div className="diary-tag-input"><input id="diary-tag" disabled={sealed || draft.tags.length>=8} value={tagText} maxLength={80} onChange={event=>setTagText(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();addTag();}}} placeholder="输入后按回车"/><button type="button" disabled={sealed || !tagText.trim() || draft.tags.length>=8} onClick={addTag} aria-label="添加标签">＋</button></div></div><div className="diary-entry-actions">{sealed ? <button className="comic-button" onClick={()=>{void ask('unseal');}}>解除封存</button> : <button className="comic-button" disabled={!draft.id} onClick={()=>{void seal();}}>封存今天</button>}<button className="comic-button" disabled={!draft.id} onClick={()=>{void exportOne();}}>导出这篇 MD</button><button className="diary-delete" disabled={sealed || !draft.id} onClick={()=>{void ask('delete');}}>删除这篇</button></div></>}
      </aside><div className="diary-writing-area">{!writing ? <div className="diary-empty"><p className="mono">A BLANK PAGE</p><h2 className="display-zh">今天还没有写</h2><p>这是一张空白纸。</p><button className="comic-button primary" onClick={()=>setWriting(true)}>开始写</button></div> : <><div className="diary-editor-top"><span className="mono">{sealed ? 'SEALED / READ ONLY' : 'WRITE AT YOUR OWN PACE'}</span><button type="button" className="diary-preview-button" aria-pressed={preview} onClick={()=>setPreview(!preview)}>{preview ? '回到书写' : '预览排版'}</button></div>{sealed && <div className="diary-sealed-note"><Stamp>已封存 · {draft.date}</Stamp><p>正文、日期、心情、天气与标签均已锁定，不能删除。解除封存后才能编辑。</p></div>}<label className="diary-body-label" htmlFor="diary-body">日记正文</label>{preview ? <MarkdownPreview body={draft.body}/> : <textarea ref={bodyRef} id="diary-body" data-testid="diary-body" value={draft.body} readOnly={sealed} disabled={sealed} onChange={event=>update({body:event.target.value})} onBlur={()=>{void saveNow();}} placeholder="从这里开始。" spellCheck={false}/>}<p className="diary-markdown-help">支持 ## 标题、&gt; 引用、- 列表和 **加粗**。</p></>}</div></PaperSheet>}
      {view==='list' && <section className="diary-list" aria-label="全部日记"><label htmlFor="diary-search">搜索正文、日期或标签</label><input id="diary-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="在这本日记里寻找…"/>{!filtered.length && <p className="diary-no-results">{query ? '没有找到匹配的记录。' : '今天还没有写。'}</p>}<div className="diary-list-grid">{filtered.map(entry=><button type="button" className="diary-entry-card" key={entry.id} onClick={()=>{void chooseEntry(entry);}}><span className="mono">{entry.date}{entry.sealed ? ' · 已封存' : ''}</span><strong>{entry.title || entry.body.split('\n').find(line=>line.trim())?.slice(0,70) || '空白日记'}</strong><div><MoodStamp mood={entry.mood}/><span className="diary-card-tags">{entry.tags.map(tag=><TagChip key={tag}>{tag}</TagChip>)}</span></div></button>)}</div></section>}
      {view==='calendar' && <PaperSheet className="diary-calendar"><div className="diary-month-heading"><button className="comic-button" aria-label="上个月" onClick={()=>moveMonth(-1)}>←</button><h2 className="display-en">{month.replace('-',' / ')}</h2><button className="comic-button" aria-label="下个月" onClick={()=>moveMonth(1)}>→</button></div><div className="diary-calendar-grid">{['一','二','三','四','五','六','日'].map(day=><span className="diary-weekday" key={day}>{day}</span>)}{Array.from({length:firstWeekday},(_,index)=><span key={`blank-${index}`} aria-hidden="true"/>)}{Array.from({length:days},(_,index)=>{const date=`${month}-${String(index+1).padStart(2,'0')}`;const matches=entries.filter(e=>e.date===date);const yesterday=new Date(`${date}T12:00:00`);yesterday.setDate(yesterday.getDate()-1);const connected=!!matches.length&&entries.some(e=>e.date===localDate(yesterday))&&(firstWeekday+index)%7!==0;return <button type="button" key={date} data-has-entry={!!matches.length} data-connected={connected} aria-label={`${date}${matches.length ? `，${matches.length}篇记录` : '，尚无记录'}`} onClick={()=>{void chooseDate(date);}}><span>{index+1}</span>{!!matches.length && <i aria-hidden="true"/>}</button>;})}</div><p className="diary-calendar-note">墨点代表写过的日期，横线连接相邻记录。</p></PaperSheet>}
      <div className="diary-savebar"><p role="status" aria-live="polite" data-testid="diary-save-status">{status}</p><span className="mono">仅保存在当前浏览器</span><button type="button" className="comic-button primary" data-testid="diary-save" disabled={sealed || !writing} onClick={()=>{void saveNow();}}>保存 <span className="mono">⌘ / Ctrl + S</span></button></div>
    </>}
    {undo && <div className="diary-undo" role="status"><span>日记已删除</span><button type="button" onClick={()=>{void undoDelete();}}>撤销删除</button></div>}
    {modal && <ModalDialog title={modal.kind==='import' ? '确认导入备份？' : modal.kind==='delete' ? '删除这篇日记？' : '解除封存？'} onCancel={()=>setModal(undefined)}>{modal.kind==='import' ? <div data-testid="import-preview"><p>即将导入 {modal.preview.count} 篇，其中 {modal.preview.sealedCount} 篇已封存。</p><p>日期范围：{modal.preview.dates[0] ?? '无'} — {modal.preview.dates.at(-1) ?? '无'}。同日期记录将保留两份，现有日记不会被覆盖。</p></div> : <p>{modal.kind==='delete' ? '删除后五秒内可以撤销。封存的日记不能删除。' : '解除后将恢复正文和元信息的编辑权限。'}</p>}<div className="diary-dialog-actions"><button className="comic-button" onClick={()=>setModal(undefined)}>取消</button><button className="comic-button primary" onClick={()=>{void confirmModal();}}>{modal.kind==='import' ? '确认导入' : modal.kind==='delete' ? '确认删除' : '确认解除封存'}</button></div></ModalDialog>}
  </section>;
}
