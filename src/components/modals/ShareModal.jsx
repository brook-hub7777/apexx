import React, { useState, useRef, useEffect, useId } from 'react';
import Icon from '../Icons';

export default function ShareModal({ link, onClose, onToast }) {
  const [copied, setCopied] = useState(false);
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

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      if (onToast) onToast('Bank link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    });
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
        <h2 id={titleId}>Share this question bank</h2>
        <button type="button" className="wb-icon" onClick={onClose} aria-label="Close">
          <Icon name="x" size={18} />
        </button>
      </header>

      <p className="wb-muted">
        This question bank is compressed directly into the link hash. Anyone with this link can practice and study in their browser without an account.
      </p>

      <label className="wb-field">
        <span>Bank link</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            readOnly
            value={link || ''}
            onClick={(e) => e.target.select()}
            style={{ flex: 1 }}
          />
          <button type="button" className="wb-primary" onClick={handleCopy}>
            <Icon name={copied ? 'check' : 'copy'} size={16} />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </label>

      <p className="wb-fine">
        Zero data is sent to a server. The questions and options are decoded locally upon opening.
      </p>
    </dialog>
  );
}
