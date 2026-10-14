import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Skills({ sharedSkills, resumeBasicInfo, labels }) {
  const groups = [
    { id: 'systems', label: labels.systemsTools, icon: 'shore-network' },
    { id: 'development', label: labels.developmentTools, icon: 'shore-code' },
    { id: 'ai', label: labels.aiEngineering, icon: 'shore-workflow' },
    { id: 'security', label: labels.securityDocumentation, icon: 'shore-shield' },
  ];

  return <section id="skills" className="section-shell skills-section" aria-labelledby="skills-heading">
    <div className="section-heading">
      <div className="section-title-row">
        <span className="section-emblem" aria-hidden="true"><Icon name="shore-code" /></span>
        <h2 id="skills-heading" className="section-title">{resumeBasicInfo.section_name.skills}</h2>
      </div>
      <p className="section-intro">{labels.skillsIntro}</p>
    </div>
    <div className="skills-groups">
      {groups.map(group => <section className="skills-group shore-panel" aria-labelledby={`skills-${group.id}`} key={group.id}>
        <h3 id={`skills-${group.id}`}><Icon name={group.icon} />{group.label}</h3>
        <ul className="skills-list">
          {sharedSkills.icons.filter(skill => skill.group === group.id).map(skill => <li key={skill.name}>
            {skill.evidence ? <Link className="skills-tile" to={skill.evidence}>
              <Icon name={skill.icon} /><span>{skill.label ? labels[skill.label] : skill.name}</span>
              <Icon name="shore-arrow" className="skill-evidence-arrow" />
              <span className="visually-hidden"> — {labels.skillEvidence}</span>
            </Link> : <span className="skills-tile">
              <Icon name={skill.icon} /><span>{skill.label ? labels[skill.label] : skill.name}</span>
            </span>}
          </li>)}
        </ul>
      </section>)}
    </div>
  </section>;
}
