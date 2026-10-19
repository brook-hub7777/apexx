import React, { useState, useRef, useEffect, useId } from 'react';
import Icon from '../Icons';
import { sanitizeSourceText, extractPdfText, SOURCE_ERROR_MESSAGES } from '../../utils/sourceLoader';

export default function ImportModal({ onAdd, onClose }) {
  const [tab, setTab] = useState('file'); // 'file' | 'text'
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
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

  const handleFiles = async (files) => {
    if (!files || !files.length) return;
    setError('');
    setLoading(true);

    try {
      if (files.length > 10) throw new Error('large');

      const newSources = [];
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) throw new Error('large');
        const ext = file.name.split('.').pop()?.toLowerCase();
        let rawContent = '';

        if (ext === 'txt' || ext === 'md') {
          rawContent = await file.text();
        } else if (ext === 'pdf') {
          const buffer = new Uint8Array(await file.arrayBuffer());
          rawContent = await extractPdfText(buffer);
        } else {
          throw new Error('format');
        }

        const clean = sanitizeSourceText(rawContent);
        newSources.push({
          id: 'src-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
          title: file.name.slice(0, 160),
          text: clean,
          kind: ext.toUpperCase(),
          selected: true
        });
      }

      onAdd(newSources);
      onClose();
    } catch (err) {
      console.warn('File import error:', err);
      setError(SOURCE_ERROR_MESSAGES[err.message] || SOURCE_ERROR_MESSAGES.invalid);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePasteSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const clean = sanitizeSourceText(text);
      onAdd([{
        id: 'src-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        title: title.trim() || 'Pasted study notes',
        text: clean,
        kind: 'TEXT',
        selected: true
      }]);
      onClose();
    } catch (err) {
      setError(SOURCE_ERROR_MESSAGES[err.message] || SOURCE_ERROR_MESSAGES.invalid);
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
        <h2 id={titleId}>Add your sources</h2>
        <button type="button" className="wb-icon" aria-label="Close" onClick={onClose}>
          <Icon name="x" size={18} />
        </button>
      </header>

      <p className="wb-muted">
        Sources stay in this browser. Nothing is uploaded to a server.
      </p>

      <div className="wb-tabs">
        <button
          type="button"
          aria-pressed={tab === 'file'}
          onClick={() => { setTab('file'); setError(''); }}
        >
          Upload files
        </button>
        <button
          type="button"
          aria-pressed={tab === 'text'}
          onClick={() => { setTab('text'); setError(''); }}
        >
          Paste text
        </button>
      </div>

      {tab === 'file' ? (
        <>
          <div
            className="wb-drop"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (!loading && e.dataTransfer.files?.length) {
                handleFiles(Array.from(e.dataTransfer.files));
              }
            }}
          >
            <Icon name="upload" size={32} />
            <h3>Bring your learning materials</h3>
            <p>Drag files here, or choose from your device</p>
            <button
              type="button"
              className="wb-primary"
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
            >
              {loading ? 'Reading files…' : 'Choose files'}
            </button>
            <small>PDF · TXT · Markdown / Up to 5 MB each</small>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md"
            multiple
            hidden
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          />

          <p className="wb-fine">
            Text-based PDFs only. No scans, encrypted files or OCR. Up to 10 files at once and 30 sources in total.
          </p>
        </>
      ) : (
        <form onSubmit={handlePasteSubmit}>
          <label className="wb-field">
            <span>Source title</span>
            <input
              value={title}
              maxLength={160}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Chapter 1 lecture notes"
            />
          </label>

          <label className="wb-field">
            <span>Source text</span>
            <textarea
              rows={9}
              value={text}
              onChange={(e) => { setText(e.target.value); setError(''); }}
              placeholder={`Suggested format:\nPhotosynthesis: The process by which plants use light to convert carbon dioxide and water into sugars and oxygen.`}
            />
          </label>

          <button className="wb-primary" type="submit">
            Add source
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="wb-error">
          {error}
        </p>
      )}
    </dialog>
  );
}
