import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './comic-cursor.css';

/** Native cursors keep precise tracking; only click accents use an overlay. */
export function ComicCursor() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const burst = (event: PointerEvent) => {
      if (!pointer.matches || reduced.matches || event.pointerType !== 'mouse' || event.button !== 0 || document.documentElement.dataset.decor === 'off') return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable], :disabled, [aria-disabled="true"]')) return;
      const host = layer.current;
      if (!host) return;
      // Bound the work even during rapid clicking.
      if (host.children.length >= 6) host.firstElementChild?.remove();
      const mark = document.createElement('span');
      mark.className = 'comic-click';
      mark.style.left = `${event.clientX}px`;
      mark.style.top = `${event.clientY}px`;
      for (let i = 0; i < 6; i++) {
        const ray = document.createElement('i');
        ray.style.setProperty('--angle', `${i * 60 + 15}deg`);
        mark.append(ray);
      }
      host.append(mark);
      const timer = setTimeout(() => { mark.remove(); timers.delete(timer); }, 420);
      timers.add(timer);
    };
    window.addEventListener('pointerdown', burst, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', burst);
      timers.forEach(clearTimeout);
      layer.current?.replaceChildren();
    };
  }, []);
  return createPortal(<div ref={layer} className="comic-click-layer decor" aria-hidden="true"/>, document.body);
}
