import { useRef, type PointerEvent } from 'react';
import { Panel, SectionTitle, Stamp, Sticker, Tape } from '../../components/ui';
import { getBirthLabel, getLocationLabel, pageLabels, profile } from '../../data/profile';
import './about.css';

const educationTones = ['paper', 'acid', 'ink'] as const;

export default function About() {
  const identity = useRef<HTMLDivElement>(null);
  function tiltIdentity(event: PointerEvent<HTMLElement>) {
    if (!identity.current || !window.matchMedia('(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const angle = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
    identity.current.style.setProperty('--about-tilt', `${angle}deg`);
  }
  function resetTilt() { identity.current?.style.setProperty('--about-tilt', '0deg'); }

  return (
    <article className="about-page page-shell">
      <header className="about-hero" onPointerMove={tiltIdentity} onPointerLeave={resetTilt}>
        <div className="about-hero-top"><p className="mono">01 / ABOUT THE PERSON</p><Stamp tone="blue">个人档案</Stamp></div>
        <p className="about-question display-zh">{pageLabels['/about']}</p>
        <h1 className="display-en">{profile.name.toUpperCase()}</h1>
        <div className="about-hero-bottom">
          <p className="mono">IDENTITY / EDUCATION / RESEARCH</p>
          <div ref={identity} className="about-identity-stickers" aria-label="身份标签">
            {[profile.gender, profile.country, getLocationLabel(), profile.birthYear].map((label, index) => <Sticker key={label} tone={index === 2 ? 'acid' : 'paper'} rotate={index % 2 ? 2 : -2}>{label}</Sticker>)}
          </div>
        </div>
        <span className="about-hero-arrow decor" aria-hidden="true">↙</span>
      </header>

      <section className="about-dossier page-section" aria-labelledby="about-dossier-title">
        <div className="about-dossier-intro">
          <p className="eyebrow mono">THE BASICS</p>
          <h2 id="about-dossier-title" className="display-zh">从这里认识我。</h2>
          <span className="about-scribble decor" aria-hidden="true"><svg viewBox="0 0 220 80" fill="none"><path d="M6 42C52 5 116 13 153 30c30 14 16 31-23 33-37 2-67-9-52-23 19-18 90-16 131-1m-19-17 22 17-25 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
        </div>
        <Panel className="about-id-card interactive">
          <Tape />
          <div className="about-id-heading"><span className="mono">PERSONAL FILE</span><span className="mono">A / 01</span></div>
          <div className="about-id-content">
            <div className="about-monogram" role="img" aria-label={`${profile.name} 姓名首字母徽章`}><span className="display-en">{profile.name.charAt(0)}</span><svg className="decor" aria-hidden="true" viewBox="0 0 180 190"><path d="m17 29 28-10M134 156l25-18M7 156l20 12M143 13l19 21" fill="none" stroke="currentColor" strokeWidth="4"/></svg></div>
            <dl className="about-facts">
              <div><dt>姓名 / NAME</dt><dd>{profile.name}</dd></div>
              <div><dt>出生 / BORN</dt><dd>{getBirthLabel()}</dd></div>
              <div><dt>现居 / BASED IN</dt><dd>{getLocationLabel()}</dd></div>
              <div><dt>国籍 / COUNTRY</dt><dd>{profile.country}</dd></div>
            </dl>
          </div>
          <div className="about-id-foot"><span className="mono">{profile.name.toUpperCase()}</span><span className="about-barcode decor" aria-hidden="true"/></div>
        </Panel>
      </section>

      <section className="about-languages page-section" aria-labelledby="about-language-title">
        <div><p className="eyebrow mono">LANGUAGES</p><h2 id="about-language-title" className="display-zh">语言。</h2></div>
        <div className="about-language-stamps">{profile.languages.map((language, index) => <div key={language.name} className="about-language-item"><span className="mono">0{index + 1}</span><Stamp tone={index === 1 ? 'blue' : 'ink'}>{language.label}</Stamp><span className="about-language-name">{language.name}</span></div>)}</div>
      </section>

      <section className="about-education page-section" aria-label="学历">
        <SectionTitle number="02" eyebrow="EDUCATION">学习的轨迹。</SectionTitle>
        <ol className="about-timeline">
          {profile.education.map((education, index) => <li key={education.start} className="about-timeline-item">
            <div className="about-timeline-marker"><span className="display-en">0{index + 1}</span></div>
            <Panel tone={educationTones[index]} className="about-education-card interactive">
              <div className="about-education-meta"><p className="mono">{education.period}</p><Stamp tone={index === 2 ? 'acid' : 'ink'}>{education.degree}</Stamp></div>
              <h3 className="display-zh">{education.school}</h3>
              <p className="about-education-field">{education.field}</p>
            </Panel>
          </li>)}
        </ol>
      </section>

      <section className="about-research page-section" aria-label="课题方向">
        <SectionTitle number="03" eyebrow="RESEARCH INTERESTS">正在追问的方向。</SectionTitle>
        <div className="about-research-title"><span className="about-quote decor display-en" aria-hidden="true">“</span><p className="display-zh">{profile.research.intro}</p><span className="mono">RESEARCH NOTES</span></div>
        <div className="about-research-body">{profile.research.topics.map(topic => <p key={topic}>{topic}</p>)}</div>
        <ul className="about-keywords" aria-label="研究关键词">{profile.research.keywords.map(keyword => <li key={keyword}><mark>{keyword}</mark></li>)}</ul>
      </section>
      <footer className="about-page-end"><span className="mono">END OF FILE / 01</span><span className="display-en">{profile.name.toUpperCase()}.</span></footer>
    </article>
  );
}
