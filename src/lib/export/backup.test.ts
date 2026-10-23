import { afterEach, describe, expect, it, vi } from 'vitest';
import { entryMarkdown, exportEntries, previewImport } from './backup';
import * as codec from './codec';
import type { DiaryEntry } from '../diary/types';
import { MAX_BODY_LENGTH, MAX_ENTRIES, MAX_EXPANDED_BYTES, MAX_FILE_BYTES } from '../diary/validation';

const encoder = new TextEncoder();
const entry = (id: string, body = ''): DiaryEntry => ({ id, date: '2026-10-23', createdAt: 100, updatedAt: 200, body, tags: [], sealed: false });
const zipFile = (blob: Blob) => new File([blob], 'backup.zip');
afterEach(() => vi.restoreAllMocks());

describe('recoverable diary exports', () => {
  it('rejects the highly compressible seven-entry Chinese backup before making a ZIP', async () => {
    const zip = vi.spyOn(codec, 'zipSync');
    const entries = Array.from({ length: 7 }, (_, i) => entry(`large-${i}`, '中'.repeat(800000)));
    await expect(exportEntries(entries)).rejects.toThrow(/16MB.*单篇 MD.*分批/);
    expect(zip).not.toHaveBeenCalled();
  });

  it('counts UTF-8 metadata and manifest exactly at the shared expanded-size boundary', async () => {
    const entries = Array.from({ length: 7 }, (_, i) => entry(`boundary-${i}`, i < 6 ? '中'.repeat(900000) : ''));
    const manifest = { format: 'percival-diary', version: 1, entries: entries.map(e => ({ id: e.id, path: `entries/${e.id}.md` })) };
    const used = encoder.encode(JSON.stringify(manifest, null, 2)).byteLength + entries.reduce((sum, e) => sum + encoder.encode(entryMarkdown(e)).byteLength, 0);
    const remaining = MAX_EXPANDED_BYTES - used;
    expect(remaining).toBeGreaterThan(0); expect(remaining).toBeLessThan(MAX_BODY_LENGTH);
    entries[6].body = 'a'.repeat(remaining);
    const blob = await exportEntries(entries);
    const preview = await previewImport(zipFile(blob));
    expect(preview.count).toBe(7);
    expect(preview.entries.map(e => e.body.length)).toEqual(entries.map(e => e.body.length));
    expect(preview.entries[0].body).toBe(entries[0].body);
    entries[6].body += 'a';
    await expect(exportEntries(entries)).rejects.toThrow('16MB');
  });

  it('rejects a compressed ZIP exceeding the import file limit', async () => {
    vi.spyOn(codec, 'zipSync').mockReturnValueOnce(new Uint8Array(MAX_FILE_BYTES + 1));
    await expect(exportEntries([entry('a')])).rejects.toThrow(/ZIP.*8MB.*单篇 MD.*分批/);
  });

  it('validates every entry, duplicate IDs and the entry count before archive creation', async () => {
    const zip = vi.spyOn(codec, 'zipSync');
    await expect(exportEntries(Array.from({ length: MAX_ENTRIES + 1 }, (_, i) => entry(`id-${i}`)))).rejects.toThrow(/5000.*单篇 MD.*分批/);
    await expect(exportEntries([entry('a'), entry('a')])).rejects.toThrow('重复');
    await expect(exportEntries([entry('a'), { ...entry('b'), mood: 9 as 1 }])).rejects.toThrow('心情');
    await expect(exportEntries([{ ...entry('a'), updatedAt: 1e300 }])).rejects.toThrow('时间');
    expect(zip).not.toHaveBeenCalled();
  });

  it('exports a maximum-length Unicode MD that imports with all metadata intact', async () => {
    const original = { ...entry('single', '中'.repeat(MAX_BODY_LENGTH)), title: '标题', mood: 5 as const, weather: 'rain' as const, tags: ['雨'], sealed: true };
    const blob = new Blob([entryMarkdown(original)], { type: 'text/markdown;charset=utf-8' });
    expect(blob.size).toBeLessThan(MAX_FILE_BYTES);
    const preview = await previewImport(new File([blob], 'single.md'));
    expect(preview.entries).toEqual([original]);
    expect(() => entryMarkdown({ ...original, body: 'a'.repeat(MAX_BODY_LENGTH + 1) })).toThrow('正文');
    expect(() => entryMarkdown({ ...original, date: '2026-02-30' })).toThrow('日期');
  });
});
