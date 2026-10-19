import React, { useRef, useEffect, useId } from 'react';
import Icon from '../Icons';

export default function PosterModal({ posterUrl, onClose }) {
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

  if (!posterUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = posterUrl;
    a.download = 'learning-report.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

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
        <h2 id={titleId}>Learning report</h2>
        <button type="button" className="wb-icon" onClick={onClose} aria-label="Close">
          <Icon name="x" size={18} />
        </button>
      </header>

      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        <img
          src={posterUrl}
          alt="Learning Report Poster"
          className="wb-poster"
        />
      </div>

      <p className="wb-fine">
        Press and hold to save, or click Download to save as PNG image.
      </p>

      <div className="wb-action-row" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
        <button type="button" className="wb-button" onClick={onClose}>
          Close
        </button>
        <button type="button" className="wb-primary" onClick={handleDownload}>
          <Icon name="download" size={16} />
          <span>Download image</span>
        </button>
      </div>
    </dialog>
  );
}
