import { Link } from 'react-router-dom';
import { doors, profile } from '../data/profile';
import './archive-navigation.css';

const descriptions = [
  '基本资料 / 语言 / 三段学历 / 研究方向',
  '学术成果 / Estrella / 华为经历 / 奖励',
  '两段 DeepSeek 任职 / 职责 / 四项能力',
  '本地书写 / 日历 / 封存 / 导入与导出',
];

export function ArchiveNavigation({ currentPath }: { currentPath: string }) {
  return <nav className="archive-navigation" aria-label="档案页面导航">
    <span className="archive-navigation-label mono">THE ARCHIVE<br/>章节索引 ↘</span>
    <div className="archive-navigation-links">{doors.map(door => <Link key={door.id} to={door.path} aria-current={currentPath === door.path ? 'page' : undefined}>
      <span className="display-en">{door.number}</span><span>{door.label}</span><span aria-hidden="true">↗</span>
    </Link>)}</div>
  </nav>;
}

export function ArchiveIndex({ currentPath, dark = false }: { currentPath?: string; dark?: boolean }) {
  return <section className={`archive-index${dark ? ' archive-index-dark' : ''}`} aria-labelledby="archive-index-title">
    <div className="archive-index-heading"><div><p className="mono">{profile.name.toUpperCase()} / COMPLETE INDEX</p><h2 id="archive-index-title" className="display-zh">翻开，<br/>不止这一页。</h2></div><span className="archive-index-star decor display-en" aria-hidden="true">✳</span><p>四个章节，<br/>从履历到一张属于你的纸。</p></div>
    <div className="archive-index-grid">{doors.map((door, index) => <Link className={`archive-index-card archive-index-card-${door.id}`} key={door.id} to={door.path} aria-current={currentPath === door.path ? 'page' : undefined}>
      <div className="archive-index-card-top mono"><span>FILE / {door.number}</span><span>{currentPath === door.path ? '正在阅读' : '打开章节 ↗'}</span></div>
      <span className="archive-index-word display-en" aria-hidden="true">{door.english}</span><h3 className="display-zh">{door.label}</h3><p>{descriptions[index]}</p><span className="archive-index-number decor display-en" aria-hidden="true">{door.number}</span>
    </Link>)}</div>
  </section>;
}
