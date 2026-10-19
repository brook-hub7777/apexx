import React from 'react';
import Icon from '../Icons';

export default function MistakeNotebookView({
  mistakes = [],
  onBack,
  onReviewMistakes,
  onClearMistakes
}) {
  return (
    <>
      <div className="wb-pane-head">
        <div className="wb-breadcrumb">
          <button className="wb-icon" onClick={onBack} aria-label="Back">
            <Icon name="arrow" size={18} />
          </button>
          <span>Mistake notebook</span>
        </div>
      </div>

      <div className="wb-main-content">
        <section className="wb-reader">
          <div className="wb-eyebrow">MISTAKE NOTEBOOK · {mistakes.length} QUESTIONS</div>
          <h1>Make the unfamiliar familiar</h1>
          <p className="wb-reader-meta">
            Missed questions are collected here and saved on this device across practice sessions.
          </p>

          <div className="wb-action-row">
            <button
              className="wb-primary"
              disabled={!mistakes.length}
              onClick={onReviewMistakes}
            >
              <Icon name="check" size={16} />
              <span>Review all mistakes ({mistakes.length})</span>
            </button>
            <button
              className="wb-button"
              disabled={!mistakes.length}
              onClick={() => {
                if (window.confirm("Clear all mistake records? Your question banks will not change.")) {
                  onClearMistakes();
                }
              }}
            >
              <Icon name="trash" size={16} />
              <span>Clear notebook</span>
            </button>
          </div>

          {mistakes.length === 0 ? (
            <div className="wb-empty">
              <p>No mistakes recorded yet. Take a quiz or practice session to test your knowledge!</p>
            </div>
          ) : (
            <div>
              {mistakes.map((q, idx) => (
                <article key={idx} className="wb-draft">
                  <div className="wb-draft-no">
                    #{idx + 1}
                    {q.c && <span>{q.c}</span>}
                  </div>
                  <h3>{q.s}</h3>
                  {q.e && <p className="wb-muted">{q.e}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
