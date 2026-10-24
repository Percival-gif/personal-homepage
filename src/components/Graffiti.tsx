import atlas from '../assets/art/graffiti-atlas.webp';
import './graffiti.css';

export type GraffitiVariant = 'neural' | 'orbit' | 'terminal' | 'arrow';

/** Original image-generated art, cropped by CSS from a shared transparent sheet. */
export function Graffiti({ variant, className = '', eager = false }: { variant: GraffitiVariant; className?: string; eager?: boolean }) {
  return <span className={`graffiti graffiti--${variant} decor ${className}`} aria-hidden="true">
    <img src={atlas} alt="" width="1152" height="768" loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false}/>
  </span>;
}
