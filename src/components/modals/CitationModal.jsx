import React, { useRef, useEffect, useId } from 'react';
import Icon from '../Icons';

export default function CitationModal({ citation, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const prevActive = document.activeElement;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
    return () => {
      if (dialog && dialog.open) {
        dialog.close();
      }
      prevActive?.focus?.();
    };
  }, []);

  if (!citation) return null;

  return (
    <dialog
      aria-labelledby={titleId}
      className="wb-dialog"
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <header>
        <h2 id={titleId}>Question source</h2>
        <button type="button" className="wb-icon" onClick={onClose} aria-label="Close">
          <Icon name="x" size={18} />
        </button>
      </header>

      <div className="wb-eyebrow">
        {citation.title || citation.source?.title || 'Source Reference'} · Line {citation.index || citation.source?.index || 1}
      </div>

      <blockquote>
        {citation.quote || citation.source?.quote || citation.text || citation.e || ''}
      </blockquote>

      <p className="wb-fine">
        This is the source excerpt saved at generation time. It remains available even if the source document is modified or removed.
      </p>

      <div style={{ marginTop: '20px' }}>
        <button type="button" className="wb-primary" onClick={onClose}>
          Done
        </button>
      </div>
    </dialog>
  );
}
