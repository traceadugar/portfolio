import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function CaseStudy({ data, labels }) {
  if (!data) return null;
  const dateBadge = data.startDate && <time className="project-year" dateTime={data.sortDate}>{data.startDate}</time>;

  return <article className="section-shell case-study-page" aria-labelledby="case-study-heading">
    <header className="section-heading">
      <Link className="case-study-back-link" to="/#portfolio"><Icon name="shore-chevron-left" />{labels.backToProjects}</Link>
      <p className="section-kicker">{labels.caseStudy}</p>
      <div className="section-title-row">
        <span className="section-emblem" aria-hidden="true"><Icon name="shore-compass" /></span>
        <h2 className="section-title" id="case-study-heading">{data.title}</h2>
      </div>
      <p className="section-intro case-study-subtitle">{data.subtitle}</p>
    </header>
    <div className="case-study-overview shore-panel">
      {data.logo ? <div className="case-study-brand case-study-media">
        <img src={data.logo} width="800" height="350" alt={data.logoAlt} decoding="async" />
        {dateBadge}
      </div> : <div className={data.image ? 'case-study-emblem' : 'case-study-emblem case-study-media'}><Icon name={data.icon || 'shore-code'} />{!data.image && dateBadge}</div>}
      <div className="case-study-overview-copy">
        <p className="case-study-organization">{data.organization}</p>
        <p className="case-study-status">{data.status}</p>
        <ul className="technology-chips" aria-label={labels.technologies}>
          {data.technologies.map(tech => <li className="technology-chip" key={tech.name}>
            <Icon name={tech.icon} /> <span>{tech.name}</span>
          </li>)}
        </ul>
      </div>
      {data.image && <figure className="case-study-figure">
        <div className="case-study-card-photo case-study-media">
          <img src={data.image} width={data.imageWidth} height={data.imageHeight} alt={data.imageAlt} loading="lazy" decoding="async" />
          {!data.logo && dateBadge}
        </div>
        {data.imageCaption && <figcaption>{data.imageCaption}</figcaption>}
      </figure>}
    </div>
    <div className="case-study-layout">
      <nav className="case-study-contents" aria-label={labels.caseStudyContents}>
        <p className="case-study-contents-label">{labels.caseStudyContents}</p>
        <ul>
          {data.sections.map(section => <li key={section.id}><a href={`#case-${section.id}`}>{section.title}</a></li>)}
        </ul>
      </nav>
      <div className="case-study-body shore-panel">
        {data.sections.map(section => <section className="case-study-section" aria-labelledby={`case-${section.id}`} key={section.id}>
          <h3 id={`case-${section.id}`}>{section.title}</h3>
          {section.date && <p className="case-study-evidence-date"><time dateTime={section.dateTime}>{section.date}</time></p>}
          {section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {section.video && <figure className="case-study-evidence-video">
            <video controls playsInline preload="none" width="1280" height="720"
              poster={section.video.poster} aria-label={section.video.title}
              aria-describedby={`case-${section.id}-video-caption`}>
              <source src={section.video.src} type="video/mp4" />
              {labels.videoFallback}
            </video>
            <figcaption id={`case-${section.id}-video-caption`}>{section.video.caption}</figcaption>
            <a className="case-study-video-link" href={section.video.src} target="_blank" rel="noopener noreferrer">
              <Icon name="shore-arrow" /> {labels.openVideo}
              <span className="visually-hidden"> ({labels.opensNewTab})</span>
            </a>
          </figure>}
          {section.transcript && <figure className="case-study-transcript">
            <figcaption>{section.transcript.title}</figcaption>
            <pre tabIndex="0" aria-label={section.transcript.title}><code>{section.transcript.content}</code></pre>
          </figure>}
          {section.items && <ul className="case-study-decisions">
            {section.items.map((item, index) => <li key={typeof item === 'string' ? item : item.title || index}>
              {typeof item === 'string' ? item : <>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </>}
            </li>)}
          </ul>}
        </section>)}
        {data.sources?.length > 0 && <section className="case-study-section case-study-sources" aria-labelledby="case-study-sources-heading">
          <h3 id="case-study-sources-heading">{labels.caseStudySources}</h3>
          <ul>
            {data.sources.map(source => <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                <Icon name="shore-book" /> {source.title} <Icon name="shore-arrow" />
                <span className="visually-hidden"> ({labels.opensNewTab})</span>
              </a>
            </li>)}
          </ul>
        </section>}
      </div>
    </div>
    <div className="case-study-footer-actions">
      <Link className="shore-button shore-button-secondary" to="/#portfolio"><Icon name="shore-chevron-left" />{labels.backToProjects}</Link>
    </div>
  </article>;
}
