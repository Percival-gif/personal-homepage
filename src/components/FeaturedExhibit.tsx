import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import './featured-exhibit.css';
export function FeaturedExhibit() {
  const project = projects[0];
  return <Link className="featured-exhibit" to={`/projects/${project.slug}`} aria-label={`本期展品：${project.name}，${project.subtitle}`}>
    <img src={project.image} alt="" width="1122" height="1402" decoding="async"/>
    <span className="featured-exhibit-copy"><span className="mono">本期展品 · {project.status}</span><strong className="display-en">{project.name}</strong><span>一场关于记忆与数字人格的重逢。</span><span className="featured-exhibit-action">走进作品 <span aria-hidden="true">↗</span></span></span>
  </Link>;
}
