import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function CaseStudy({ data, labels }) {
  if (!data) return null;

  return <article className="section-shell case-study-page" aria-labelledby="case-study-heading">
    <header className="section-heading">
      <Link className="case-study-back-link" to="/#portfolio"><Icon name="shore-chevron-left" />{labels.backToProjects}</Link>
      <p className="section-kicker"><Icon name="shore-compass" /> {labels.caseStudy}</p>
      <h2 className="section-title" id="case-study-heading">{data.title}</h2>
      <p className="section-intro case-study-subtitle">{data.subtitle}</p>
    </header>
    <div className="case-study-overview shore-panel">
      <div className="case-study-brand">
        <img src={data.logo} width="800" height="350" alt={data.logoAlt} decoding="async" />
      </div>
      <div className="case-study-overview-copy">
        <p className="case-study-organization">{data.organization}</p>
        <p className="case-study-status">{data.status}</p>
        <ul className="technology-chips" aria-label={labels.technologies}>
          {data.technologies.map(tech => <li className="technology-chip" key={tech.name}>
            <Icon name={tech.icon} /> <span>{tech.name}</span>
          </li>)}
        </ul>
      </div>
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
          {section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {section.items && <ul className="case-study-decisions">
            {section.items.map((item, index) => <li key={typeof item === 'string' ? item : item.title || index}>
              {typeof item === 'string' ? item : <>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </>}
            </li>)}
          </ul>}
        </section>)}
      </div>
    </div>
    <div className="case-study-footer-actions">
      <Link className="shore-button shore-button-secondary" to="/#portfolio"><Icon name="shore-chevron-left" />{labels.backToProjects}</Link>
    </div>
  </article>;
}
