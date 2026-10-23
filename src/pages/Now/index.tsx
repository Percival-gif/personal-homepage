import { Fragment } from 'react';
import { Panel, SectionTitle, Stamp, Sticker, Tape } from '../../components/ui';
import { getLocationLabel, pageLabels, profile } from '../../data/profile';
import './now.css';

const actionWords = new Set(['负责', '预训练', '分析', '构建', '优化', '部署']);

function Responsibility({ text }: { text: string }) {
  return <>{text.split(/(负责|预训练|分析|构建|优化|部署)/g).map((part, index) => actionWords.has(part)
    ? <strong key={index}>{part}</strong>
    : <Fragment key={index}>{part}</Fragment>)}</>;
}

function CheckMark() {
  return <span className="now-check decor" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="m9 20 8 9L32 10M3 4h34v32H3z" stroke="currentColor" strokeWidth="3"/></svg></span>;
}

export default function Now() {
  const city = getLocationLabel();

  return <article className="now-page page-shell">
    <header className="now-hero">
      <div className="now-status mono"><span className="now-status-dot decor" aria-hidden="true"/><span>NOW · {city} · {profile.currentYear}</span><span className="now-status-index">FILE / 03</span></div>
      <div className="now-hero-heading">
        <div><p className="now-question display-zh">{pageLabels['/now']}</p><h1 className="display-en">NOW<span>.</span></h1></div>
        <div className="now-hero-note"><Sticker tone="acid" rotate={2}>{city}</Sticker><p className="mono">WORK IN PROGRESS<br/>ROLES / PRACTICE / DIRECTION</p></div>
      </div>
      <div className="now-ticker decor" aria-hidden="true"><div className="now-ticker-track"><span>{profile.currentWork[1].department} / {profile.currentWork[1].role} / {city}</span><span>✳</span><span>{profile.currentWork[1].department} / {profile.currentWork[1].role} / {city}</span><span>✳</span><span>{profile.currentWork[1].department} / {profile.currentWork[1].role} / {city}</span></div></div>
    </header>

    <section className="now-employment page-section" aria-labelledby="now-employment-title">
      <div id="now-employment-title"><SectionTitle number="01" eyebrow="WORK / EMPLOYMENT">任职与职责。</SectionTitle></div>
      <div className="now-badge-grid">
        {profile.currentWork.map((job, index) => <Panel key={job.start} tone={index === 1 ? 'acid' : 'paper'} className={`now-badge now-badge-${index + 1}`}>
          <span className="now-badge-slot decor" aria-hidden="true"/>
          <div className="now-badge-top"><span className="mono">ROLE / 0{index + 1}</span><Stamp tone="ink">{job.end === '至今' ? '现任' : '任职记录'}</Stamp></div>
          <p className="now-employer">{job.company}</p>
          <p className="now-department">{job.department}</p>
          <h3 className="display-zh">{job.role}</h3>
          <p className="now-job-period mono">{job.period}</p>
          <div className="now-job-duty"><p className="eyebrow mono">RESPONSIBILITIES</p>{job.responsibilities.map(text => <p key={text}><Responsibility text={text}/></p>)}</div>
          <div className="now-badge-foot"><span className="mono">{profile.name.toUpperCase()}</span><span className="now-badge-barcode decor" aria-hidden="true"/></div>
        </Panel>)}
      </div>
    </section>

    <section className="now-capabilities page-section" aria-labelledby="now-capabilities-title">
      <div id="now-capabilities-title"><SectionTitle number="02" eyebrow="PRACTICE / CAPABILITIES">能力，逐条展开。</SectionTitle></div>
      <div className="now-evidence-grid">
        {profile.skills.map((skill, index) => <Panel key={skill.title} className="now-evidence-card">
          {index === 1 && <Tape/>}
          <div className="now-evidence-meta"><span className="display-en">0{index + 1}</span><span className="mono">CAPABILITY NOTE</span><CheckMark/></div>
          <h3 className="display-zh">{skill.title}</h3>
          <p className="now-skill-body">{skill.body}</p>
        </Panel>)}
      </div>
    </section>

    <footer className="now-location page-section">
      <div><p className="mono">BASED IN / {profile.currentYear}</p><h2 className="display-zh">在{city}。</h2></div>
      <svg className="now-location-art decor" viewBox="0 0 240 180" fill="none" aria-hidden="true"><path d="M120 13c-42 0-72 29-72 67 0 46 72 91 72 91s72-45 72-91c0-38-30-67-72-67Z" stroke="currentColor" strokeWidth="4"/><circle cx="120" cy="77" r="24" stroke="currentColor" strokeWidth="4"/><path d="m16 27 18 8M214 28l-18 9M10 103h24m176 0h22M58 160l-13 10m138-9 13 10" stroke="currentColor" strokeWidth="4"/></svg>
      <span className="now-location-end mono">{profile.name.toUpperCase()} / END OF FILE 03</span>
    </footer>
  </article>;
}
