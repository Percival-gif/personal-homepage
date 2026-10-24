import {ArchiveNavigation,ArchiveIndex} from './components/ArchiveNavigation';
import {createContext,lazy,Suspense,useContext,useEffect,useRef,useState} from 'react';
import {Routes,Route,Link,useLocation,useNavigate} from 'react-router-dom';
const Landing=lazy(()=>import('./pages/Landing'));
const Corridor=lazy(()=>import('./pages/Corridor'));
const About=lazy(()=>import('./pages/About'));
const Work=lazy(()=>import('./pages/Work'));
const Now=lazy(()=>import('./pages/Now'));
const Projects=lazy(()=>import('./pages/Projects'));
const Notes=lazy(()=>import('./pages/Notes'));
const Diary=lazy(()=>import('./pages/Diary'));
const KitchenSink=lazy(()=>import('./components/ui/KitchenSink'));
type Transition=(path:string,color?:string)=>void;
const TransitionContext=createContext<Transition>(()=>undefined);
export function usePageTransition(){return useContext(TransitionContext);}
const names:Record<string,string>={'/':'起始页','/corridor':'涂鸦走廊','/about':'我是谁','/work':'我做过什么','/now':'我现在在做什么','/projects':'创作展厅','/notes':'公开随笔','/diary':'私人笔记本'};
export default function App(){
 const location=useLocation();const navigate=useNavigate();const main=useRef<HTMLElement>(null);
 const [cover,setCover]=useState<string>();const [decor,setDecor]=useState(true);const timer=useRef<ReturnType<typeof setTimeout>>();
 const transition:Transition=(path,color='var(--acid)')=>{if(timer.current)return;setCover(color);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;timer.current=setTimeout(()=>{navigate(path);setCover(undefined);timer.current=undefined;},reduced?120:450);};
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 useEffect(()=>{document.documentElement.dataset.decor=decor?'on':'off';},[decor]);
 useEffect(()=>{const observer=new MutationObserver(()=>setDecor(document.documentElement.dataset.decor!=='off'));observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-decor']});return()=>observer.disconnect();},[]);
 useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!['/','/corridor'].includes(location.pathname))navigate('/corridor');};window.addEventListener('keydown',handler);window.scrollTo(0,0);document.title='PERCIVAL · '+(names[location.pathname]??(location.pathname.startsWith('/notes/')?'公开随笔':location.pathname.startsWith('/projects/')?'创作展厅':'档案'));return()=>window.removeEventListener('keydown',handler);},[location.pathname,navigate]);
 return <TransitionContext.Provider value={transition}><button className="skip-link" onClick={()=>main.current?.focus()}>跳至内容</button>{!['/','/corridor'].includes(location.pathname)&&<header className="site-header"><Link to="/corridor" className="comic-button">← 回到走廊</Link><span>PERCIVAL / PERSONAL ARCHIVE</span><button className="comic-button" aria-pressed={!decor} onClick={()=>setDecor(!decor)}>{decor?'关闭装饰':'打开装饰'}</button></header>}<div className="sr-only" aria-live="polite">{names[location.pathname]??(location.pathname.startsWith('/notes/')?'公开随笔':location.pathname.startsWith('/projects/')?'创作展厅':'档案')}</div>{!['/','/corridor'].includes(location.pathname)&&<ArchiveNavigation currentPath={location.pathname}/>}<main id="main" ref={main} tabIndex={-1}><Suspense fallback={<p role="status">正在开门…</p>}><Routes><Route path="/" element={<Landing/>}/><Route path="/corridor" element={<Corridor/>}/><Route path="/about" element={<About/>}/><Route path="/work" element={<Work/>}/><Route path="/now" element={<Now/>}/><Route path="/projects" element={<Projects/>}/><Route path="/projects/:slug" element={<Projects/>}/><Route path="/notes" element={<Notes/>}/><Route path="/notes/:slug" element={<Notes/>}/><Route path="/diary" element={<Diary/>}/>{import.meta.env.DEV&&<Route path="/dev-kitchen-sink" element={<KitchenSink/>}/>}<Route path="*" element={<Corridor/>}/></Routes>{['/about','/work','/now','/notes','/projects'].includes(location.pathname)&&<ArchiveIndex currentPath={location.pathname}/>}</Suspense></main>{cover&&<div aria-hidden="true" style={{position:'fixed',inset:0,background:cover,zIndex:1000,pointerEvents:'all'}}/>}</TransitionContext.Provider>;
}
