import type { DiaryEntry, DiaryInput } from './types';
export const MAX_FILE_BYTES = 8 * 1024 * 1024;
export const MAX_EXPANDED_BYTES = 16 * 1024 * 1024;
export const MAX_ARCHIVE_ENTRY_BYTES = 5 * 1024 * 1024;
export const MAX_ENTRIES = 5000;
export const MAX_BODY_LENGTH = 1024 * 1024;
export function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validateInput(value: unknown): asserts value is DiaryInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('日记格式不正确。');
  const v = value as Record<string, unknown>;
  if (!validDate(v.date)) throw new Error('日期格式不正确。');
  if (typeof v.body !== 'string' || v.body.length > MAX_BODY_LENGTH) throw new Error('正文过长或格式不正确。');
  if (v.title !== undefined && (typeof v.title !== 'string' || v.title.length > 300)) throw new Error('标题格式不正确。');
  if (typeof v.sealed !== 'boolean') throw new Error('封存状态不正确。');
  if (v.mood !== undefined && (!Number.isInteger(v.mood) || Number(v.mood) < 1 || Number(v.mood) > 5)) throw new Error('心情格式不正确。');
  if (v.weather !== undefined && (typeof v.weather !== 'string' || !['rain', 'sun', 'cloud', 'night'].includes(v.weather))) throw new Error('天气格式不正确。');
  if (!Array.isArray(v.tags) || v.tags.length > 8 || v.tags.some(t => typeof t !== 'string' || !t.trim() || t.length > 80) || new Set(v.tags).size !== v.tags.length) throw new Error('标签须为最多八个不重复的短文本。');
  if (v.id !== undefined && (typeof v.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(v.id))) throw new Error('条目编号不正确。');
}
export function validateEntry(value: unknown): asserts value is DiaryEntry {
  validateInput(value);
  const v = value as DiaryEntry;
  if (!v.id || !Number.isSafeInteger(v.createdAt) || !Number.isSafeInteger(v.updatedAt) || v.createdAt < 0 || v.updatedAt < v.createdAt || v.createdAt > 8.64e15 || v.updatedAt > 8.64e15) throw new Error('条目时间信息不正确。');
}
export function validateEntries(values: unknown): DiaryEntry[] {
  if (!Array.isArray(values) || values.length > MAX_ENTRIES) throw new Error('条目数量不正确。');
  const ids = new Set<string>();
  for (const value of values) { validateEntry(value); if (ids.has(value.id)) throw new Error('导入文件包含重复编号。'); ids.add(value.id); }
  return values as DiaryEntry[];
}
export const cloneEntry = (e: DiaryEntry): DiaryEntry => ({ ...e, tags: [...e.tags] });
