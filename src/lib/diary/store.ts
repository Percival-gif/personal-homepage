import type { DiaryEntry, DiaryInput, DiaryStore } from './types';
import { cloneEntry, validateEntries, validateEntry, validateInput } from './validation';
import { exportEntries, previewImport } from '../export/backup';
import { indexedDBBackend } from './indexeddb';
export type { DiaryEntry, DiaryStore } from './types';
export type ExtendedDiaryStore = DiaryStore & {
  getMeta<T>(key: string): Promise<T | undefined>;
  setMeta(key: string, value: unknown): Promise<void>;
  importEntries(entries: DiaryEntry[]): Promise<{ added: number; conflicts: number }>;
  restoreEntry(entry: DiaryEntry): Promise<DiaryEntry>;
};
export interface DiaryBackend {
  mutate?<T>(operation: (entries: DiaryEntry[]) => T): Promise<T>;
  read(): Promise<DiaryEntry[]>;
  write(entries: DiaryEntry[]): Promise<void>;
  getMeta<T>(key: string): Promise<T | undefined>;
  setMeta(key: string, value: unknown): Promise<void>;
}
export function createStore(backend: DiaryBackend): ExtendedDiaryStore {
  let queue: Promise<unknown> = Promise.resolve();
  const mutate = <T>(fn: (entries: DiaryEntry[]) => T): Promise<T> => {
    const task = queue.then(async () => { if (backend.mutate) return backend.mutate(fn); const entries = await backend.read(); const result = fn(entries); await backend.write(entries); return result; });
    queue = task.catch(() => undefined); return task;
  };
  const store: ExtendedDiaryStore = {
    async list(opts = {}) { await queue; return (await backend.read()).filter(e => (!opts.from || e.date >= opts.from) && (!opts.to || e.date <= opts.to) && (!opts.q || `${e.title ?? ''}\n${e.body}\n${e.tags.join(' ')}`.toLowerCase().includes(opts.q.toLowerCase()))).sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt - a.updatedAt).map(cloneEntry); },
    async get(id) { await queue; const e = (await backend.read()).find(x => x.id === id); return e && cloneEntry(e); },
    async upsert(input) { validateInput(input); return mutate(entries => {
      const existing = input.id ? entries.find(e => e.id === input.id) : entries.filter(e => e.date === input.date).sort((a,b) => Number(a.sealed) - Number(b.sealed) || Number(b.id === input.date) - Number(a.id === input.date) || a.createdAt - b.createdAt)[0];
      if (existing?.sealed) throw new Error('这篇日记已封存，请先解除封存。');
      const now = Date.now();
      const entry: DiaryEntry = { ...input, tags: [...input.tags], id: existing?.id ?? input.id ?? input.date, date: existing?.date ?? input.date, createdAt: existing?.createdAt ?? now, updatedAt: Math.max(now, existing?.updatedAt ?? 0, existing?.createdAt ?? 0), sealed: existing?.sealed ?? input.sealed };
      if (existing) entries.splice(entries.indexOf(existing), 1, entry); else { if (entries.length >= 5000) throw new Error('本地记录已达五千篇上限，请先导出整理。'); entries.push(entry); }
      return cloneEntry(entry);
    }); },
    remove(id) { return mutate(entries => { const e = entries.find(x => x.id === id); if (e?.sealed) throw new Error('封存日记不能删除。'); if (e) entries.splice(entries.indexOf(e), 1); }); },
    seal(id) { return mutate(entries => { const e = entries.find(x => x.id === id); if (!e) throw new Error('日记不存在。'); e.sealed = true; e.updatedAt = Math.max(Date.now(), e.createdAt, e.updatedAt); }); },
    unseal(id) { return mutate(entries => { const e = entries.find(x => x.id === id); if (!e) throw new Error('日记不存在。'); e.sealed = false; e.updatedAt = Math.max(Date.now(), e.createdAt, e.updatedAt); }); },
    async exportAll() { return exportEntries(await store.list()); },
    async importFile(file) { return store.importEntries((await previewImport(file)).entries); },
    async importEntries(incoming) { validateEntries(incoming); return mutate(entries => {
      if (entries.length + incoming.length > 5000) throw new Error('导入后超过五千篇上限。');
      if (!entries.length) { entries.push(...incoming.map(cloneEntry)); return { added: incoming.length, conflicts: 0 }; }
      let conflicts = 0;
      for (const original of incoming) {
        const entry = cloneEntry(original);
        if (entries.some(e => e.id === entry.id || e.date === entry.date)) {
          conflicts++; let suffix = 2; while (entries.some(e => e.id === `${entry.date}-${suffix}`)) suffix++;
          entry.id = `${entry.date}-${suffix}`;
        }
        entries.push(entry);
      }
      return { added: incoming.length, conflicts };
    }); },
    async restoreEntry(entry) { validateEntry(entry); return mutate(entries => { const restored = cloneEntry(entry); if (entries.length >= 5000) throw new Error('本地记录已达五千篇上限。'); if (entries.some(e => e.id === restored.id)) { let suffix = 2; while (entries.some(e => e.id === `${restored.date}-${suffix}`)) suffix++; restored.id = `${restored.date}-${suffix}`; } entries.push(restored); return cloneEntry(restored); }); },
    getMeta: key => backend.getMeta(key),
    setMeta: (key, value) => backend.setMeta(key, value),
  };
  return store;
}
export function createMemoryStore(seed: DiaryEntry[] = []): ExtendedDiaryStore {
  validateEntries(seed); let entries = seed.map(cloneEntry); const meta = new Map<string, unknown>();
  return createStore({ async read() { return entries.map(cloneEntry); }, async write(next) { entries = next.map(cloneEntry); }, async getMeta<T>(key: string) { return meta.get(key) as T | undefined; }, async setMeta(key, value) { meta.set(key, value); } });
}
export { previewImport } from '../export/backup';

export function createIndexedDBStore(name = 'after-you-diary', factory?: IDBFactory): ExtendedDiaryStore { return createStore(indexedDBBackend(name, factory)); }
export const diaryStore = createIndexedDBStore();
