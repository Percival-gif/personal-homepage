import {useCallback, useEffect, useLayoutEffect, useRef} from 'react';
import gsap from 'gsap';
import {usePageTransition} from '../../App';
import {profile} from '../../data/profile';
import {Sticker} from '../../components/ui';
import './landing.css';

export default function Landing(){
  const root=useRef<HTMLElement>(null);
  const transition=usePageTransition();
  const entering=useRef(false);
  const entryTween=useRef<gsap.core.Tween>();
  const navigationTimer=useRef<ReturnType<typeof setTimeout>>();
  const enter=useCallback(()=>{
    if(entering.current)return;
    entering.current=true;
    const navigate=()=>transition('/corridor','var(--acid)');
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){navigate();return;}
    const center=root.current?.querySelector('.landing-center');
    if(!center){navigate();return;}
    entryTween.current=gsap.to(center,{scale:1.1,z:120,duration:.75,ease:'power3.inOut'});
    navigationTimer.current=setTimeout(navigate,750);
  },[transition]);
  useEffect(()=>()=>{entryTween.current?.kill();clearTimeout(navigationTimer.current);},[]);
  useLayoutEffect(()=>{
    if(!root.current)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let finishTimer:ReturnType<typeof setTimeout>|undefined;
    const context=gsap.context(()=>{
      if(reduced)return;
      const sequence=gsap.timeline();
      sequence.fromTo('.landing-wordmark',{opacity:0},{opacity:1,duration:.8,ease:'power2.out'},0)
        .fromTo('.landing-welcome > span',{opacity:0},{opacity:1,duration:.28,stagger:.075},.6)
        .fromTo('.landing-enter',{opacity:0},{opacity:1,duration:.3},1.6);
      // A background tab may throttle animation frames; the entrance must still finish.
      finishTimer=setTimeout(()=>{sequence.progress(1);gsap.set('.landing-wordmark, .landing-welcome, .landing-welcome > span, .landing-enter',{opacity:1});},2100);
    },root);
    return()=>{clearTimeout(finishTimer);context.revert();};
  },[]);
  useEffect(()=>{
    const handler=(event:KeyboardEvent)=>{
      if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||['Tab','Shift','Control','Alt','Meta','Escape','CapsLock'].includes(event.key))return;
      event.preventDefault();enter();
    };
    window.addEventListener('keydown',handler);
    return()=>window.removeEventListener('keydown',handler);
  },[enter]);
  return <section className="landing" ref={root} aria-label="PERCIVAL 起始页">
    <div className="landing-grain decor" aria-hidden="true"/>
    <header className="landing-topline mono"><span>PERSONAL ARCHIVE</span><span>{profile.location.city} / {profile.currentYear}</span><span className="landing-coordinate">INDEX — 00</span></header>
    <button type="button" className="landing-skip" onClick={enter}>跳过动画 ↗</button>
    <div className="landing-center">
      <div className="landing-kicker"><span className="mono">A FEW DOORS. A PERSONAL WORLD.</span><span className="landing-small-star decor" aria-hidden="true">✳</span></div>
      <h1 className="landing-wordmark landing-reveal"><span className="sr-only">{profile.name}</span><img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" width="880" height="205" aria-hidden="true"/><svg className="landing-logo-star decor" viewBox="0 0 100 100" aria-hidden="true"><path d="m50 2 8 28 24-16-10 28 26 8-28 9 16 24-28-11-8 27-9-28-25 16 12-28L2 50l28-8-16-25 28 11z" fill="currentColor"/></svg></h1>
      <div className="landing-afterword"><Sticker tone="paper" rotate={-3}>从这里，打开一扇门。</Sticker><p className="landing-welcome landing-reveal display-zh" aria-label="Welcome">{'Welcome'.split('').map((char,index)=><span aria-hidden="true" key={index}>{char}</span>)}<span className="landing-welcome-dot" aria-hidden="true">.</span></p><span className="landing-side-note mono">NLP / LLM</span></div>
    </div>
    <footer className="landing-footer"><span className="landing-footer-code mono">PERCIVAL<br/>OPEN THE ARCHIVE ↗</span><button className="landing-enter landing-reveal" onClick={enter} type="button"><span><span className="mono">PRESS ANY KEY TO ENTER</span><strong className="display-zh">进入走廊</strong></span><svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true"><path d="M10 26h31M29 13l13 13-13 13" stroke="currentColor" strokeWidth="3"/></svg></button><span className="landing-footer-number display-en decor" aria-hidden="true">00</span></footer>
  </section>;
}
