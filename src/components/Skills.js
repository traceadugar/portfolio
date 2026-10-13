import React from 'react';
import Icon from './Icon';

export default function Skills({ sharedSkills, resumeBasicInfo, labels }) {
  const systemsNames = new Set(['Linux', 'Bash', 'Git']);
  const groups = [
    { id: 'systems', label: labels.systemsTools, icon: 'shore-network' },
    { id: 'development', label: labels.developmentTools, icon: 'shore-code' },
  ];

  return <section id="skills" className="section-shell skills-section" aria-labelledby="skills-heading">
    <div className="section-heading">
      <span className="section-emblem" aria-hidden="true"><Icon name="shore-code" /></span>
      <h2 id="skills-heading" className="section-title">{resumeBasicInfo.section_name.skills}</h2>
    </div>
    <div className="skills-groups">
      {groups.map(group => <div className="skills-group shore-panel" key={group.id}>
        <h3><Icon name={group.icon} />{group.label}</h3>
        <ul className="skills-list">
          {sharedSkills.icons.filter(skill => group.id === 'systems' ? systemsNames.has(skill.name) : !systemsNames.has(skill.name)).map(skill => <li className="skills-tile" key={skill.name}>
            <Icon name={skill.icon} /><span>{skill.name}</span>
          </li>)}
        </ul>
      </div>)}
    </div>
  </section>;
}
