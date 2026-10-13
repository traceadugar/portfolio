import React, { useState } from 'react';
import ProjectDetailsModal from './ProjectDetailsModal';

export default function Projects({ resumeProjects, resumeBasicInfo, labels }) {
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <section id="portfolio">
      <h2 className="section-title">{resumeBasicInfo.section_name.projects}</h2>
      <p className="archive-intro">{labels.archiveNote}</p>
      <div className="row mx-auto">
        {resumeProjects.map(project => <div className="col-sm-12 col-md-6 col-lg-4" key={project.id}>
          <button type="button" className="project-card foto portfolio-item d-block"
            aria-label={`${labels.openProject}: ${project.title}`} onClick={() => setSelectedProject(project)}>
            <div>
              <img src={project.images[0]} alt={`${project.title} — ${labels.screenshot}`} loading="lazy" />
              <span className="project-date">{project.startDate}</span>
              <h3 className="project-title-settings">{project.title}</h3>
              <span className="archive-label">{labels.archived}</span>
            </div>
          </button>
        </div>)}
      </div>
      <ProjectDetailsModal show={Boolean(selectedProject)} onHide={() => setSelectedProject(null)}
        data={selectedProject} labels={labels} />
    </section>
  );
}
