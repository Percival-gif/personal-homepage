import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type Tone = 'paper' | 'ink' | 'acid' | 'blue' | 'magenta' | 'amber' | 'teal';
type CommonProps<T extends HTMLElement> = HTMLAttributes<T> & { children?: ReactNode; tone?: Tone };
const cx = (...values: (string | undefined | false)[]) => values.filter(Boolean).join(' ');

export function Panel({ children, tone = 'paper', className, ...props }: CommonProps<HTMLElement>) {
  return <section {...props} className={cx('panel', `tone-${tone}`, className)}>{children}</section>;
}
export function Sticker({ children, tone = 'acid', rotate = -2, className, style, ...props }: CommonProps<HTMLSpanElement> & { rotate?: number }) {
  return <span {...props} className={cx('sticker', `tone-${tone}`, className)} style={{ ...style, '--sticker-rotation': `${rotate}deg` } as CSSProperties}>{children}</span>;
}
export function Stamp({ children, className, tone = 'ink', ...props }: CommonProps<HTMLSpanElement>) {
  return <span {...props} className={cx('stamp', `stamp-${tone}`, className)}>{children}</span>;
}
export function Tape({ className, ...props }: Omit<HTMLAttributes<HTMLSpanElement>, 'children'>) {
  return <span {...props} className={cx('tape', 'decor', className)} aria-hidden="true" />;
}
export function PaperSheet({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx('paper-sheet', className)}>{children}</div>;
}
const moodLabels = ['很低落', '有些低落', '平静', '心情不错', '很开心'];
export function MoodStamp({ mood, className }: { mood?: 1 | 2 | 3 | 4 | 5; className?: string }) {
  const paths = ['M15 33 Q25 20 35 33', 'M16 31 Q25 25 34 31', 'M16 29 L34 29', 'M15 27 Q25 38 35 27', 'M14 26 Q25 42 36 26 Z'];
  return <span className={cx('mood-stamp', className)} role="img" aria-label={mood ? moodLabels[mood - 1] : '未选择心情'}><svg width="48" height="48" viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="21" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="17" cy="20" r="2" fill="currentColor"/><circle cx="33" cy="20" r="2" fill="currentColor"/><path d={mood ? paths[mood - 1] : paths[2]} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg></span>;
}
export function TagChip({ children, onRemove, className }: { children: ReactNode; onRemove?: () => void; className?: string }) {
  return <span className={cx('tag-chip', className)}><span>{children}</span>{onRemove && <button type="button" onClick={onRemove} aria-label={`移除标签 ${typeof children === 'string' ? children : ''}`}>×</button>}</span>;
}
export function BigNumber({ value, label, className }: { value: string | number; label: string; className?: string }) {
  return <div className={cx('big-number', className)}><strong className="display-en">{value}</strong><span>{label}</span></div>;
}
export function SectionTitle({ number, eyebrow, children, className }: { number?: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return <div className={cx('section-title', className)}>{number && <span className="section-number display-en">{number}</span>}<div>{eyebrow && <p className="eyebrow mono">{eyebrow}</p>}<h2 className="display-zh">{children}</h2></div></div>;
}
export function Burst({ className, children }: { className?: string; children?: ReactNode }) {
  return <span className={cx('burst', 'decor', className)} aria-hidden="true">{children}</span>;
}
