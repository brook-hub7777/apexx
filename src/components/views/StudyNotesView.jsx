import React from 'react';
import Icon from '../Icons';

export default function StudyNotesView({
  notes,
  onChangeNotes,
  onBack,
  onExportMarkdown
}) {
  return (
    <>
      <div className="wb-pane-head">
        <div className="wb-breadcrumb">
          <button className="wb-icon" onClick={onBack} aria-label="Back">
            <Icon name="arrow" size={18} />
          </button>
          <span>Study notes</span>
        </div>
      </div>

      <div className="wb-main-content">
        <section className="wb-reader">
          <div className="wb-eyebrow">STUDY NOTES</div>
          <h1>Put your understanding into words</h1>
          <p className="wb-reader-meta">
            Your own study notes, saved automatically in this browser.
          </p>

          <div className="wb-field">
            <label>Your notes</label>
            <textarea
              className="wb-note"
              rows={14}
              maxLength={50000}
              value={notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              placeholder="Capture key ideas, questions, and what to revisit next…"
            />
          </div>

          <div className="wb-action-row">
            <button
              className="wb-button"
              disabled={!notes.trim()}
              onClick={onExportMarkdown}
            >
              <Icon name="download" size={16} />
              <span>Export Markdown</span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
