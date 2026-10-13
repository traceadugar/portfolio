import React from 'react';
import '../scss/timeline.scss';
import Icon from './Icon';

export default function Experience({ resumeExperience, resumeBasicInfo }) {
  return (
    <section id="resume" className="pb-5">
      <h2 className="section-title"><span className="text-black">{resumeBasicInfo.section_name.experience}</span></h2>
      <div className="col-md-10 mx-auto">
        <ol className="vertical-timeline vertical-timeline--two-columns">
          {resumeExperience.map(work => <li className="vertical-timeline-element" key={work.id}>
            <span className="vertical-timeline-element-icon" aria-hidden="true">
              <Icon name="fa-briefcase" className="experience-icon" />
            </span>
            <div className="vertical-timeline-element-content">
              <span className="vertical-timeline-element-content-arrow" aria-hidden="true" />
              <div className="timeline-badges">
                {work.mainTech.map(tech => <span className="main-badge badge rounded-pill bg-primary" key={tech}>{tech}</span>)}
              </div>
              <h3 className="vertical-timeline-element-title">{work.title}</h3>
              <h4 className="vertical-timeline-element-subtitle">{work.company}</h4>
              <ul className="experience-summary">{work.summary.map(line => <li key={line}>{line}</li>)}</ul>
              <div className="timeline-badges">
                {work.technologies.map(tech => <span className="experience-badge badge rounded-pill bg-primary" key={tech}>{tech}</span>)}
              </div>
              <span className="vertical-timeline-element-date">{work.years}</span>
            </div>
          </li>)}
        </ol>
      </div>
    </section>
  );
}
