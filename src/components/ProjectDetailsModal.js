import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Icon from './Icon';

export default function ProjectDetailsModal({ show, onHide, data, labels }) {
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => { setImageIndex(0); }, [data]);
  if (!data) return null;
  const current = data.kind === 'current';
  const count = data.images.length;
  const imageCaption = data.imageCaptions?.[imageIndex];
  const imageAlt = data.imageAlts?.[imageIndex] || data.imageAlt || `${data.title} — ${labels.screenshot} ${imageIndex + 1}`;
  const moveImage = direction => setImageIndex(index => (index + direction + count) % count);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-inside" aria-labelledby="project-modal-title">
      <Modal.Header>
        <div className="project-modal-heading">
          <p className="project-modal-year"><Icon name={current ? 'shore-code' : 'shore-anchor'} /> {current ? labels.currentProject : labels.archived} <span aria-hidden="true">·</span> {data.startDate}</p>
          <Modal.Title as="h2" id="project-modal-title">{data.title}</Modal.Title>
        </div>
        <button type="button" className="project-close shore-icon-button" onClick={onHide} aria-label={labels.close}><Icon name="shore-close" /></button>
      </Modal.Header>
      <Modal.Body className="project-modal-body">
        <div className="project-gallery" role="group" aria-label={labels.gallery} tabIndex={count > 1 ? 0 : undefined} onKeyDown={event => {
          if (count > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
            event.preventDefault(); moveImage(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}>
          <figure className="project-screenshot">
            <img src={data.images[imageIndex]} alt={imageAlt} decoding="async" />
            <figcaption aria-live="polite" aria-atomic="true">
              {imageCaption ? <>{imageCaption} <span aria-hidden="true">·</span> {labels.image} {imageIndex + 1} {labels.of} {count}</>
                : data.attribution || <>{labels.image} {imageIndex + 1} {labels.of} {count}</>}
            </figcaption>
            {imageCaption && <a className="project-image-open" href={data.images[imageIndex]} target="_blank" rel="noopener noreferrer">
              {labels.fullSizeImage}<Icon name="shore-arrow" />
              <span className="visually-hidden"> ({labels.opensNewTab})</span>
            </a>}
          </figure>
          {count > 1 && <div className="gallery-controls">
            <button type="button" className="gallery-step shore-icon-button" onClick={() => moveImage(-1)} aria-label={labels.previous}><Icon name="shore-chevron-left" /></button>
            <div className="gallery-dots">
              {data.images.map((image, index) => <button type="button" key={image}
                aria-label={`${labels.selectImage} ${index + 1}`} aria-pressed={index === imageIndex}
                onClick={() => setImageIndex(index)}>{index + 1}</button>)}
            </div>
            <button type="button" className="gallery-step shore-icon-button" onClick={() => moveImage(1)} aria-label={labels.next}><Icon name="shore-chevron-right" /></button>
          </div>}
        </div>
        <div className="project-detail-copy">
          <p className="modal-description">{data.description}</p>
          {data.highlights?.length > 0 && <div className="project-highlights">
            {data.highlights.map(highlight => <div className="project-highlight" key={highlight.title}>
              <h3 className="project-highlight-title">{highlight.title}</h3>
              <p>{highlight.description}</p>
            </div>)}
          </div>}
          <ul className="project-technologies technology-chips" aria-label={labels.technologies}>
            {data.technologies.map(tech => <li className="technology-chip" key={tech.name}>
              <Icon name={tech.icon} /> <span>{tech.name}</span>
            </li>)}
          </ul>
          {!current && <p className="archive-note"><Icon name="shore-shell" /> <span>{labels.archiveNote}</span></p>}
          {(data.repositoryUrl || data.journalUrl) && <div className="project-detail-actions">
            {data.repositoryUrl && <a className="repository-link shore-button" href={data.repositoryUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="shore-code" /> {labels.repository} <Icon name="shore-arrow" />
              {current && <span className="visually-hidden"> ({labels.opensNewTab})</span>}
            </a>}
            {data.journalUrl && <a className="journal-link shore-button shore-button-secondary" href={data.journalUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="shore-book" /> {labels.readJournal} <Icon name="shore-arrow" />
              <span className="visually-hidden"> ({labels.opensNewTab})</span>
            </a>}
          </div>}
        </div>
      </Modal.Body>
    </Modal>
  );
}
