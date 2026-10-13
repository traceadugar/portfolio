import React from 'react';
import Icon from './Icon';

export default function Skills({ sharedSkills, resumeBasicInfo }) {
  return <section id="skills">
    <h2 className="section-title">{resumeBasicInfo.section_name.skills}</h2>
    <ul className="list-inline skill-icon">
      {sharedSkills.icons.map(skill => <li className="list-inline-item mx-3" key={skill.name}>
        <div className="text-center skills-tile">
          <Icon name={skill.icon} /><p>{skill.name}</p>
        </div>
      </li>)}
    </ul>
  </section>;
}
