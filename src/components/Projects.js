import React, { lazy, Suspense, useState } from 'react';
import Icon from './Icon';
import CaseStudyCard from './CaseStudyCard';

const ProjectDetailsModal = lazy(() => import('./ProjectDetailsModal'));

export default function Projects({ resumeProjects, resumeCaseStudies = [], resumeBasicInfo, labels }) {
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <section id="portfolio" className="shore-section portfolio-section" aria-labelledby="portfolio-title">
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-kicker"><Icon name="shore-code" /> {labels.projectsKicker}</p>
          <h2 className="section-title" id="portfolio-title">{resumeBasicInfo.section_name.projects}</h2>
        </div>
        {resumeCaseStudies.map(caseStudy => <CaseStudyCard data={caseStudy} labels={labels} key={caseStudy.id} />)}
        <div className="project-archive-heading">
          <h3>{labels.archiveHeading}</h3>
          <p className="section-intro archive-intro">{labels.archiveNote}</p>
        </div>
        <div className="project-grid">
          {[...resumeProjects].reverse().map(project => <article className="project-card-shell" key={project.id}>
            <button type="button" className="project-card"
              aria-label={`${labels.openProject}: ${project.title}`} onClick={() => setSelectedProject(project)}>
              <span className="project-image-wrap">
                <img src={`/images/thumbnails/${project.id}-480.webp`}
                  srcSet={`/images/thumbnails/${project.id}-480.webp 480w, /images/thumbnails/${project.id}-960.webp 960w`}
                  sizes="(min-width: 1100px) 32vw, (min-width: 700px) 48vw, 100vw"
                  width="960" height="600" alt={`${project.title} — ${labels.screenshot}`} loading="lazy" decoding="async" />
                <span className="project-year">{project.startDate}</span>
              </span>
              <span className="project-card-content">
                <span className="project-card-meta"><span className="archive-label"><Icon name="shore-anchor" /> {labels.archived}</span></span>
                <span className="project-title" role="heading" aria-level="3">{project.title}</span>
                <span className="project-summary">{project.description}</span>
                <span className="technology-chips" role="list" aria-label={labels.technologies}>
                  {project.technologies.map(tech => <span className="technology-chip" role="listitem" key={tech.name}>
                    <Icon name={tech.icon} /> <span>{tech.name}</span>
                  </span>)}
                </span>
                <span className="project-card-action">{labels.openProject} <Icon name="shore-arrow" /></span>
              </span>
            </button>
          </article>)}
        </div>
      </div>
      {selectedProject && <Suspense fallback={<p role="status" className="portfolio-status">{labels.loading}</p>}>
        <ProjectDetailsModal show onHide={() => setSelectedProject(null)} data={selectedProject} labels={labels} />
      </Suspense>}
    </section>
  );
}
