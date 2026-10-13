import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Badge from 'react-bootstrap/Badge';

export default function Experience({ resumeExperience, resumeBasicInfo }) {
  return (
    <section id="resume" className="pb-5">
      <h2 className="section-title"><span className="text-black">{resumeBasicInfo.section_name.experience}</span></h2>
      <div className="col-md-10 mx-auto">
        <VerticalTimeline animate={false}>
          {resumeExperience.map(work => <VerticalTimelineElement className="vertical-timeline-element--work"
            date={work.years} key={work.id} iconStyle={{ background: '#AE944F', color: '#fff', textAlign: 'center' }}
            icon={<i className="fas fa-briefcase experience-icon" aria-hidden="true" />}>
            <div className="timeline-badges">
              {work.mainTech.map(tech => <Badge pill className="main-badge" key={tech}>{tech}</Badge>)}
            </div>
            <h3 className="vertical-timeline-element-title">{work.title}</h3>
            <h4 className="vertical-timeline-element-subtitle">{work.company}</h4>
            <ul className="experience-summary">{work.summary.map(line => <li key={line}>{line}</li>)}</ul>
            <div className="timeline-badges">
              {work.technologies.map(tech => <Badge pill className="experience-badge" key={tech}>{tech}</Badge>)}
            </div>
          </VerticalTimelineElement>)}
        </VerticalTimeline>
      </div>
    </section>
  );
}
