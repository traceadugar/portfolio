import React from 'react';
import Icon from './Icon';

export default function Footer({ sharedBasicInfo, labels, language, applyPickedLanguage, loading }) {
  return (
    <footer>
      <div className="footer-content">
        <div className="social-links">
          {sharedBasicInfo?.social.map(network => <a key={network.name} href={network.url}
            target="_blank" rel="noopener noreferrer" aria-label={network.name}>
            <Icon name={network.icon} /><span className="visually-hidden">{network.name}</span>
          </a>)}
        </div>
        <div className="language-controls" role="group" aria-label={labels.language}>
          <button type="button" lang="en" aria-pressed={language === 'en'} disabled={loading}
            onClick={() => applyPickedLanguage('en')}>{labels.english}</button>
          <button type="button" lang="ja" aria-pressed={language === 'ja'} disabled={loading}
            onClick={() => applyPickedLanguage('ja')}>{labels.japanese}</button>
        </div>
        <small>{labels.copyright} © {sharedBasicInfo?.name || 'Trace Dugar'}</small>
      </div>
    </footer>
  );
}
