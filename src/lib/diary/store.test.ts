import { describe, expect, it } from 'vitest';
import { createMemoryStore, previewImport } from './store';
import type { DiaryEntry, DiaryInput } from './types';
import { entryMarkdown, exportEntries, parseMarkdown } from '../export/backup';
const input = (date = '2026-10-23', body = '测试正文'): DiaryInput => ({ date, body, tags: [], sealed: false });
const entry: DiaryEntry = { ...input(), id: 'original-id', createdAt: 100, updatedAt: 200, mood: 4, weather: 'rain', tags: ['雨'], title: '标题' };
function file(blob: Blob, name: string): File { return new File([blob], name); }
describe('memory diary contract', () => {
  it('creates, reads, searches and removes entries without exposing mutable references', async () => {
    const store = createMemoryStore(); const saved = await store.upsert(input());
    saved.tags.push('mutated'); expect((await store.get(saved.id))?.tags).toEqual([]);
    expect(await store.list({ q: '测试' })).toHaveLength(1);
    expect(await store.list({ from: '2026-10-24' })).toHaveLength(0);
    await store.remove(saved.id); expect(await store.list()).toEqual([]);
  });
  it('overwrites canonical same date, creates a different date', async () => {
    const store = createMemoryStore(); const a = await store.upsert(input());
    const b = await store.upsert(input(undefined, '第二版'));
    expect(b.id).toBe(a.id); expect(b.createdAt).toBe(a.createdAt);
    await store.upsert(input('2026-10-24')); expect(await store.list()).toHaveLength(2);
  });
  it('explicit ID edits preserve date, ID and creation time', async () => {
    const store = createMemoryStore([entry]);
    const edited = await store.upsert({ ...input('2026-10-25'), id: entry.id });
    expect(edited.id).toBe(entry.id); expect(edited.date).toBe(entry.date); expect(edited.createdAt).toBe(100);
  });
  it('sealed entries cannot be edited, deleted or overwritten by date', async () => {
    const store = createMemoryStore(); const e = await store.upsert(input()); await store.seal(e.id);
    await expect(store.upsert({ ...input(), id: e.id })).rejects.toThrow('封存');
    await expect(store.upsert(input())).rejects.toThrow('封存');
    await expect(store.remove(e.id)).rejects.toThrow('封存');
    await store.unseal(e.id); await store.upsert({ ...input(), id: e.id }); await store.remove(e.id);
    expect(await store.list()).toHaveLength(0);
  });
  it('imports conflicts without overwriting existing or sealed content', async () => {
    const store = createMemoryStore([{ ...entry, sealed: true }]);
    expect(await store.importEntries([entry])).toEqual({ added: 1, conflicts: 1 });
    await store.importEntries([entry]);
    expect((await store.list()).map(e => e.id).sort()).toEqual(['2026-10-23-2', '2026-10-23-3', entry.id].sort());
    expect((await store.get(entry.id))?.sealed).toBe(true);
  });
  it('exports/imports ZIP into empty store preserving IDs, metadata and body exactly', async () => {
    const original = [{ ...entry, body: '\n## 标题\n**文本**\n', sealed: true }, { ...entry, id: '2026-10-23-9', tags: ['保留'], sealed: false }];
    const store = createMemoryStore(original); const blob = await store.exportAll();
    const restored = createMemoryStore(); const preview = await previewImport(file(blob, 'diary.zip'));
    expect(await restored.list()).toHaveLength(0); // Preview must not mutate.
    await restored.importEntries(preview.entries);
    expect((await restored.list()).sort((a,b) => a.id.localeCompare(b.id))).toEqual(original.sort((a,b) => a.id.localeCompare(b.id)));
  });
  it('Markdown keeps body whitespace and standard YAML subset works', () => {
    const e = { ...entry, body: '\n\n正文\n' }; expect(parseMarkdown(entryMarkdown(e))).toEqual(e);
    const standard = '---\ndate: 2026-10-23\nmood: 4\nweather: rain\ntags: [雨, 想家]\nsealed: false\n---\n\n正文';
    expect(parseMarkdown(standard)).toMatchObject({ date: '2026-10-23', mood: 4, weather: 'rain', tags: ['雨', '想家'], body: '正文' });
  });
  it('rejects invalid dates, tags, IDs, timestamp and duplicate IDs atomically', async () => {
    const store = createMemoryStore();
    await expect(store.upsert(input('2026-02-30'))).rejects.toThrow('日期');
    await expect(store.upsert({ ...input(), mood: 8 as 4 })).rejects.toThrow('心情');
    await expect(store.upsert({ ...input(), tags: Array.from({length:9},(_,i)=>String(i)) })).rejects.toThrow('标签');
    expect(() => createMemoryStore([{ ...entry, id: '../bad' }])).toThrow('编号');
    expect(() => createMemoryStore([{ ...entry, updatedAt: 0 }])).toThrow('时间');
    await expect(store.importEntries([entry, entry])).rejects.toThrow('重复');
    expect(await store.list()).toEqual([]);
  });
  it('rejects malformed ZIP, unsafe paths and unsupported shape', async () => {
    await expect(previewImport(file(new Blob(['broken']), 'broken.zip'))).rejects.toThrow();
    const { zipSync } = await import('fflate');
    const bad = zipSync({ '../x.md': new TextEncoder().encode('x') });
    await expect(previewImport(file(new Blob([bad]), 'bad.zip'))).rejects.toThrow('路径');
    await expect(previewImport(file(new Blob(['---\ndate: 2026-10-23\nmood: 99\n---\n\n正文']), 'bad.md'))).rejects.toThrow('心情');
  });
  it('keeps metadata separately', async () => {
    const store = createMemoryStore(); await store.setMeta('disclosure', true);
    expect(await store.getMeta('disclosure')).toBe(true); expect(await store.list()).toEqual([]);
  });
  it('round-trips an empty archive', async () => {
    const blob = await exportEntries([]); expect((await previewImport(file(blob,'empty.zip'))).entries).toEqual([]);
  });
});

describe('restore deleted entry', () => {
  it('preserves original metadata if available and retains both when its ID was reused', async () => {
    const store = createMemoryStore([entry]); await store.remove(entry.id);
    const restored = await store.restoreEntry(entry); expect(restored).toEqual(entry);
    await store.remove(entry.id); await store.upsert({ ...input(), id: entry.id, body: '新草稿' });
    const conflict = await store.restoreEntry(entry);
    expect(conflict.id).toBe('2026-10-23-2');
    expect((await store.get(entry.id))?.body).toBe('新草稿'); expect(conflict.body).toBe(entry.body);
    expect(conflict.createdAt).toBe(entry.createdAt); expect(await store.list()).toHaveLength(2);
  });
  it('rejects timestamps outside valid date range', () => {
    expect(() => createMemoryStore([{ ...entry, updatedAt: 1e300 }])).toThrow('时间');
    expect(() => createMemoryStore([{ ...entry, createdAt: .5 }])).toThrow('时间');
  });
});
