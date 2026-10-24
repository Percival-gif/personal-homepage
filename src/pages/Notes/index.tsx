import { Link, useParams } from 'react-router-dom';
import { publicNotes } from '../../data/notes';
import { Graffiti } from '../../components/Graffiti';
import './notes.css';

export default function Notes() {
  const { slug } = useParams();
  const note = publicNotes.find(item => item.slug === slug);
  if (slug && !note) return <article className="notes-page notes-missing"><p className="mono">NOTES / NOT FOUND</p><h1 className="display-zh">这一页尚未收录。</h1><Link className="comic-button" to="/notes">返回公开随笔</Link></article>;
  if (note) return <article className="notes-page note-reader">
    <header className="note-reader-header"><Link to="/notes" className="notes-back mono">← 公开随笔 / ALL NOTES</Link><p className="mono">{note.category} / {note.number}</p><h1 className="display-zh">{note.title}</h1><p className="note-reader-deck">{note.summary}</p><span className="note-source mono">PERCIVAL · 研究与实践摘录</span></header>
    <div className="note-reader-layout"><aside className="note-margin mono"><span>READING ROOM / 04</span><span className="display-en decor" aria-hidden="true">{note.number}</span><p>从本站已公开的研究与实践说明中整理。</p></aside><div className="note-prose">{note.sections.map((section, index) => <section key={section.title}><p className="mono">§ 0{index + 1}</p><h2 className="display-zh">{section.title}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}<footer><Link to={note.related}>{note.relatedLabel} ↗</Link><Link to="/notes">返回随笔目录 ↗</Link></footer></div></div>
  </article>;
  return <article className="notes-page">
    <header className="notes-hero"><div className="notes-topline mono"><span>ROOM D / THE READING ROOM</span><span>PUBLIC NOTES</span></div><div className="notes-title"><h1 className="display-zh">我在<br/><span>想什么？</span></h1><div className="notes-cover decor" aria-hidden="true"><span className="display-en">WORDS<br/>& IDEAS.</span><Graffiti variant="orbit" eager/><span className="mono">READ / THINK / RETURN</span></div></div><div className="notes-hero-bottom"><p>公开的思考，留给路过的人。<br/><span>从研究、实践与工作方法中，翻开几页。</span></p><span className="display-en decor" aria-hidden="true">04↘</span></div></header>
    <section className="notes-collection" aria-labelledby="notes-index-title"><div className="notes-index-heading"><h2 id="notes-index-title" className="display-zh">研究与实践摘记</h2><p>整理自本站已公开的介绍与项目说明。</p></div>{publicNotes.map(note => <Link to={`/notes/${note.slug}`} className={`note-entry note-entry-${note.number}`} key={note.slug}><span className="note-entry-number display-en">{note.number}</span><div><p className="mono">{note.category} / {note.english}</p><h3 className="display-zh">{note.title}</h3><p className="note-entry-summary">{note.summary}</p></div><span className="note-entry-arrow" aria-hidden="true">↗</span></Link>)}</section>
    <aside className="notes-private"><div><p className="mono">A SEPARATE SPACE / LOCAL ONLY</p><h2 className="display-zh">还有一张，只属于你的纸。</h2><p>私人笔记本独立于公开随笔，内容仅保存在当前浏览器，不会发布到这里。</p></div><Link to="/diary" className="comic-button">打开私人笔记本 ↗</Link></aside>
  </article>;
}
