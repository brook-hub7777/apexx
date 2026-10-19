import React, { useState } from 'react';
import Icon from '../Icons';

export default function BankOverviewView({
  bank,
  onBack,
  onStartPractice,
  onEditQuestions,
  onExportJson
}) {
  const [expandedIndices, setExpandedIndices] = useState(new Set());

  const toggleExpand = (idx) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const getKindLabel = (k) => {
    switch (k) {
      case 'single': return 'Single choice';
      case 'multi': return 'Multiple choice';
      case 'judge': return 'True / false';
      case 'blank': return 'Fill in';
      default: return 'Question';
    }
  };

  const formatAnswerText = (q) => {
    if (q.k === 'single' || q.k === 'judge') {
      const idx = q.a?.[0];
      return q.o?.[idx] || (idx === 0 ? 'True' : 'False');
    }
    if (q.k === 'multi') {
      return (q.a || []).map(i => q.o?.[i]).filter(Boolean).join(', ');
    }
    if (q.k === 'blank') {
      return Array.isArray(q.a) ? q.a.join(', ') : String(q.a || '');
    }
    return '';
  };

  return (
    <>
      <div className="wb-pane-head">
        <div className="wb-breadcrumb">
          <button className="wb-icon" onClick={onBack} aria-label="Back to overview">
            <Icon name="arrow" size={18} />
          </button>
          <span>Question bank</span>
        </div>
        <div className="wb-head-tools">
          <span className="wb-source-badge">YOUR EDITABLE QUESTION BANK</span>
        </div>
      </div>

      <div className="wb-main-content">
        <section className="wb-reader">
          <div className="wb-eyebrow">YOUR EDITABLE QUESTION BANK</div>
          <h1>{bank.name}</h1>
          <p className="wb-reader-meta">
            {bank.qs.length} questions · Review the content before practicing
          </p>

          <div className="wb-action-row">
            <button className="wb-primary" onClick={onStartPractice}>
              <Icon name="check" size={16} />
              <span>Start practice</span>
            </button>
            <button className="wb-button" onClick={onEditQuestions}>
              <Icon name="tune" size={16} />
              <span>Edit questions</span>
            </button>
            <button className="wb-button" onClick={onExportJson}>
              <Icon name="download" size={16} />
              <span>Export bank as JSON</span>
            </button>
          </div>

          <div>
            {bank.qs.map((q, idx) => (
              <article key={idx} className="wb-draft">
                <div className="wb-draft-no">
                  {String(idx + 1).padStart(2, '0')}
                  <span>{getKindLabel(q.k)}</span>
                  {q.c && <span style={{ marginLeft: 'auto' }}>{q.c}</span>}
                </div>
                <h3>{q.s}</h3>
                <details>
                  <summary>Show answer and explanation</summary>
                  <p><strong>Answer: </strong>{formatAnswerText(q)}</p>
                  {q.e && <p><strong>Explanation: </strong>{q.e}</p>}
                  {q.source && (
                    <p style={{ marginTop: '8px' }}>
                      <span className="wb-citation">
                        "{q.source.quote}" — {q.source.title} (Line {q.source.index})
                      </span>
                    </p>
                  )}
                </details>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
