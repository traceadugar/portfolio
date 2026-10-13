import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { readPreference, savePreference } from '../translations';
import SeasideBackground from './SeasideBackground';
import Icon from './Icon';

export default function Header({ sharedData, resumeBasicInfo, labels, theme, changeTheme, language, applyPickedLanguage, loading }) {
  const [paused, setPaused] = useState(() => readPreference('portfolioMotion', 'playing') === 'paused');
  const toggleMotion = () => {
    const nextPaused = !paused;
    setPaused(nextPaused);
    savePreference('portfolioMotion', nextPaused ? 'paused' : 'playing');
  };
  const github = sharedData?.social.find(item => item.name === 'GitHub')?.url;
  const linkedin = sharedData?.social.find(item => item.name === 'LinkedIn')?.url;
  return <>
    <a className="skip-link" href="#main-content">{labels.skipContent}</a>
    <div className="site-navigation">
      <nav className="site-nav section-shell" aria-label={labels.navigation}>
        <NavLink className="nav-brand" to="/" aria-label={`${sharedData?.name || 'Trace Dugar'} — ${labels.home}`}>
          <span className="brand-emblem"><Icon name="shore-compass" /></span>
          <span className="brand-name">{sharedData?.name || 'Trace Dugar'}</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end><Icon name="shore-home" />{labels.home}</NavLink>
          <NavLink to="/about"><Icon name="shore-person" />{labels.about}</NavLink>
          <Link to="/#portfolio"><Icon name="shore-code" />{labels.projectsNav}</Link>
          <Link to="/#resume"><Icon name="shore-briefcase" />{labels.experienceNav}</Link>
        </div>
        <div className="nav-controls">
          <label className="nav-language">
            <span className="visually-hidden">{labels.language}</span>
            <select value={language} disabled={loading} onChange={event => applyPickedLanguage(event.target.value)}>
              <option value="en" lang="en">English</option>
              <option value="ja" lang="ja">日本語</option>
            </select>
          </label>
          <button type="button" role="switch" aria-checked={theme === 'dark'} aria-label={labels.darkMode}
            title={labels.darkMode} className={`theme-toggle shore-icon-button ${theme}`} onClick={changeTheme}>
            <Icon name={theme === 'dark' ? 'shore-sun' : 'shore-moon'} />
          </button>
          <button type="button" className="motion-toggle shore-icon-button" onClick={toggleMotion}
            aria-label={paused ? labels.playAnimation : labels.pauseAnimation}
            title={paused ? labels.playAnimation : labels.pauseAnimation}>
            <Icon name={paused ? 'shore-play' : 'shore-pause'} />
          </button>
        </div>
      </nav>
    </div>
    <header id="home" className="site-header" data-motion={paused ? 'paused' : 'playing'}>
      <SeasideBackground theme={theme} paused={paused} />
      <div className="header-content">
        <p className="hero-eyebrow">{labels.heroEyebrow}</p>
        <h1>{sharedData?.name || 'Trace Dugar'}</h1>
        <p className="title-container">{resumeBasicInfo?.headline}</p>
        {sharedData && <div className="header-actions">
          <Link className="shore-button hero-button" to="/#portfolio">{labels.projects}<Icon name="shore-arrow" /></Link>
          {linkedin && <a className="shore-button hero-button-secondary" href={linkedin} target="_blank" rel="noopener noreferrer">{labels.contact}<Icon name="shore-envelope" /></a>}
          {github && <a className="hero-github" href={github} target="_blank" rel="noopener noreferrer" aria-label={labels.github}><Icon name="fa-github" />GitHub</a>}
        </div>}
      </div>
    </header>
  </>;
}
