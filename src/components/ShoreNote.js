import React, { useEffect, useId, useRef, useState } from 'react';
import Icon from './Icon';

export default function ShoreNote({ labels, copyright, backToTop }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const noteRef = useRef(null);
  const noteId = useId();
  const titleId = `${noteId}-title`;

  useEffect(() => {
    if (isOpen) noteRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'auto' });
  }, [isOpen]);

  function closeNote() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleEscape(event) {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeNote();
    }
  }

  return (
    <>
      <div className="footer-bottom">
        {copyright}
        <div className="footer-bottom-actions">
          <button type="button" ref={triggerRef}
            className="shore-icon-button shore-button-secondary shore-note-trigger"
            aria-label={labels.shoreSurprise} title={labels.shoreSurprise}
            aria-expanded={isOpen} aria-controls={noteId} onKeyDown={handleEscape}
            onClick={() => setIsOpen(open => !open)}>
            <Icon name="shore-shell" />
          </button>
          {backToTop}
        </div>
      </div>
      <section className="shore-panel shore-note" id={noteId} ref={noteRef} hidden={!isOpen}
        aria-labelledby={titleId} onKeyDown={handleEscape}>
        <div className="shore-note-copy">
          <h3 id={titleId}>{labels.shoreNoteTitle}</h3>
          <p aria-live="polite">{labels.shoreNoteMessage}</p>
        </div>
        <button type="button" className="shore-icon-button shore-button-secondary shore-note-close"
          aria-label={labels.closeShoreNote} onClick={closeNote}>
          <Icon name="shore-close" />
        </button>
      </section>
    </>
  );
}
