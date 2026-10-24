import { useRef, type PointerEvent } from 'react';
import { Panel, SectionTitle, Stamp, Sticker, Tape } from '../../components/ui';
import { Graffiti } from '../../components/Graffiti';
import { getBirthLabel, getLocationLabel, pageLabels, profile } from '../../data/profile';
import './about.css';

const educationTones = ['acid', 'paper', 'ink'] as const;
const languageTones = ['acid', 'blue', 'magenta'] as const;
const location = profile.privacy.showDistrict
  ? [profile.location.country, profile.location.province, getLocationLabel()].join(' · ')
  : getLocationLabel();

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
        <div className="about-title-mount">
          <svg className="about-person-orbit decor" aria-hidden="true" viewBox="0 0 900 280" fill="none"><ellipse cx="460" cy="145" rx="410" ry="88" transform="rotate(-12 460 145)"/><path d="M80 200 820 42M119 52v25m-12-13h24M758 201v32m-16-16h32"/><circle cx="743" cy="62" r="13"/></svg>
          <span className="about-title-underlay decor" aria-hidden="true" />
          <p className="about-question display-zh">{pageLabels['/about']}</p>
          <h1 className="display-en">{profile.name.toUpperCase()}</h1>
          <span className="about-edition decor mono" aria-hidden="true">PERSONAL<br/>ARCHIVE</span>
        </div>
        <div className="about-gallery-caption"><span className="mono">ROOM A / THE PERSON</span><span className="display-zh">经历构成坐标，思考连接它们。</span></div>
        <div className="about-hero-bottom">
          <p className="mono">IDENTITY / EDUCATION / RESEARCH</p>
          <div ref={identity} className="about-identity-stickers" aria-label="身份标签">
            {[profile.gender, profile.country, getLocationLabel(), profile.birthYear].map((label, index) => <Sticker key={label} tone={index === 2 ? 'blue' : index === 3 ? 'magenta' : 'paper'} rotate={index % 2 ? 2 : -2}>{label}</Sticker>)}
          </div>
        </div>
      </header>

      <section className="about-dossier page-section" aria-labelledby="about-dossier-title">
        <div className="about-dossier-intro">
          <p className="eyebrow mono">01—A / IDENTITY</p>
          <h2 id="about-dossier-title" className="display-zh">从这里<br/>认识我。</h2>
          <span className="about-intro-number decor display-en" aria-hidden="true">01</span><svg className="about-file-geometry decor" aria-hidden="true" viewBox="0 0 220 150" fill="none"><circle cx="110" cy="75" r="59"/><path d="M15 75h190M110 5v140M68 33l84 84m0-84-84 84"/><circle cx="110" cy="75" r="26"/></svg>
        </div>
        <div className="about-id-stack">
          <span className="about-stack-paper decor" aria-hidden="true" />
          <Panel className="about-id-card interactive">
            <Tape />
            <div className="about-id-heading"><span className="mono">PERSONAL FILE</span><span className="mono">A / 01</span></div>
            <div className="about-id-content">
              <div className="about-monogram" role="img" aria-label={`${profile.name} 姓名首字母徽章`}><span className="display-en">{profile.name.charAt(0)}</span><svg className="decor" aria-hidden="true" viewBox="0 0 180 190"><path d="m17 29 28-10M134 156l25-18M7 156l20 12M143 13l19 21" fill="none" stroke="currentColor" strokeWidth="4"/></svg></div>
              <dl className="about-facts">
                <div><dt>姓名 / NAME</dt><dd>{profile.name}</dd></div>
                <div><dt>性别 / GENDER</dt><dd>{profile.gender}</dd></div>
                <div><dt>出生 / BORN</dt><dd>{getBirthLabel()}</dd></div>
                <div><dt>国籍 / COUNTRY</dt><dd>{profile.country}</dd></div>
              </dl>
            </div>
            <dl className="about-location"><dt className="mono">现居 / BASED IN</dt><dd>{location}</dd></dl>
            <div className="about-id-foot"><span className="mono">{profile.name.toUpperCase()}</span><span className="about-barcode decor" aria-hidden="true"/></div>
          </Panel>
        </div>
      </section>

      <section className="about-introduction page-section" aria-labelledby="about-introduction-title">
        <div className="about-introduction-heading"><p className="eyebrow mono">PERSONAL NOTES / ABOUT ME</p><h2 id="about-introduction-title" className="display-zh">{profile.introduction.title}</h2><Graffiti variant="neural" className="about-neural-art"/></div>
        <Panel className="about-introduction-copy"><Tape/>{profile.introduction.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</Panel>
      </section>

      <section className="about-languages page-section" aria-labelledby="about-language-title">
        <div className="about-section-heading"><div><p className="eyebrow mono">01—B / LANGUAGES</p><h2 id="about-language-title" className="display-zh">语言。</h2></div><span className="mono about-side-note">中文 / ENGLISH</span></div>
        <div className="about-language-stamps">{profile.languages.map((language, index) => <div key={language.name} className={`about-language-card tone-${languageTones[index]}`}>
          <div className="about-language-top"><span className="mono">0{index + 1} / LANGUAGE</span><span className="decor" aria-hidden="true">↗</span></div>
          <h3 className={index === 0 ? 'display-zh' : 'display-en'}>{language.label}</h3>
          <div className="about-language-detail"><span>{language.name}</span>{index === 2 && <Stamp>{language.label.replace('Higher', '高级')}</Stamp>}</div>
        </div>)}</div>
      </section>

      <section className="about-education page-section" aria-label="学历">
        <SectionTitle number="02" eyebrow={`EDUCATION / ${profile.education[0].start.slice(0, 4)} → NOW`}>学习的轨迹。</SectionTitle>
        <ol className="about-timeline">
          {profile.education.map((education, index) => <li key={education.start} className="about-timeline-item">
            <div className="about-timeline-marker"><span className="display-en">0{index + 1}</span></div>
            <Panel tone={educationTones[index]} className="about-education-card interactive">
              <span className="about-education-tab mono">EDUCATION / 0{index + 1}</span>
              <div className="about-education-meta"><p className="mono">{education.period}</p><Stamp tone={index === 2 ? 'acid' : 'ink'}>{education.degree}</Stamp></div>
              <h3 className="display-zh">{education.school}</h3>
              <p className="about-education-field">{education.field}</p>
              <div className="about-education-bottom"><span className="mono">{education.start} → {education.end}</span><span className="decor display-en" aria-hidden="true">↗</span></div>
            </Panel>
          </li>)}
        </ol>
      </section>

      <section className="about-research page-section" aria-label="课题方向">
        <SectionTitle number="03" eyebrow="RESEARCH INTERESTS">正在追问的方向。</SectionTitle>
        <div className="about-research-title-wrap"><div className="about-research-title"><span className="about-quote decor display-en" aria-hidden="true">“</span><p className="display-zh">{profile.research.intro}</p><span className="mono">RESEARCH NOTES / 03</span></div><Graffiti variant="arrow" className="about-research-arrow"/></div>
        <Panel className="about-research-overview">{profile.research.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</Panel>
        <div className="about-research-areas">
          {profile.research.areas.map((area, index) => <Panel key={area.title} className={`about-research-area about-research-area-${index + 1}`}>
            <div className="about-research-area-meta"><span className="mono">RESEARCH / 0{index + 1}</span><span className="display-en decor" aria-hidden="true">↗</span></div>
            <h3 className="display-zh">{area.title}</h3><p>{area.body}</p>
          </Panel>)}
        </div>
        <div className="about-research-original"><p className="eyebrow mono">完整课题方向 / RESEARCH STATEMENT</p><div>{profile.research.topics.map(topic => <p key={topic}>{topic}</p>)}</div></div>
        <ul className="about-keywords" aria-label="研究关键词">{profile.research.keywords.map(keyword => <li key={keyword}><mark>{keyword}</mark></li>)}</ul>
      </section>
      <footer className="about-page-end"><span className="mono">END OF FILE / 01</span><span className="display-en">{profile.name.toUpperCase()}.</span></footer>
    </article>
  );
}
