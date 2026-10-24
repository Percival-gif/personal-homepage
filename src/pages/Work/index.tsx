import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BigNumber, Panel, SectionTitle, Stamp, Sticker, Tape } from '../../components/ui';
import { pageLabels, profile } from '../../data/profile';
import './work.css';

const contents = [
  { id: 'work-results', label: '学术成果', english: 'ACADEMIA' },
  { id: 'work-estrella', label: 'Estrella', english: 'CASE FILE' },
  { id: 'work-industry', label: '产业经历', english: 'INDUSTRY' },
  { id: 'work-honors', label: '荣誉记录', english: 'RECOGNITION' },
];

export default function Work() {
  const { academic, industry } = profile;
  const honors = [
    ...industry.awards.map(award => ({ ...award, context: industry.company })),
    ...academic.project.awards.map(award => ({ ...award, context: academic.project.name })),
  ];
  const { hash } = useLocation();
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <article className="work-page page-shell">
      <header className="work-hero">
        <div className="work-hero-meta"><p className="mono">02 / WORK & RESEARCH</p><Stamp tone="acid">研究与实践</Stamp></div>
        <h1 className="display-zh"><span>{pageLabels['/work']}</span></h1>
        <div className="work-hero-bottom"><span className="display-en">WORK.</span><div className="work-hero-ticket"><span className="mono">ARCHIVE / 02</span><p className="display-zh">学术 × 产业</p><span className="mono">RESEARCH / PRACTICE</span></div><svg className="work-hero-mark decor" aria-hidden="true" viewBox="0 0 160 80"><path d="M7 28c40-24 107-11 114 10 7 20-30 32-54 16-22-15 16-31 77-27m-18-15 21 15-23 18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        <div className="work-hero-registration decor" aria-hidden="true"><span>+</span><span>02</span><span>+</span></div>
      </header>

      <nav className="work-contents" aria-label="本页目录">
        <span className="work-contents-label mono">FILE INDEX ↗</span>
        {contents.map((item, index) => <Link key={item.id} to={{ pathname: '/work', hash: `#${item.id}` }}><span className="display-en">0{index + 1}</span><span>{item.label}<small className="mono">{item.english}</small></span><span aria-hidden="true">↗</span></Link>)}
      </nav>

      <div className="work-split page-section">
        <section className="work-academic" aria-labelledby="work-results">
          <header className="work-column-heading"><span className="mono">SIDE A / ACADEMIA</span><h2 id="work-results" tabIndex={-1} className="display-zh">学术成果。</h2><span className="work-heading-rule decor" aria-hidden="true"/></header>
          <div className="work-metrics" aria-label="学术成果统计">{academic.metrics.map((metric, index) => <div key={metric.label} className={`work-metric work-metric-${index + 1}`}><BigNumber value={metric.value} label={metric.label}/></div>)}</div>
          <Panel className="work-results-note">
            <p className="mono">SELF-REPORTED / 统计口径来自本人资料</p>
            <p className="work-academic-summary">{academic.summary}</p>
            <p className="work-academic-summary">{academic.perspective}</p>
          </Panel>
          <Panel className="work-conference">
            <p className="mono">RESEARCH / METHODS & EXPERIMENTS</p>
            <h3 className="display-zh">{academic.conference.title}</h3>
            {academic.conference.paragraphs.map(text => <p key={text}>{text}</p>)}
          </Panel>

          <section className="work-case" aria-labelledby="work-estrella">
            <div className="work-case-heading"><div><p className="mono">RESEARCH / CASE FILE</p><h3 id="work-estrella" tabIndex={-1} className="display-en">{academic.project.name}</h3></div><Sticker tone="magenta" rotate={2}>CASE STUDY</Sticker></div>
            <p className="work-case-organization">{academic.project.organization}</p>
            <Panel className="work-case-summary"><Tape/><p className="mono">项目说明 / PROJECT NOTES</p><p>{academic.project.summary}</p><p>{academic.project.perspective}</p></Panel>
            <ol className="work-case-panels">{academic.project.steps.map((step, index) => <li key={step.title}>
              <div className="work-frame-top"><span className="mono">FRAME / 0{index + 1}</span><span className="work-frame-arrow decor" aria-hidden="true">↗</span></div>
              <h4 className="display-zh">{step.title}</h4><p>{step.body}</p>
            </li>)}</ol>
          </section>
        </section>

        <section className="work-industry" aria-labelledby="work-industry">
          <header className="work-column-heading"><span className="mono">SIDE B / INDUSTRY</span><h2 id="work-industry" tabIndex={-1} className="display-zh">产业经历。</h2><span className="work-heading-rule decor" aria-hidden="true"/></header>
          <Panel className="work-employment">
            <Tape/>
            <div className="work-employment-meta"><span className="mono">EXPERIENCE / 01</span><Stamp tone="blue">{industry.period}</Stamp></div>
            <h3 className="work-company display-zh">{industry.company}</h3>
            <p className="work-department">{industry.department}</p>
            <div className="work-responsibilities">{industry.responsibilities.map((responsibility, index) => <div key={responsibility}><span className="work-responsibility-marker display-en" aria-hidden="true">0{index + 1}</span><p>{responsibility}</p></div>)}</div>
            <div className="work-employment-footer"><span className="mono">INDUSTRY / FIELD NOTES</span><span className="work-mini-checks decor" aria-hidden="true"/></div>
          </Panel>

          <section className="work-awards" aria-labelledby="work-honors">
            <div id="work-honors" tabIndex={-1}><SectionTitle eyebrow="RECOGNITION">荣誉记录。</SectionTitle></div>
            <div className="work-awards-list">{honors.map((award, index) => <Panel className={`work-award work-award-${index + 1}`} key={`${award.context}-${award.title}`} data-award-status={award.status}>
              <span className="work-award-ticket mono">RECORD / 0{index + 1}</span>
              <div className="work-award-medal decor" aria-hidden="true">{award.status === '获奖'
                ? <svg viewBox="0 0 100 120" fill="none"><path d="m25 76-5 39 30-17 30 17-5-39" stroke="currentColor" strokeWidth="3"/><path d="m50 5 9 7 12-1 6 11 11 6-1 12 7 9-7 10 1 12-11 6-6 11-12-1-9 7-9-7-12 1-6-11-11-6 1-12-7-10 7-9-1-12 11-6 6-11 12 1Z" fill="var(--paper)" stroke="currentColor" strokeWidth="3"/><circle cx="50" cy="49" r="27" stroke="currentColor" strokeWidth="2"/><path d="m36 49 9 10 20-23" stroke="currentColor" strokeWidth="4"/></svg>
                : <svg viewBox="0 0 100 120" fill="none"><path d="M16 8h68v100H16zM29 25h42M29 37h26" stroke="currentColor" strokeWidth="3"/><circle cx="50" cy="73" r="19" stroke="currentColor" strokeWidth="3"/><path d="M50 60v26M37 73h26m-22-9 18 18m0-18L41 82" stroke="currentColor" strokeWidth="3"/></svg>}
              </div>
              <div className="work-award-copy"><p className="mono">{award.context}{award.date ? ` / ${award.date}` : ''}</p><h3 className="display-zh">{award.title}</h3><Stamp tone={award.status === '提名' ? 'magenta' : 'ink'}>{award.status}</Stamp><p className="work-award-detail">{award.detail}</p></div>
            </Panel>)}</div>
          </section>
        </section>
        <span className="work-seam-arrow decor" aria-hidden="true">↔</span>
      </div>
      <footer className="work-end"><span className="mono">END OF FILE / 02</span><span className="display-en">{profile.name.toUpperCase()}.</span><Link to={{ pathname: '/work', hash: '' }} onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>返回页首 ↑</Link></footer>
    </article>
  );
}
