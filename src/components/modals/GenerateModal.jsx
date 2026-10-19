import React, { useState, useRef, useEffect, useId } from 'react';
import Icon from '../Icons';

export default function GenerateModal({ sources, onGenerate, onClose }) {
  const [maxCount, setMaxCount] = useState(8);
  const [style, setStyle] = useState('mixed');
  const [error, setError] = useState('');

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

  const selectedSources = sources.filter(s => s.selected);

  const handleGenerate = () => {
    try {
      setError('');
      onGenerate({ maxCount, style });
    } catch (err) {
      if (err.message === 'select') {
        setError('Please select at least one source document in the left sidebar.');
      } else if (err.message === 'facts') {
        setError('No extractable facts or definitions found in the selected documents. Use definitions formatted as "Term: Definition" or bold keywords.');
      } else {
        setError('Extraction failed: ' + err.message);
      }
    }
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
        <h2 id={titleId}>Generate from your sources</h2>
        <button type="button" className="wb-icon" onClick={onClose} aria-label="Close">
          <Icon name="x" size={18} />
        </button>
      </header>

      <p className="wb-muted">
        Extracts facts locally into multiple-choice or fill-in questions. No AI calls or open-ended reasoning questions.
      </p>

      <div className="wb-generation-sources">
        <span>{selectedSources.length ? `Using ${selectedSources.length} sources:` : 'No sources selected:'}</span>
        {selectedSources.map(s => (
          <div key={s.id}>
            <Icon name="file" size={14} />
            <span>{s.title}</span>
          </div>
        ))}
      </div>

      <label className="wb-field">
        <span>Maximum questions</span>
        <select value={maxCount} onChange={(e) => setMaxCount(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </label>

      <label className="wb-field">
        <span>Question style</span>
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="mixed">Multiple choice + fill-in</option>
          <option value="blank">Fill-in only</option>
        </select>
      </label>

      <p className="wb-fine">
        Fewer extractable facts means fewer questions. Nothing is duplicated to fill a quota. Review all answers against the source.
      </p>

      {error && <p className="wb-error" role="alert">{error}</p>}

      <button
        type="button"
        className="wb-primary wb-full"
        style={{ marginTop: '16px' }}
        disabled={!selectedSources.length}
        onClick={handleGenerate}
      >
        <Icon name="spark" size={16} />
        <span>Generate question drafts</span>
      </button>
    </dialog>
  );
}
