import type { DiaryBackend } from './store';
import type { DiaryEntry } from './types';
import { validateEntries } from './validation';
export function indexedDBBackend(name = 'after-you-diary', factory?: IDBFactory): DiaryBackend {
  let opening: Promise<IDBDatabase> | undefined;
  const open = (): Promise<IDBDatabase> => opening ??= new Promise((resolve, reject) => {
    const source = factory ?? globalThis.indexedDB;
    if (!source) { reject(new Error('当前浏览器无法使用本地日记存储。')); return; }
    const request = source.open(name, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('entries')) { const entries = db.createObjectStore('entries', { keyPath: 'id' }); entries.createIndex('date', 'date', { unique: false }); }
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
    };
    request.onerror = () => { opening = undefined; reject(request.error ?? new Error('无法打开本地日记。')); };
    request.onblocked = () => { opening = undefined; reject(new Error('日记存储升级被其他标签页阻止，请关闭其他本站标签页后重试。')); };
    request.onsuccess = () => { const db = request.result; db.onversionchange = () => { db.close(); opening = undefined; }; resolve(db); };
  });
  return {
    async read() { const db = await open(); return new Promise<DiaryEntry[]>((resolve, reject) => {
      const tx = db.transaction('entries', 'readonly'); const request = tx.objectStore('entries').getAll();
      tx.oncomplete = () => { try { resolve(validateEntries(request.result)); } catch (e) { reject(e); } };
      tx.onabort = () => reject(tx.error ?? new Error('读取日记失败。'));
      tx.onerror = () => reject(tx.error ?? new Error('读取日记失败。'));
    }); },
    async write(entries) { const db = await open(); return new Promise<void>((resolve, reject) => {
      const tx = db.transaction('entries', 'readwrite'); const target = tx.objectStore('entries'); target.clear(); for (const entry of entries) target.put(entry);
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error ?? new Error('保存日记失败。')); tx.onerror = () => reject(tx.error ?? new Error('保存日记失败。'));
    }); },
    async mutate<T>(operation: (entries: DiaryEntry[]) => T) { const db = await open(); return new Promise<T>((resolve, reject) => {
      const tx = db.transaction('entries', 'readwrite'); const target = tx.objectStore('entries'); const request = target.getAll(); let result: T; let failure: unknown;
      request.onsuccess = () => { try { const entries = validateEntries(request.result); result = operation(entries); target.clear(); for (const entry of entries) target.put(entry); } catch (error) { failure = error; tx.abort(); } };
      tx.oncomplete = () => resolve(result); tx.onabort = () => reject(failure ?? tx.error ?? new Error('保存日记失败。')); tx.onerror = () => reject(tx.error ?? new Error('保存日记失败。'));
    }); },
    async getMeta<T>(key: string) { const db = await open(); return new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction('meta', 'readonly'); const request = tx.objectStore('meta').get(key);
      tx.oncomplete = () => resolve(request.result?.value as T | undefined); tx.onabort = () => reject(tx.error ?? new Error('读取设置失败。')); tx.onerror = () => reject(tx.error ?? new Error('读取设置失败。'));
    }); },
    async setMeta(key, value) { const db = await open(); return new Promise<void>((resolve, reject) => {
      const tx = db.transaction('meta', 'readwrite'); tx.objectStore('meta').put({ key, value });
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error ?? new Error('保存设置失败。')); tx.onerror = () => reject(tx.error ?? new Error('保存设置失败。'));
    }); },
  };
}
