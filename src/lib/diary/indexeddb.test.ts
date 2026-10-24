import { describe, expect, it } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { createIndexedDBStore } from './store';
import type { DiaryInput } from './types';
const input: DiaryInput = { date: '2026-10-23', body: '仅本地测试', tags: ['测试'], sealed: false };
describe('IndexedDB diary', () => {
  it('persists across store instances, indexes dates and keeps metadata outside body', async () => {
    const factory = new IDBFactory(); const one = createIndexedDBStore('durable-test', factory);
    const entry = await one.upsert(input); await one.setMeta('disclosure', true);
    const two = createIndexedDBStore('durable-test', factory);
    expect(await two.get(entry.id)).toEqual(entry); expect(await two.getMeta('disclosure')).toBe(true);
    await two.seal(entry.id); await expect(one.remove(entry.id)).rejects.toThrow('封存');
    await two.unseal(entry.id); await one.remove(entry.id); expect(await two.list()).toHaveLength(0);
  });
  it('serializes cross-instance updates atomically rather than dropping unrelated entries', async () => {
    const factory = new IDBFactory(); const one = createIndexedDBStore('concurrent-test', factory); const two = createIndexedDBStore('concurrent-test', factory);
    await Promise.all([one.upsert(input), two.upsert({ ...input, date: '2026-10-24' })]);
    expect(await one.list()).toHaveLength(2);
  });
  it('restores exported metadata into an empty database', async () => {
    const factory = new IDBFactory(); const one = createIndexedDBStore('source-test', factory);
    await one.importEntries([{ ...input, id: 'saved-id', createdAt: 10, updatedAt: 20, sealed: true, mood: 5, weather: 'night' }]);
    const blob = await one.exportAll(); const two = createIndexedDBStore('target-test', factory);
    await two.importFile(new File([blob], 'roundtrip.zip')); expect(await two.list()).toEqual(await one.list());
  });
});
