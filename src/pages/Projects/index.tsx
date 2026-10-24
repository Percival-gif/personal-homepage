import { Link, useParams } from 'react-router-dom';
import { projects } from '../../data/projects';
import type { CreativeProject } from '../../data/projects';
import './projects.css';

function ProjectCard({ project, main = false }: { project: CreativeProject; main?: boolean }) {
  return <article className={`creative-card creative-card-${project.slug}${main ? ' creative-card-main' : ''}`}>
    <Link to={`/projects/${project.slug}`} className="creative-card-link">
      <figure className="creative-card-figure"><img src={project.image} alt={project.imageAlt} width={main ? 1122 : 1536} height={main ? 1402 : 1024} loading="lazy" decoding="async"/><figcaption className="mono">{project.imageNote}</figcaption><span className="creative-image-number decor display-en" aria-hidden="true">{project.number}</span></figure>
      <div className="creative-card-copy"><p className="creative-card-meta mono"><span>{project.category}</span><span>{project.status}</span></p><h3 className="display-en">{project.name}<span className="display-zh">{project.subtitle}</span></h3><p className="creative-card-question display-zh">{project.question}</p><p className="creative-card-summary">{project.summary}</p><div className="creative-card-bottom"><ul aria-label={`${project.subtitle}的主题`}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><span className="creative-card-open">走进作品 <span aria-hidden="true">↗</span></span></div></div>
    </Link>
  </article>;
}

export function FeaturedProjects() {
  return <section className="creative-featured" aria-labelledby="creative-featured-title">
    <header className="creative-section-heading"><div><p className="mono">SELECTED WORKS / THE CREATIVE GALLERY</p><h2 id="creative-featured-title" className="display-zh">作品，<br/>也是另一种自我介绍。</h2></div><div><p>从一个故事，到生活里的小工具。<br/>这里收录正在创作与探索的作品。</p><Link className="creative-all-link" to="/projects">进入创作展厅 ↗</Link></div></header>
    <ProjectCard project={projects[0]} main/>
    <div className="creative-secondary">{projects.slice(1).map(project => <ProjectCard key={project.slug} project={project}/>)}</div>
  </section>;
}

export default function Projects() {
  const { slug } = useParams();
  const project = projects.find(item => item.slug === slug);
  if (slug && !project) return <article className="creative-page creative-missing"><p className="mono">GALLERY / NOT FOUND</p><h1 className="display-zh">这件作品尚未收录。</h1><Link className="comic-button" to="/projects">返回创作展厅</Link></article>;
  if (!project) return <article className="creative-page"><header className="creative-gallery-hero"><p className="mono">PERCIVAL / CREATIVE GALLERY</p><h1 className="display-zh">创作<br/><span>展厅。</span></h1><p>一些想法，正在变成可以看见的东西。</p><span className="creative-gallery-mark decor display-en" aria-hidden="true">MAKE.<br/>FEEL.<br/>THINK.</span></header><FeaturedProjects/></article>;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <article className={`creative-page creative-detail creative-detail-${project.slug}`}>
    <header className="creative-detail-heading"><Link className="creative-back mono" to="/projects">← 创作展厅 / ALL WORKS</Link><div className="creative-detail-meta mono"><span>WORK / {project.number}</span><span>{project.category} · {project.status}</span></div><h1 className="display-en">{project.name}<span className="display-zh">{project.subtitle}</span></h1><p className="creative-detail-question display-zh">{project.question}</p></header>
    <div className="creative-detail-layout"><figure className="creative-detail-figure"><img src={project.image} alt={project.imageAlt} width={project.slug === 'after-you' ? 1122 : 1536} height={project.slug === 'after-you' ? 1402 : 1024} decoding="async"/><figcaption className="mono">{project.imageNote}</figcaption></figure><div className="creative-detail-intro"><p className="mono">ABOUT THIS WORK</p><p>{project.summary}</p><ul className="creative-detail-tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>{project.repository && <a className="comic-button" href={project.repository} target="_blank" rel="noreferrer">查看项目源码 ↗</a>}</div></div>
    <div className="creative-detail-reading"><aside className="creative-margin mono"><span>WORK NOTES</span><span className="display-en decor" aria-hidden="true">{project.number}</span></aside><div>{project.sections.map((section, index) => <section className="creative-prose-section" key={section.title}><p className="mono">0{index + 1} /</p><h2 className="display-zh">{section.title}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}</div></div>
    <footer className="creative-next"><Link to="/projects">返回展厅 ↗</Link><Link to={`/projects/${next.slug}`}><span className="mono">NEXT WORK</span><strong className="display-en">{next.name}</strong><span aria-hidden="true">↗</span></Link></footer>
  </article>;
}
