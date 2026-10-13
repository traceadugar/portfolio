import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header({ sharedData, resumeBasicInfo, labels, theme, changeTheme }) {
  const github = sharedData?.social.find(item => item.name === 'GitHub')?.url;
  const linkedin = sharedData?.social.find(item => item.name === 'LinkedIn')?.url;
  return (
    <header id="home" className="site-header">
      <nav className="site-nav" aria-label={labels.home}>
        <NavLink to="/" end>{labels.home}</NavLink>
        <NavLink to="/about">{labels.about}</NavLink>
        {github && <a href={github} target="_blank" rel="noopener noreferrer" aria-label={labels.github}>GitHub</a>}
        <button type="button" role="switch" aria-checked={theme === 'dark'} aria-label={labels.darkMode}
          className={`theme-toggle ${theme}`} onClick={changeTheme}>
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          <span className="theme-toggle-knob" aria-hidden="true" />
        </button>
      </nav>
      <div className="header-content">
        <h1 className="mb-0">{sharedData?.name || 'Trace Dugar'}</h1>
        <p className="title-container">{resumeBasicInfo?.headline}</p>
        {sharedData && <div className="header-actions">
          <a href="/#portfolio">{labels.projects}</a>
          {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer">{labels.contact}</a>}
        </div>}
      </div>
    </header>
  );
}
