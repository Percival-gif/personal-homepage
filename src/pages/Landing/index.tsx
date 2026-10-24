import {useCallback, useEffect, useLayoutEffect, useRef} from 'react';
import gsap from 'gsap';
import {usePageTransition} from '../../App';
import {profile} from '../../data/profile';
import {Link} from 'react-router-dom';
import './landing.css';
import { ArchiveIndex } from '../../components/ArchiveNavigation';
import { FeaturedProjects } from '../Projects';
import { Graffiti } from '../../components/Graffiti';

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
      if(event.target instanceof Element && event.target.closest('a, button, input, textarea, select'))return;
      if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||['Tab','Shift','Control','Alt','Meta','Escape','CapsLock'].includes(event.key))return;
      event.preventDefault();enter();
    };
    window.addEventListener('keydown',handler);
    return()=>window.removeEventListener('keydown',handler);
  },[enter]);
  return <><section className="landing" ref={root} aria-label="PERCIVAL 起始页">
    <div className="landing-grain decor" aria-hidden="true"/>
    <div className="landing-collage decor" aria-hidden="true"><span className="landing-blue-cutout"/><span className="landing-acid-checker"/><span className="landing-registration">＋</span></div>
    <header className="landing-topline mono"><span>PERSONAL ARCHIVE</span><span>{profile.location.city} / {profile.currentYear}</span><span className="landing-coordinate">INDEX — 00</span></header>
    <button type="button" className="landing-skip" onClick={enter}>跳过动画 ↗</button>
    <div className="landing-center">
      <div className="landing-kicker"><span className="mono">RESEARCH / PRACTICE / PERSONAL WORLD</span><span className="mono">VOL. 00 — OPEN EDITION</span></div>
      <div className="landing-wordmark-stage">
        <h1 className="landing-wordmark landing-reveal"><span className="sr-only">{profile.name}</span><img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" width="880" height="205" aria-hidden="true"/></h1>
        <svg className="landing-orbit decor" viewBox="0 0 1200 350" fill="none" aria-hidden="true"><path d="M-60 320C130 360 1080-70 1250 20M-30 300C180 340 1060-40 1230 40" stroke="currentColor" strokeWidth="2"/><path d="m1040 49 15-28 5 25 27 5-27 10-8 28-8-25-27-5Z" fill="var(--acid)" stroke="var(--ink)" strokeWidth="3"/></svg>
        <span className="landing-edition mono decor" aria-hidden="true">FIG. 01 / A WORK IN PROGRESS</span>
      </div>
      <div className="landing-afterword">
        <div className="landing-statement"><p className="landing-role mono">人工智能研究与工程实践 · NLP / LLM</p><h2 className="display-zh">从模型原理，<br/>到工程现场。</h2><p className="landing-position">关注大语言模型训练、可靠性与真实场景部署。</p></div>
        <div className="landing-art-note"><Graffiti variant="orbit" className="landing-graffiti" eager/><p className="landing-welcome landing-reveal display-en"><span className="sr-only">Welcome</span>{'Welcome'.split('').map((char,index)=><span aria-hidden="true" key={index}>{char}</span>)}<span className="landing-welcome-dot" aria-hidden="true">.</span></p><span className="mono">A FEW DOORS.<br/>A PERSONAL WORLD.</span></div>
      </div>
      <div className="landing-profile-strip"><span className="mono">CURRENT FILE ↗</span><p>{profile.education.at(-1)?.school} · {profile.education.at(-1)?.field} · {profile.education.at(-1)?.degree}</p><span className="landing-strip-cross decor" aria-hidden="true">/</span><p>{profile.currentWork.at(-1)?.company} · {profile.currentWork.at(-1)?.role}</p></div>
    </div>
    <footer className="landing-footer"><nav className="landing-direct" aria-label="直接浏览"><Link to="/projects"><span className="mono">01 / CREATIONS</span>创作展厅 ↗</Link><Link to="/notes"><span className="mono">02 / NOTES</span>公开随笔 ↗</Link></nav><button className="landing-enter landing-reveal" onClick={enter} type="button"><span><span className="mono">PRESS ANY KEY TO ENTER</span><strong className="display-zh">进入走廊</strong></span><svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true"><path d="M10 26h31M29 13l13 13-13 13" stroke="currentColor" strokeWidth="3"/></svg></button></footer>
  </section><FeaturedProjects/><ArchiveIndex/></>;
}
