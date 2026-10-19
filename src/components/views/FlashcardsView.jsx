import React, { useState } from 'react';
import Icon from '../Icons';

export default function FlashcardsView({ bank, onBack }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const qs = bank?.qs || [];
  const curQ = qs[cardIndex];

  const handleNext = () => {
    if (cardIndex < qs.length - 1) {
      setIsFlipped(false);
      setCardIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (cardIndex > 0) {
      setIsFlipped(false);
      setCardIndex(prev => prev - 1);
    }
  };

  const formatAnswerText = (q) => {
    if (!q) return '';
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

  if (!curQ) {
    return (
      <div className="wb-reader">
        <button className="wb-back-btn" onClick={onBack}>
          <Icon name="back" size={16} />
          <span>Back to overview</span>
        </button>
        <p>No questions available in this question bank.</p>
      </div>
    );
  }

  return (
    <>
      <div className="wb-pane-head">
        <div className="wb-breadcrumb">
          <button className="wb-icon" onClick={onBack} aria-label="Back">
            <Icon name="arrow" size={18} />
          </button>
          <span>Flashcards</span>
        </div>
      </div>

      <div className="wb-main-content">
        <section className="wb-reader">
          <div className="wb-eyebrow">RECALL FROM YOUR QUESTION BANK</div>
          <h1>Recall first. Reveal second.</h1>
          <p className="wb-reader-meta">
            {bank.name} · {qs.length} cards
          </p>

          <button
            type="button"
            className={`wb-flashcard ${isFlipped ? 'is-flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            aria-label={isFlipped ? "Show question" : "Flip to see answer"}
          >
            <span>{isFlipped ? 'ANSWER' : 'QUESTION'} {cardIndex + 1}/{qs.length}</span>
            <strong>{isFlipped ? formatAnswerText(curQ) : curQ.s}</strong>
            {isFlipped && curQ.e && <p>{curQ.e}</p>}
            <small>
              <Icon name="cards" size={14} />
              <span>{isFlipped ? 'Tap to flip back' : 'Tap to flip'}</span>
            </small>
          </button>

          <div className="wb-card-nav">
            <button
              className="wb-button"
              disabled={cardIndex === 0}
              onClick={handlePrev}
            >
              Previous
            </button>
            <span>
              {cardIndex + 1} / {qs.length}
            </span>
            <button
              className="wb-button"
              disabled={cardIndex === qs.length - 1}
              onClick={handleNext}
            >
              Next card
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
