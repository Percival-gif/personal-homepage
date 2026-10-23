import { BigNumber, Panel, SectionTitle, Stamp, Sticker, Tape } from '../../components/ui';
import { pageLabels, profile } from '../../data/profile';
import './work.css';

export default function Work() {
  const { academic, industry } = profile;
  return (
    <article className="work-page page-shell">
      <header className="work-hero">
        <div className="work-hero-meta"><p className="mono">02 / WORK & RESEARCH</p><Stamp tone="blue">研究与实践</Stamp></div>
        <h1 className="display-zh">{pageLabels['/work']}</h1>
        <div className="work-hero-bottom"><span className="display-en">WORK.</span><p className="mono">ACADEMIA<br/>× INDUSTRY</p><svg className="work-hero-mark decor" aria-hidden="true" viewBox="0 0 160 80"><path d="M7 28c40-24 107-11 114 10 7 20-30 32-54 16-22-15 16-31 77-27m-18-15 21 15-23 18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
      </header>

      <div className="work-split page-section">
        <section className="work-academic" aria-labelledby="work-academic-title">
          <header className="work-column-heading"><span className="mono">SIDE A / ACADEMIA</span><h2 id="work-academic-title" className="display-zh">学术。</h2></header>
          <div className="work-metrics" aria-label="学术成果统计">{academic.metrics.map((metric, index) => <div key={metric.label} className={index === 2 ? 'work-metric work-metric-total' : 'work-metric'}><BigNumber value={metric.value} label={metric.label}/></div>)}</div>
          <p className="work-source-note">统计口径来自本人资料；含非一作累计统计。</p>
          <p className="sr-only">{academic.summary}</p>

          <section className="work-case" aria-labelledby="work-case-title">
            <div className="work-case-heading"><div><p className="mono">RESEARCH / CASE FILE</p><h3 id="work-case-title" className="display-en">{academic.project.name}</h3></div><Sticker tone="blue" rotate={2}>CASE STUDY</Sticker></div>
            <p className="work-case-organization">{academic.project.organization}</p>
            <ol className="work-case-panels">{academic.project.steps.map((step, index) => <li key={step.title}>
              <div className="work-frame-top"><span className="mono">FRAME / 0{index + 1}</span><span className="work-frame-arrow decor" aria-hidden="true">↗</span></div>
              <h4 className="display-zh">{step.title}</h4><p>{step.body}</p>
            </li>)}</ol>
          </section>
        </section>

        <section className="work-industry" aria-labelledby="work-industry-title">
          <header className="work-column-heading"><span className="mono">SIDE B / INDUSTRY</span><h2 id="work-industry-title" className="display-zh">产业。</h2></header>
          <Panel className="work-employment">
            <Tape/>
            <div className="work-employment-meta"><span className="mono">EXPERIENCE</span><Stamp tone="blue">{industry.period}</Stamp></div>
            <h3 className="work-company display-zh">{industry.company}</h3>
            <p className="work-department">{industry.department}</p>
            <div className="work-responsibilities">{industry.responsibilities.map((responsibility, index) => <div key={responsibility}><span className="work-responsibility-marker display-en" aria-hidden="true">0{index + 1}</span><p>{responsibility}</p></div>)}</div>
          </Panel>

          <section className="work-awards" aria-label="奖励记录">
            <SectionTitle eyebrow="RECOGNITION">留下的记录。</SectionTitle>
            <div className="work-awards-list">{industry.awards.map((award, index) => <Panel className="work-award" key={award.date}>
              <div className="work-award-medal decor" aria-hidden="true"><svg viewBox="0 0 100 120" fill="none"><path d="m25 76-5 39 30-17 30 17-5-39" stroke="currentColor" strokeWidth="3"/><path d="m50 5 9 7 12-1 6 11 11 6-1 12 7 9-7 10 1 12-11 6-6 11-12-1-9 7-9-7-12 1-6-11-11-6 1-12-7-10 7-9-1-12 11-6 6-11 12 1Z" fill="var(--paper)" stroke="currentColor" strokeWidth="3"/><circle cx="50" cy="49" r="27" stroke="currentColor" strokeWidth="2"/><path d="m36 49 9 10 20-23" stroke="currentColor" strokeWidth="4"/></svg></div>
              <div className="work-award-copy"><p className="mono">{award.date}</p><h3 className="display-zh">{award.title}</h3>{award.detail && <p className="work-award-detail">{award.detail}</p>}<span className="work-award-index mono">RECORD / 0{index + 1}</span></div>
            </Panel>)}</div>
          </section>
        </section>
        <span className="work-seam-arrow decor" aria-hidden="true">↔</span>
      </div>
      <footer className="work-end"><span className="mono">END OF FILE / 02</span><span className="display-en">{profile.name.toUpperCase()}.</span></footer>
    </article>
  );
}
