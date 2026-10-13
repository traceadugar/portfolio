import React, { lazy, Suspense, useState } from 'react';
import Icon from './Icon';
import CaseStudyCard from './CaseStudyCard';

const ProjectDetailsModal = lazy(() => import('./ProjectDetailsModal'));

export default function Projects({ resumeProjects = [], resumeCaseStudies = [], resumeCurrentProjects = [], resumeBasicInfo, labels }) {
  const [selectedProject, setSelectedProject] = useState(null);
  // TanMar is the featured professional work; other additions stay newest first.
  const caseStudies = [...resumeCaseStudies].sort((left, right) => {
    if (left.id === right.id) return 0;
    if (left.id === 'tanmar-safety-platform') return -1;
    if (right.id === 'tanmar-safety-platform') return 1;
    return (right.sortDate || '').localeCompare(left.sortDate || '');
  });
  const currentProjects = [...resumeCurrentProjects].sort((left, right) =>
    (right.sortDate || '').localeCompare(left.sortDate || ''));

  const renderProjectCard = project => {
    const current = project.kind === 'current';
    return <article className="project-card-shell" key={project.id}>
      <button type="button" className="project-card"
        aria-label={`${labels.openProject}: ${project.title}`} onClick={() => setSelectedProject(project)}>
        <span className="project-image-wrap">
          <img src={`/images/thumbnails/${project.id}-480.webp`}
            srcSet={`/images/thumbnails/${project.id}-480.webp 480w, /images/thumbnails/${project.id}-960.webp 960w`}
            sizes="(min-width: 1100px) 32vw, (min-width: 700px) 48vw, 100vw"
            width="960" height="600" alt={project.imageAlt || `${project.title} — ${labels.screenshot}`} loading="lazy" decoding="async" />
          <span className="project-year">{project.startDate}</span>
        </span>
        <span className="project-card-content">
          <span className="project-card-meta"><span className={current ? 'current-project-label' : 'archive-label'}>
            <Icon name={current ? 'shore-code' : 'shore-anchor'} /> {current ? labels.currentProject : labels.archived}
          </span></span>
          <span className="project-title" role="heading" aria-level="3">{project.title}</span>
          <span className="project-summary">{project.summary || project.description}</span>
          <span className="technology-chips" role="list" aria-label={labels.technologies}>
            {project.technologies.map(tech => <span className="technology-chip" role="listitem" key={tech.name}>
              <Icon name={tech.icon} /> <span>{tech.name}</span>
            </span>)}
          </span>
          <span className="project-card-action">{labels.openProject} <Icon name="shore-arrow" /></span>
        </span>
      </button>
    </article>;
  };

  return (
    <section id="portfolio" className="shore-section portfolio-section" aria-labelledby="portfolio-title">
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-kicker"><Icon name="shore-code" /> {labels.projectsKicker}</p>
          <h2 className="section-title" id="portfolio-title">{resumeBasicInfo.section_name.projects}</h2>
        </div>
        {caseStudies.map(caseStudy => <CaseStudyCard data={caseStudy} labels={labels} key={caseStudy.id} />)}
        {currentProjects.length > 0 && <div className="current-projects" aria-labelledby="current-projects-title">
          <div className="current-projects-heading"><h3 id="current-projects-title">{labels.currentProjectsHeading}</h3></div>
          <div className="project-grid current-project-grid">{currentProjects.map(renderProjectCard)}</div>
        </div>}
        <div className="project-archive-heading">
          <h3>{labels.archiveHeading}</h3>
          <p className="section-intro archive-intro">{labels.archiveNote}</p>
        </div>
        <div className="project-grid">
          {[...resumeProjects].reverse().map(renderProjectCard)}
        </div>
      </div>
      {selectedProject && <Suspense fallback={<p role="status" className="portfolio-status">{labels.loading}</p>}>
        <ProjectDetailsModal show onHide={() => setSelectedProject(null)} data={selectedProject} labels={labels} />
      </Suspense>}
    </section>
  );
}
