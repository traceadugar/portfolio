import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function CaseStudyCard({ data, labels }) {
  const dateBadge = data.startDate && <time className="project-year" dateTime={data.sortDate}>{data.startDate}</time>;

  return <article className="case-study-card shore-panel" aria-labelledby={`case-study-${data.id}-title`}>
    {data.logo ? <div className="case-study-brand case-study-media">
      <img src={data.logo} width="800" height="350" alt={data.logoAlt} loading="lazy" decoding="async" />
      {dateBadge}
    </div> : data.image ? <div className="case-study-card-photo case-study-media">
      <img src={data.image} width={data.imageWidth || 1200} height={data.imageHeight || 904} alt={data.imageAlt} loading="lazy" decoding="async" />
      {dateBadge}
    </div> : <div className="case-study-emblem case-study-media"><Icon name={data.icon || 'shore-code'} />{dateBadge}</div>}
    <div className="case-study-card-copy">
      <p className="section-kicker"><Icon name="shore-compass" /> {labels.featuredCaseStudy}</p>
      <h3 id={`case-study-${data.id}-title`}>{data.title}</h3>
      <p className="case-study-subtitle">{data.subtitle}</p>
      <p className="case-study-summary">{data.summary}</p>
      <p className="case-study-status">{data.status}</p>
      <ul className="technology-chips" aria-label={labels.technologies}>
        {data.technologies.map(tech => <li className="technology-chip" key={tech.name}>
          <Icon name={tech.icon} /> <span>{tech.name}</span>
        </li>)}
      </ul>
      <Link className="shore-button" to={`/case-studies/${data.id}`}>
        {labels.readCaseStudy}<Icon name="shore-arrow" />
      </Link>
    </div>
  </article>;
}
