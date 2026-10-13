import React, { lazy, Suspense, useState } from 'react';

const ProjectDetailsModal = lazy(() => import('./ProjectDetailsModal'));

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
              <img src={`/images/thumbnails/${project.id}-480.webp`}
                srcSet={`/images/thumbnails/${project.id}-480.webp 480w, /images/thumbnails/${project.id}-960.webp 960w`}
                sizes="(min-width: 992px) 33vw, (min-width: 768px) 50vw, 100vw"
                width="960" height="600" alt={`${project.title} — ${labels.screenshot}`} loading="lazy" decoding="async" />
              <span className="project-date">{project.startDate}</span>
              <h3 className="project-title-settings">{project.title}</h3>
              <span className="archive-label">{labels.archived}</span>
            </div>
          </button>
        </div>)}
      </div>
      {selectedProject && <Suspense fallback={<p role="status" className="portfolio-status">{labels.loading}</p>}>
        <ProjectDetailsModal show onHide={() => setSelectedProject(null)} data={selectedProject} labels={labels} />
      </Suspense>}
    </section>
  );
}
