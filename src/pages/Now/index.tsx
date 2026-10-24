import { Fragment, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Panel, SectionTitle, Stamp, Sticker, Tape } from '../../components/ui';
import { Graffiti } from '../../components/Graffiti';
import { getLocationLabel, pageLabels, profile } from '../../data/profile';
import './now.css';

const actionWords = new Set(['负责', '预训练', '分析', '构建', '优化', '部署']);
const sectionLinks = [
  { id: 'overview', label: '当前方向', number: '01' },
  { id: 'employment', label: '任职与职责', number: '02' },
  { id: 'focus', label: '工程现场', number: '03' },
  { id: 'capabilities', label: '能力笔记', number: '04' },
  { id: 'approach', label: '工作方式', number: '05' },
  { id: 'location', label: '现居', number: '06' },
];

function Responsibility({ text }: { text: string }) {
  return <>{text.split(/(负责|预训练|分析|构建|优化|部署)/g).map((part, index) => actionWords.has(part)
    ? <strong key={index}>{part}</strong>
    : <Fragment key={index}>{part}</Fragment>)}</>;
}

function CheckMark() {
  return <span className="now-check decor" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="m9 20 8 9L32 10M3 4h34v32H3z" stroke="currentColor" strokeWidth="3"/></svg></span>;
}

function taskTerms(responsibilities: string[]) {
  return responsibilities.flatMap(text => text.replace(/^负责\s*/, '').replace(/。$/, '').split(/、|与/)).map(text => text.trim()).filter(Boolean);
}

export default function Now() {
  const city = getLocationLabel();
  const [searchParams] = useSearchParams();
  const activeSection = searchParams.get('section');
  const currentJob = profile.currentWork.find(job => job.end === '至今') ?? profile.currentWork[profile.currentWork.length - 1];

  useEffect(() => {
    if (!sectionLinks.some(link => link.id === activeSection)) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(`now-${activeSection}`);
      target?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeSection]);

  return <article className="now-page page-shell">
    <header className="now-hero">
      <div className="now-status mono"><span className="now-status-dot decor" aria-hidden="true"/><span>NOW · {city} · {profile.currentYear}</span><span className="now-status-index">FILE / 03</span></div>
      <div className="now-hero-heading">
        <div className="now-hero-main"><p className="now-question display-zh">{pageLabels['/now']}</p><h1 className="display-en">NOW<span>.</span></h1><div className="now-hero-art-row"><p className="now-hero-subline mono">WORK / PRACTICE / DIRECTION</p><Graffiti variant="terminal" className="now-terminal-graffiti" eager/></div></div>
        <div className="now-hero-note"><span className="now-note-shadow decor" aria-hidden="true"/><Sticker tone="acid" rotate={-3}>{currentJob.period}</Sticker><div className="now-hero-note-paper"><Tape/><p className="mono">CURRENT ROLE</p><p className="display-zh">{currentJob.role}</p><p>{currentJob.company}</p><p>{currentJob.department}</p></div><span className="now-hero-side-note mono decor" aria-hidden="true">→ {city} / {profile.currentYear}</span></div>
      </div>
      <div className="now-ticker decor" aria-hidden="true"><div className="now-ticker-track">{Array.from({ length: 3 }, (_, index) => <Fragment key={index}><span>{currentJob.department} / {currentJob.role} / {city}</span><span>✳</span></Fragment>)}</div></div>
    </header>

    <nav className="now-section-nav" aria-label="本页内容"><p className="mono">ON THIS PAGE</p><div>{sectionLinks.map(link => <Link key={link.id} to={`/now?section=${link.id}`} aria-current={activeSection === link.id ? 'location' : undefined}><span className="mono">{link.number}</span>{link.id === 'location' ? `在${city}` : link.label}<span aria-hidden="true">↗</span></Link>)}</div></nav>

    <section id="now-overview" className="now-overview page-section" aria-labelledby="now-overview-title" tabIndex={-1}>
      <p className="eyebrow mono">01 / CURRENT DIRECTION</p>
      <h2 id="now-overview-title" className="display-zh">{profile.currentFocus.title}</h2>
      <div className="now-overview-copy">{profile.currentFocus.introduction.map(text => <p key={text}>{text}</p>)}</div>
      <span className="now-overview-index decor display-en" aria-hidden="true">01↗</span>
    </section>

    <section id="now-employment" className="now-employment page-section" aria-labelledby="now-employment-title" tabIndex={-1}>
      <div id="now-employment-title"><SectionTitle number="02" eyebrow="WORK / EMPLOYMENT">任职与职责。</SectionTitle></div>
      <div className="now-badge-grid">
        {profile.currentWork.map((job, index) => <div key={job.start} className={`now-badge-stack now-badge-stack-${index + 1}`}>
          <span className="now-badge-layer decor" aria-hidden="true"/>
          <span className="now-badge-side-note mono decor" aria-hidden="true">ROLE / 0{index + 1} — {job.start}</span>
          <Panel tone={index === 1 ? 'acid' : 'paper'} className={`now-badge now-badge-${index + 1}`}>
            <Tape className="now-badge-tape"/>
            <span className="now-badge-slot decor" aria-hidden="true"/>
            <div className="now-badge-top"><span className="mono">EMPLOYMENT / 0{index + 1}</span><Stamp tone="ink">{job.end === '至今' ? '现任' : '任职记录'}</Stamp></div>
            <p className="now-field-label mono">COMPANY / 公司</p><p className="now-employer">{job.company}</p>
            <p className="now-field-label mono">DEPARTMENT / 部门</p><p className="now-department">{job.department}</p>
            <h3 className="display-zh">{job.role}</h3>
            <p className="now-job-period mono">{job.period}</p>
            <dl className="now-job-dates"><div><dt>起始 / FROM</dt><dd>{job.start}</dd></div><div><dt>截至 / TO</dt><dd>{job.end}</dd></div></dl>
            <div className="now-job-duty"><p className="eyebrow mono">RESPONSIBILITIES / 职责</p>{job.responsibilities.map(text => <p key={text}><Responsibility text={text}/></p>)}</div>
            <ul className="now-task-tags" aria-label={`${job.role}的技术任务`}>{taskTerms(job.responsibilities).map(term => <li key={term}>{term}</li>)}</ul>
            <div className="now-job-details">{job.details.map(text => <p key={text}>{text}</p>)}</div>
            <div className="now-badge-foot"><span className="mono">{profile.name.toUpperCase()}</span><span className="now-badge-barcode decor" aria-hidden="true"/></div>
          </Panel>
        </div>)}
      </div>
    </section>

    <section id="now-focus" className="now-focus page-section" aria-labelledby="now-focus-title" tabIndex={-1}>
      <div id="now-focus-title"><SectionTitle number="03" eyebrow="MODEL / PRODUCT / FIELD">工程现场。</SectionTitle></div>
      <div className="now-focus-grid">{profile.currentFocus.areas.map((area, index) => <Panel className={`now-focus-card now-focus-card-${index + 1}`} key={area.title}>
        <div className="now-focus-meta"><span className="display-en">0{index + 1}</span><span className="mono">PRACTICE / FIELD NOTES</span><span className="decor" aria-hidden="true">↗</span></div>
        <h3 className="display-zh">{area.title}</h3><p>{area.body}</p>
      </Panel>)}</div>
    </section>

    <section id="now-capabilities" className="now-capabilities page-section" aria-labelledby="now-capabilities-title" tabIndex={-1}>
      <div id="now-capabilities-title"><SectionTitle number="04" eyebrow="PRACTICE / CAPABILITIES">能力，逐条展开。</SectionTitle></div>
      <div className="now-evidence-grid">
        {profile.skills.map((skill, index) => <Panel key={skill.title} tone={index === 2 ? 'ink' : 'paper'} className={`now-evidence-card now-evidence-card-${index + 1}`}>
          {(index === 1 || index === 3) && <Tape/>}
          <span className="now-evidence-side-note mono decor" aria-hidden="true">NOTE / 0{index + 1}</span>
          <div className="now-evidence-meta"><span className="display-en">0{index + 1}</span><span className="mono">CAPABILITY NOTE</span><CheckMark/></div>
          <h3 className="display-zh">{skill.title}</h3>
          <p className="now-skill-body">{(skill.body.match(/[^；]+；?/g) ?? [skill.body]).map((part, partIndex) => <span key={partIndex} className="now-skill-point"><span className="now-point-mark decor" aria-hidden="true"><svg viewBox="0 0 18 20" fill="none"><path d="M3 2v10h11m-5-4 5 4-5 4" stroke="currentColor" strokeWidth="2"/></svg></span><span>{part}</span></span>)}</p>
        </Panel>)}
      </div>
    </section>

    <section id="now-approach" className="now-approach page-section" aria-labelledby="now-approach-title" tabIndex={-1}>
      <div id="now-approach-title"><SectionTitle number="05" eyebrow="HOW I WORK">我的工程工作方式。</SectionTitle></div>
      <ol className="now-approach-list">{profile.currentFocus.approach.map((item, index) => <li key={item.title}>
        <span className="now-approach-number display-en" aria-hidden="true">0{index + 1}</span><div><h3 className="display-zh">{item.title}</h3><p>{item.body}</p></div><span className="now-approach-arrow decor" aria-hidden="true">↗</span>
      </li>)}</ol>
    </section>

    <footer id="now-location" className="now-location page-section" tabIndex={-1}>
      <span className="now-location-tape decor" aria-hidden="true"/>
      <div><p className="mono">BASED IN / {profile.currentYear}</p><h2 className="display-zh">{profile.currentFocus.closing}</h2><p className="now-location-country">{profile.location.country} · {profile.location.province} · {profile.location.city}</p></div>
      <Graffiti variant="orbit" className="now-location-graffiti"/>
      <span className="now-location-end mono">{profile.name.toUpperCase()} / END OF FILE 03</span>
    </footer>
  </article>;
}
