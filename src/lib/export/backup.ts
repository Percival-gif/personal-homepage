import type { DiaryEntry } from '../diary/types';
import { MAX_ARCHIVE_ENTRY_BYTES, MAX_ENTRIES, MAX_EXPANDED_BYTES, MAX_FILE_BYTES, validateEntries, validateEntry } from '../diary/validation';
export type ImportPreview = { entries: DiaryEntry[]; count: number; sealedCount: number; dates: string[] };
let codecPromise: Promise<typeof import('./codec')> | undefined;
export const preloadBackup = () => codecPromise ??= import('./codec');
const decoder = new TextDecoder('utf-8', { fatal: true });
const encoder = new TextEncoder();
export function entryMarkdown(entry: DiaryEntry): string {
  validateEntry(entry);
  const fields = ['id', 'date', 'createdAt', 'updatedAt', 'title', 'mood', 'weather', 'tags', 'sealed'] as const;
  const text = `---\n${fields.filter(k => entry[k] !== undefined).map(k => `${k}: ${JSON.stringify(entry[k])}`).join('\n')}\n---\n\n${entry.body}`;
  if (encoder.encode(text).byteLength > MAX_FILE_BYTES) throw new Error('这篇 MD 超过 8MB，无法重新导入。请缩短正文后分篇保留。');
  return text;
}
function yamlValue(value: string): unknown {
  try { return JSON.parse(value); } catch { /* limited plain YAML scalar/list */ }
  if (value.startsWith('[') && value.endsWith(']')) return value.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
  if (/^[^{}[\]\n]+$/.test(value)) return value;
  throw new Error('不支持的 Markdown 元信息格式。');
}
export function parseMarkdown(text: string): DiaryEntry {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n(?:\r?\n)?([\s\S]*)$/.exec(text);
  if (!match) throw new Error('Markdown 缺少有效的 YAML 元信息。');
  const data: Record<string, unknown> = {};
  const allowed = ['id', 'date', 'createdAt', 'updatedAt', 'title', 'mood', 'weather', 'tags', 'sealed'];
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([a-zA-Z]+):\s*(.*)$/.exec(line);
    if (!pair || !allowed.includes(pair[1]) || Object.hasOwn(data, pair[1])) throw new Error('Markdown 元信息不正确或重复。');
    data[pair[1]] = yamlValue(pair[2]);
  }
  const now = Date.now();
  const entry = { ...data, id: data.id ?? data.date, createdAt: data.createdAt ?? now, updatedAt: data.updatedAt ?? now, tags: data.tags ?? [], sealed: data.sealed ?? false, body: match[2] };
  validateEntry(entry); return entry;
}
export async function exportEntries(entries: DiaryEntry[]): Promise<Blob> {
  if (Array.isArray(entries) && entries.length > MAX_ENTRIES) throw new Error('备份超过 5000 篇，无法重新导入。请按单篇 MD 导出或分批保留。');
  validateEntries(entries);
  const files: Record<string, Uint8Array> = {};
  const manifest = { format: 'percival-diary', version: 1, entries: entries.map(e => ({ id: e.id, path: `entries/${e.id}.md` })) };
  files['manifest.json'] = encoder.encode(JSON.stringify(manifest, null, 2));
  let expanded = files['manifest.json'].byteLength;
  for (const entry of entries) {
    const bytes = encoder.encode(entryMarkdown(entry));
    if (bytes.byteLength > MAX_ARCHIVE_ENTRY_BYTES) throw new Error('备份内单篇超过 5MB，无法重新导入。请按单篇 MD 导出或分批保留。');
    expanded += bytes.byteLength;
    if (expanded > MAX_EXPANDED_BYTES) throw new Error('备份展开后超过 16MB，无法重新导入。请按单篇 MD 导出或分批保留。');
    files[`entries/${entry.id}.md`] = bytes;
  }
  if (files['manifest.json'].byteLength > MAX_ARCHIVE_ENTRY_BYTES) throw new Error('备份清单超过 5MB，无法重新导入。请按单篇 MD 导出或分批保留。');
  const codec = await preloadBackup();
  const bytes = codec.zipSync(files, { level: 6 });
  if (bytes.byteLength > MAX_FILE_BYTES) throw new Error('压缩后的 ZIP 超过 8MB，无法重新导入。请按单篇 MD 导出或分批保留。');
  return new Blob([new Uint8Array(bytes)], { type: 'application/zip' });
}
export async function previewImport(file: File): Promise<ImportPreview> {
  if (file.size > MAX_FILE_BYTES || !file.size) throw new Error('请选择小于 8MB 的非空备份。');
  const bytes = new Uint8Array(await file.arrayBuffer());
  let entries: DiaryEntry[];
  if (file.name.toLowerCase().endsWith('.md')) entries = [parseMarkdown(decoder.decode(bytes))];
  else if (file.name.toLowerCase().endsWith('.zip')) {
    const codec = await preloadBackup(); let expanded = 0; let count = 0; const archivePaths = new Set<string>();
    const files = codec.unzipSync(bytes, { filter: item => {
      if (item.name.startsWith('/') || item.name.includes('\\') || item.name.split('/').some(s => s === '..' || !s) || !/^(manifest\.json|entries\/[a-zA-Z0-9_-]{1,100}\.md)$/.test(item.name)) throw new Error('备份包含不安全的文件路径。');
      if (archivePaths.has(item.name)) throw new Error('备份包含重复文件。'); archivePaths.add(item.name);
      expanded += item.originalSize; count++;
      if (expanded > MAX_EXPANDED_BYTES || item.originalSize > MAX_ARCHIVE_ENTRY_BYTES || count > MAX_ENTRIES + 1) throw new Error('备份解压后过大。');
      return true;
    } });
    if (!files['manifest.json']) throw new Error('备份缺少 manifest.json。');
    const manifest: unknown = JSON.parse(decoder.decode(files['manifest.json']));
    if (!manifest || typeof manifest !== 'object') throw new Error('备份清单不正确。');
    const m = manifest as Record<string, unknown>;
    if (m.format !== 'percival-diary' || m.version !== 1 || !Array.isArray(m.entries)) throw new Error('不支持此备份版本。');
    const paths = new Set<string>();
    entries = m.entries.map((item: unknown) => {
      if (!item || typeof item !== 'object') throw new Error('备份清单条目不正确。');
      const i = item as Record<string, unknown>;
      if (typeof i.id !== 'string' || i.path !== `entries/${i.id}.md` || typeof i.path !== 'string' || paths.has(i.path) || !files[i.path]) throw new Error('备份文件与清单不一致。');
      paths.add(i.path); const entry = parseMarkdown(decoder.decode(files[i.path]));
      if (entry.id !== i.id) throw new Error('备份条目编号不一致。'); return entry;
    });
    if (Object.keys(files).length !== entries.length + 1) throw new Error('备份包含清单之外的内容。');
  } else throw new Error('请选择 .md 或 .zip 备份。');
  validateEntries(entries);
  return { entries, count: entries.length, sealedCount: entries.filter(e => e.sealed).length, dates: entries.map(e => e.date).sort() };
}
