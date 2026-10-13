import React from 'react';
import Icon from './Icon';

export default function Experience({ resumeExperience, resumeBasicInfo }) {
  return (
    <section id="resume" className="section-shell experience-section" aria-labelledby="experience-heading">
      <div className="section-heading">
        <span className="section-emblem" aria-hidden="true"><Icon name="shore-briefcase" /></span>
        <h2 id="experience-heading" className="section-title">{resumeBasicInfo.section_name.experience}</h2>
      </div>
      <ol className="career-timeline">
        {resumeExperience.map(work => <li className="career-entry" key={work.id}>
          <span className="career-marker" aria-hidden="true"><Icon name="shore-briefcase" /></span>
          <article className="career-card shore-panel" aria-labelledby={`role-${work.id}`}>
            <p className="career-date">{work.years}</p>
            <h3 id={`role-${work.id}`} className="career-role">{work.title}</h3>
            <h4 className="career-company">{work.company}</h4>
            <ul className="tech-list career-focus">
              {work.mainTech.map(tech => <li key={tech}>{tech}</li>)}
            </ul>
            <div className="experience-summary">{work.summary.map(line => <p key={line}>{line}</p>)}</div>
            <ul className="tech-list career-technologies">
              {work.technologies.map(tech => <li key={tech}>{tech}</li>)}
            </ul>
          </article>
        </li>)}
      </ol>
    </section>
  );
}
