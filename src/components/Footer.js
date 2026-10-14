import React from 'react';
import Icon from './Icon';
import ShoreNote from './ShoreNote';
import { Link } from 'react-router-dom';

export default function Footer({ sharedBasicInfo, labels, language, applyPickedLanguage, loading }) {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-connect">
          <h2>{labels.connectHeading}</h2>
          <p>{labels.connectNote}</p>
          <ul className="social-links">
            {sharedBasicInfo?.social.map(network => <li key={network.name}><a href={network.url}
              target="_blank" rel="noopener noreferrer" aria-label={network.name}>
              <Icon name={network.icon} /><span>{network.name}</span>
            </a></li>)}
          </ul>
        </div>
        <div className="language-controls" role="group" aria-label={labels.language}>
          <button type="button" lang="en" aria-pressed={language === 'en'} disabled={loading}
            onClick={() => applyPickedLanguage('en')}>{labels.english}</button>
          <button type="button" lang="ja" aria-pressed={language === 'ja'} disabled={loading}
            onClick={() => applyPickedLanguage('ja')}>{labels.japanese}</button>
        </div>
      </div>
      <ShoreNote labels={labels}
        copyright={<small>{labels.copyright} © {sharedBasicInfo?.name || 'Trace Dugar'}</small>}
        backToTop={<Link className="back-to-top" to="#home">{labels.backToTop}<Icon name="shore-arrow-up" /></Link>} />
    </footer>
  );
}
