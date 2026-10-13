import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

function formatCredentialDate(month, locale) {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', timeZone: 'UTC' })
    .format(new Date(`${month}-01T00:00:00Z`));
}

export default function About({ resumeBasicInfo, sharedBasicInfo, labels }) {
  // Keep the supplied biography intact while giving each topic room to breathe.
  const sentences = resumeBasicInfo.description.match(/[^。.!?]+[。.!?]?/g)?.map(sentence => sentence.trim()) || [];
  const separator = resumeBasicInfo.description.includes('。') ? '' : ' ';
  const paragraphs = [sentences.slice(0, 2).join(separator), ...sentences.slice(2)].filter(Boolean);
  const linkedin = sharedBasicInfo?.social.find(network => network.name === 'LinkedIn')?.url;

  return <section id="about" className="section-shell about-section" aria-labelledby="about-heading">
    <div className="section-heading">
      <span className="section-emblem" aria-hidden="true"><Icon name="shore-compass" /></span>
      <h2 id="about-heading" className="section-title">{resumeBasicInfo.section_name.about}</h2>
    </div>
    <div className="about-layout">
      <figure className="profile-panel shore-panel">
        <img className="profile-photo" width="200" height="285" src="/images/thumbnails/profile.webp"
          alt={labels.profilePhoto} loading="lazy" decoding="async" />
        <figcaption>{sharedBasicInfo?.name || 'Trace Dugar'}</figcaption>
      </figure>
      <article className="about-copy shore-panel">
        <h3>{resumeBasicInfo.description_header}</h3>
        {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <ul className="tech-list about-focus">
          {[labels.focusOperations, labels.focusDevelopment, labels.focusDocumentation].map(focus => <li key={focus}>{focus}</li>)}
        </ul>
        <div className="about-actions">
          {linkedin && <a className="shore-button" href={linkedin} target="_blank" rel="noopener noreferrer">
            {labels.contact}<Icon name="shore-arrow" />
          </a>}
          <Link className="shore-button shore-button-secondary" to="/">{labels.backHome}</Link>
        </div>
      </article>
    </div>
    <div className="credentials-grid">
      <section className="shore-panel credentials-panel" aria-labelledby="certifications-heading">
        <h3 id="certifications-heading"><Icon name="shore-shield" />{labels.credentialsHeading}</h3>
        <ul className="credentials-list">
          {sharedBasicInfo?.certifications?.map(credential => <li key={credential.id}>
            {credential.url ? <a className="credential-link" href={credential.url} target="_blank" rel="noopener noreferrer"
              aria-label={`${labels[credential.label]} (${labels.opensNewTab})`}>
              {labels[credential.label]}<Icon name="shore-arrow" />
            </a> : <span className="credential-title">{labels[credential.label]}</span>}
            <span className="credential-meta">
              {credential.issuer} · {labels.credentialIssued} {formatCredentialDate(credential.issued, labels.locale)}
              {credential.expires && ` · ${labels.credentialExpires} ${formatCredentialDate(credential.expires, labels.locale)}`}
            </span>
          </li>)}
        </ul>
      </section>
      <section className="shore-panel credentials-panel" aria-labelledby="education-heading">
        <h3 id="education-heading"><Icon name="shore-book" />{labels.educationHeading}</h3>
        <ul className="credentials-list">
          <li>{labels.degreeAudio}</li>
          <li>{labels.trainingCode}</li>
        </ul>
      </section>
    </div>
  </section>;
}
