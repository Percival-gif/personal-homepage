export type DiaryEntry = {
  id: string; date: string; createdAt: number; updatedAt: number;
  title?: string; body: string; mood?: 1|2|3|4|5;
  weather?: 'rain'|'sun'|'cloud'|'night'; tags: string[]; sealed: boolean;
};
export type DiaryInput = Omit<DiaryEntry, 'id'|'createdAt'|'updatedAt'> & {id?: string};
export interface DiaryStore {
  list(opts?: {from?: string; to?: string; q?: string}): Promise<DiaryEntry[]>;
  get(id: string): Promise<DiaryEntry | undefined>;
  upsert(input: DiaryInput): Promise<DiaryEntry>;
  remove(id: string): Promise<void>; seal(id: string): Promise<void>; unseal(id: string): Promise<void>;
  exportAll(): Promise<Blob>; importFile(file: File): Promise<{added: number; conflicts: number}>;
}
