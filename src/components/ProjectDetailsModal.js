import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Icon from './Icon';

export default function ProjectDetailsModal({ show, onHide, data, labels }) {
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => { setImageIndex(0); }, [data]);
  if (!data) return null;
  const count = data.images.length;
  const moveImage = direction => setImageIndex(index => (index + direction + count) % count);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-inside" aria-labelledby="project-modal-title">
      <Modal.Header>
        <div className="project-modal-heading">
          <p className="project-modal-year"><Icon name="shore-anchor" /> {labels.archived} <span aria-hidden="true">·</span> {data.startDate}</p>
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
            <img src={data.images[imageIndex]} alt={`${data.title} — ${labels.screenshot} ${imageIndex + 1}`} decoding="async" />
            <figcaption aria-live="polite" aria-atomic="true">{labels.image} {imageIndex + 1} {labels.of} {count}</figcaption>
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
          <ul className="project-technologies technology-chips" aria-label={labels.technologies}>
            {data.technologies.map(tech => <li className="technology-chip" key={tech.name}>
              <Icon name={tech.icon} /> <span>{tech.name}</span>
            </li>)}
          </ul>
          <p className="archive-note"><Icon name="shore-shell" /> <span>{labels.archiveNote}</span></p>
          {data.repositoryUrl && <div className="project-detail-actions"><a className="repository-link shore-button" href={data.repositoryUrl} target="_blank" rel="noopener noreferrer"><Icon name="shore-code" /> {labels.repository} <Icon name="shore-arrow" /></a></div>}
        </div>
      </Modal.Body>
    </Modal>
  );
}
