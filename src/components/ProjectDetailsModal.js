import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function ProjectDetailsModal({ show, onHide, data, labels }) {
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => { setImageIndex(0); }, [data]);
  if (!data) return null;
  const count = data.images.length;
  const moveImage = direction => setImageIndex(index => (index + direction + count) % count);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-inside" aria-labelledby="project-modal-title">
      <Modal.Header>
        <Modal.Title as="h2" id="project-modal-title">{data.title}</Modal.Title>
        <button type="button" className="project-close" onClick={onHide} aria-label={labels.close}>×</button>
      </Modal.Header>
      <Modal.Body>
        <div role="group" aria-label={labels.gallery} onKeyDown={event => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault(); moveImage(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}>
          <figure className="project-screenshot">
            <img src={data.images[imageIndex]} alt={`${data.title} — ${labels.screenshot} ${imageIndex + 1}`} />
            <figcaption>{labels.image} {imageIndex + 1} {labels.of} {count}</figcaption>
          </figure>
          {count > 1 && <div className="gallery-controls">
            <button type="button" onClick={() => moveImage(-1)}>{labels.previous}</button>
            <div className="gallery-dots">
              {data.images.map((image, index) => <button type="button" key={image}
                aria-label={`${labels.selectImage} ${index + 1}`} aria-pressed={index === imageIndex}
                onClick={() => setImageIndex(index)}>{index + 1}</button>)}
            </div>
            <button type="button" onClick={() => moveImage(1)}>{labels.next}</button>
          </div>}
        </div>
        <p className="archive-note">{labels.archiveNote}</p>
        <p className="modal-description">{data.description}</p>
        {data.repositoryUrl && <a className="repository-link" href={data.repositoryUrl} target="_blank" rel="noopener noreferrer">{labels.repository}</a>}
        <ul className="list-inline project-technologies">
          {data.technologies.map(tech => <li className="list-inline-item" key={tech.name}>
            <i className={tech.class} aria-hidden="true" /> <span>{tech.name}</span>
          </li>)}
        </ul>
      </Modal.Body>
    </Modal>
  );
}
