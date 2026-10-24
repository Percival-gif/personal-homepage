import { useEffect, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { doors, profile } from '../../data/profile';
import type { Door } from '../../data/profile';
import { usePageTransition } from '../../App';
import './corridor.css';
import { ArchiveIndex } from '../../components/ArchiveNavigation';
import { Graffiti } from '../../components/Graffiti';

function RoomDrawing() {
  return <svg className="corridor-room decor" viewBox="0 0 1440 750" preserveAspectRatio="none" aria-hidden="true">
    <g fill="none" vectorEffect="non-scaling-stroke">
      <g className="room-structure">
        <path d="M0 0 650 280H790L1440 0M0 750 650 435H790L1440 750M650 280V435M790 280V435"/>
        <path d="M0 150 650 300M1440 150 790 300M0 410 650 361M1440 410 790 361"/>
        <path d="M163 0 666 280M1277 0 774 280M441 0 694 280M999 0 746 280"/>
        <path d="M172 750 668 435M1268 750 772 435M479 750 700 435M961 750 740 435"/>
        <path d="M0 676H1440M150 582H1290M350 511H1090M500 467H940"/>
      </g>
      <g className="room-portals">
        <path d="M167 65 167 658M1273 65V658M167 65H1273M167 658H1273"/>
        <path d="M393 170H1047V547H393ZM540 234H900V478H540ZM611 264H829V448H611Z"/>
      </g>
      <g className="room-accent-left"><path d="M0 740 650 428V283L112 52M24 735l20-10m32-16 20-10M172 62H330M402 171H518M547 235H609"/></g>
      <g className="room-accent-right"><path d="M1440 740 790 428V283L1328 52M1268 62H1110M1038 171H922M893 235H831"/></g>
      <g className="room-light"><path d="M574 18H866M631 121H809M671 194H769M692 241H748"/><path d="M655 702l65-36 65 36m-52-18v50"/></g>
      <g className="room-register"><path d="M698 319h12m20 0h12m-44 35h12m20 0h12M720 310v10m0 33v10"/></g>
      <g className="room-near-frame"><path d="M3 3h110v30H33v110M1437 3h-110v30h80v110M3 747h110v-30H33v-110m1404 140h-110v-30h80v-110"/></g>
      <g className="room-wall-notations"><path d="m220 129 180 81v25l-180-73Zm1020 0-180 81v25l180-73ZM245 545l145-62m-145 83 145-62m705 41-145-62m145 83-145-62"/><path d="m291 139 16-24 21 38m788-14-16-24-21 38M470 350l47-15 31 18-47 16Zm452 0 47-15 31 18-47 16Z"/></g>
      <g className="room-floor-route"><path d="M559 750 699 452h42l140 298M633 614h174M661 554h118"/></g>
    </g>
  </svg>;
}

function DoorDrawing({ id }: { id: string }) {
  return <svg className={`corridor-door-art corridor-door-art-${id} decor`} viewBox="0 0 220 260" aria-hidden="true">
    {id === 'A' && <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="m60 70 16-36 31 23 36-26 20 41M53 117c-12 66 17 115 57 118 42 2 70-55 56-113M48 116l31-32 32 28 32-28 36 32"/><path d="M54 131h49v28H57Zm64 0h49l-3 28h-46Zm-15 8h15m-38 53 31 9 24-9M29 219l26-9m116-12 20 13"/><path d="m19 58 5-13 6 13 14 5-14 5-6 14-5-14-13-5Zm161 156 6-17 7 17 17 7-17 6-7 18-6-18-16-6Z"/></g>}
    {id === 'B' && <g fill="none" stroke="currentColor" strokeWidth="3"><path d="M31 72h158v113H31ZM31 92h158M44 82h4m8 0h4m8 0h4M68 118l-19 19 19 18m83-37 19 19-19 18m-38-42-17 47M70 185v19h81v-19M55 205h111"/><path d="m28 220 43-9 9 29-43 10Zm123-186 11-24 7 18 25 4-24 13-1 22-14-14-21 5Z"/></g>}
    {id === 'C' && <g fill="none" stroke="currentColor" strokeWidth="3"><circle cx="110" cy="141" r="61"/><ellipse cx="110" cy="141" rx="27" ry="61"/><path d="M49 141h122M60 106h100M60 176h100"/><ellipse cx="110" cy="141" rx="98" ry="28" transform="rotate(-35 110 141)"/><path d="m143 47 17-6-3 17m30 138 9 15 14-9M42 63l9 9m-25 14h14M94 234h40"/><circle cx="31" cy="195" r="8" fill="currentColor"/></g>}
    {id === 'D' && <g fill="none" stroke="currentColor" strokeWidth="3"><path d="M46 67h128v164H46ZM66 67v164M83 99h66M83 119h47M83 177h62M83 197h48"/><path d="m131 150 37-60 13 9-37 60-18 11Zm37-60 6-9 14 9-7 9M33 88h24m-24 28h24m-24 28h24m-24 28h24m-24 28h24M103 43l-7-15m28 14 8-14"/></g>}
  </svg>;
}

export default function Corridor() {
  const navigate = usePageTransition();
  const [open, setOpen] = useState<string>();
  const [armed, setArmed] = useState<string>();
  const [compact, setCompact] = useState(() => matchMedia('(max-width: 639px)').matches);
  const [decor, setDecor] = useState(() => document.documentElement.dataset.decor !== 'off');
  useEffect(() => {
    const media = matchMedia('(max-width: 639px)');
    const change = () => { setCompact(media.matches); setOpen(undefined); setArmed(undefined); };
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  const changeLayout = (list: boolean) => { setCompact(list); setOpen(undefined); setArmed(undefined); };
  const enter = (door: Door) => navigate(door.path, `var(--${door.tone})`);
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, door: Door) => {
    if (event.key !== 'Enter' || compact) return;
    event.preventDefault();
    if (armed === door.id) enter(door);
    else { setArmed(door.id); setOpen(door.id); }
  };
  const toggleDecor = () => { document.documentElement.dataset.decor = decor ? 'off' : 'on'; setDecor(!decor); };
  return <section className="corridor-page" data-layout={compact ? 'list' : 'space'} data-active-room={open ?? ''} aria-labelledby="corridor-title">
    <header className="corridor-masthead"><Link className="corridor-home display-en" to="/" aria-label="回到起始页">{profile.name.toUpperCase()}<span className="mono">PERSONAL<br/>ARCHIVE</span></Link><span className="corridor-system mono" aria-hidden="true">〔 EXPLORE / 01—04 〕</span><div className="corridor-tools"><div className="corridor-view-switch mono" role="group" aria-label="走廊显示方式"><button type="button" aria-pressed={!compact} onClick={() => changeLayout(false)}>走廊</button><button type="button" aria-pressed={compact} onClick={() => changeLayout(true)}>列表</button></div><button type="button" className="corridor-decor-button mono" aria-pressed={!decor} onClick={toggleDecor}>{decor ? '装饰 ON' : '装饰 OFF'}</button></div></header>
    <div className="corridor-intro"><div><p className="mono">EXHIBITION INDEX / PICK A DOOR.</p><h1 className="display-zh" id="corridor-title">选一扇<span>门。</span><svg className="corridor-title-mark decor" viewBox="0 0 100 60" aria-hidden="true"><path d="m5 28 15 21 23-40 10 36 32-31-6 34M12 55l77-7" fill="none" stroke="currentColor" strokeWidth="5"/></svg></h1></div><p className="corridor-instructions">{compact ? '四间展厅，四种观看方式。' : '沿着线条，进入我的世界。'}<span className="mono">{compact ? 'TAP TO OPEN / TAP TO ENTER' : 'TAB → ENTER → ENTER'}</span></p></div>
    <div className="corridor-scene" aria-label="四扇可进入的门与四扇远处装饰门">
      <RoomDrawing/>
      <div className="corridor-wall-type corridor-wall-type-left decor display-en" aria-hidden="true">OPEN</div>
      <div className="corridor-wall-type corridor-wall-type-right decor display-en" aria-hidden="true">MIND</div>
      <div className="corridor-neon decor mono" aria-hidden="true"><span>KEEP</span><strong className="display-en">CURIOUS.</strong><svg className="corridor-end-emblem" viewBox="0 0 80 80"><path d="m40 5 7 23 23-8-14 20 19 15-25-1-10 22-8-23-26 3 19-17-13-20 22 9Z" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="40" cy="40" r="8" fill="currentColor"/></svg><span className="corridor-end-code">P / 00</span></div>
      {doors.map(door => <article key={door.id} className={`corridor-door corridor-door-${door.id}${open === door.id ? ' is-open' : ''}`} style={{ '--door-color': `var(--${door.tone})` } as CSSProperties}>
        <button className="corridor-door-button" type="button" aria-expanded={open === door.id} aria-controls={`inside-${door.id}`} aria-label={`${door.number} ${door.label}`} onMouseEnter={() => { if (!compact) setOpen(door.id); }} onMouseLeave={() => { if (!compact && document.activeElement?.id !== `door-${door.id}`) setOpen(undefined); }} onFocus={() => { if (!compact) setOpen(door.id); }} onBlur={() => { setArmed(undefined); if (!compact) setOpen(undefined); }} onKeyDown={event => handleKey(event, door)} onClick={() => { if (compact) setOpen(open === door.id ? undefined : door.id); else enter(door); }} id={`door-${door.id}`}>
          <span className="corridor-door-reveal" aria-hidden="true"><span className="corridor-door-arrow">↗</span><span className="mono">{door.english}</span></span>
          <span className="corridor-door-panel"><span className="corridor-door-topline mono"><span>ROOM / {door.id}</span><span>↗</span></span><span className="corridor-door-number display-en">{door.number}</span>{door.id === 'D' ? <DoorDrawing id={door.id}/> : <Graffiti variant={door.id === 'A' ? 'neural' : door.id === 'B' ? 'terminal' : 'orbit'} className="corridor-generated-art" eager/>}<span className="corridor-door-sticker display-en">{door.english}</span><span className="corridor-door-handle decor" aria-hidden="true"/><span className="corridor-door-checks decor" aria-hidden="true"/></span>
          <span className="corridor-door-label display-zh">{door.label}<span aria-hidden="true">↗</span></span>
        </button>
        <div className="corridor-door-inside" id={`inside-${door.id}`} hidden={compact && open !== door.id}><span className="mono">{door.id === 'D' ? 'PUBLIC NOTES' : door.id === 'A' ? 'PERSON / BACKGROUND' : door.id === 'B' ? 'RESEARCH / PRACTICE' : 'WORK IN PROGRESS'}</span>{compact && <button type="button" className="comic-button" onClick={() => enter(door)}>进去 <span aria-hidden="true">→</span></button>}</div>
      </article>)}
      {['05', '06', '07', '08'].map((number, index) => <div key={number} className={`corridor-distant corridor-distant-${index + 1} decor`} aria-hidden="true"><span className="mono">{number}</span><i/></div>)}
      <div className="corridor-coordinate decor mono" aria-hidden="true"><span>〔</span> + <span>〕</span></div>
    </div>
    <footer className="corridor-footer mono"><span>{profile.location.city} · {profile.currentYear}</span><span>FOUR DOORS. ONE PERSON.</span><span aria-hidden="true">SCROLL THROUGH THE STORIES ↗</span></footer>
    <ArchiveIndex dark/>
  </section>;
}
