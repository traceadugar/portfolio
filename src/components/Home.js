import React from 'react';
import Projects from './Projects';
import Skills from './Skills';
import Experience from './Experience';

export default function Home({ resumeData, sharedData, labels }) {
  return <>
    <Projects resumeProjects={resumeData.projects} resumeBasicInfo={resumeData.basic_info} labels={labels} />
    <Skills sharedSkills={sharedData.skills} resumeBasicInfo={resumeData.basic_info} />
    <Experience resumeExperience={resumeData.experience} resumeBasicInfo={resumeData.basic_info} />
  </>;
}
