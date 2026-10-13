import React from 'react';
import { Link } from 'react-router-dom';
import Projects from './Projects';
import Skills from './Skills';
import Experience from './Experience';
import Icon from './Icon';

export default function Home({ resumeData, sharedData, labels }) {
  const description = resumeData.basic_info.description;
  const sentences = description.match(/[^。.!?]+[。.!?]?/g)?.map(sentence => sentence.trim()) || [];
  const introduction = sentences.slice(0, 2).join(description.includes('。') ? '' : ' ');

  return <>
    <section className="section-shell portfolio-intro" aria-labelledby="intro-heading">
      <div className="intro-copy">
        <p className="eyebrow"><Icon name="shore-compass" />{labels.introEyebrow}</p>
        <h2 id="intro-heading">{resumeData.basic_info.description_header}</h2>
        <p>{introduction}</p>
      </div>
      <div className="intro-actions">
        <Link className="shore-button" to="/about">{labels.readAbout}<Icon name="shore-arrow" /></Link>
        <Link className="shore-button shore-button-secondary" to="/#resume">{resumeData.basic_info.section_name.experience}</Link>
      </div>
    </section>
    <Projects resumeProjects={resumeData.projects} resumeCaseStudies={resumeData.case_studies} resumeBasicInfo={resumeData.basic_info} labels={labels} />
    <Skills sharedSkills={sharedData.skills} resumeBasicInfo={resumeData.basic_info} labels={labels} />
    <Experience resumeExperience={resumeData.experience} resumeBasicInfo={resumeData.basic_info} />
  </>;
}
