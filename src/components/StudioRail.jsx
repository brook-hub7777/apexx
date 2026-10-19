import React from 'react';
import Icon from './Icons';

export default function StudioRail({
  banks,
  activeBankId,
  onSelectBank,
  instantGrading,
  onToggleInstantGrading,
  shuffleQuestions,
  onToggleShuffle,
  timeLimit,
  onToggleTimeLimit,
  wrongCount,
  onOpenQuiz,
  onOpenFlashcards,
  onOpenPractice,
  onOpenMockExam,
  onOpenReports,
  onOpenSearch,
  onOpenMistakes,
  onOpenNotes,
  disabled = false,
  isMobileActive = false
}) {
  return (
    <aside className={`wb-pane wb-studio ${isMobileActive ? 'wb-mobile-active' : ''}`} role="complementary">
      <div className="wb-pane-head">
        <h2>Studio</h2>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z" />
        </svg>
      </div>

      <div className="wb-studio-body">
        <p className="wb-section-caption">TURN SOURCES INTO PROGRESS</p>

        <div className="wb-studio-grid">
          <button
            type="button"
            className="wb-studio-card wb-studio-blue wb-studio-featured"
            disabled={disabled}
            onClick={onOpenQuiz}
          >
            <Icon name="spark" size={22} />
            <strong>Quiz</strong>
            <small>From your sources</small>
            <Icon name="arrow" size={16} />
          </button>

          <button
            type="button"
            className="wb-studio-card wb-studio-red"
            disabled={disabled}
            onClick={onOpenFlashcards}
          >
            <Icon name="cards" size={22} />
            <strong>Flashcards</strong>
            <small>Recall &amp; reveal</small>
            <Icon name="arrow" size={16} />
          </button>

          <button
            type="button"
            className="wb-studio-card wb-studio-cyan"
            disabled={disabled}
            onClick={onOpenPractice}
          >
            <Icon name="check" size={22} />
            <strong>Practice</strong>
            <small>Instant feedback</small>
            <Icon name="arrow" size={16} />
          </button>

          <button
            type="button"
            className="wb-studio-card wb-studio-purple"
            disabled={disabled}
            onClick={onOpenMockExam}
          >
            <Icon name="chart" size={22} />
            <strong>Mock exam</strong>
            <small>Grade at the end</small>
            <Icon name="arrow" size={16} />
          </button>

          <button
            type="button"
            className="wb-studio-card wb-studio-yellow"
            disabled={disabled}
            onClick={onOpenReports}
          >
            <Icon name="print" size={22} />
            <strong>Reports</strong>
            <small>Review your progress</small>
            <Icon name="arrow" size={16} />
          </button>

          <button
            type="button"
            className="wb-studio-card wb-studio-blue"
            disabled={disabled}
            onClick={onOpenSearch}
          >
            <Icon name="search" size={22} />
            <strong>Data table</strong>
            <small>Browse source excerpts</small>
            <Icon name="arrow" size={16} />
          </button>

          <button type="button" className="wb-studio-card wb-studio-green" disabled>
            <Icon name="sound" size={22} />
            <strong>Audio overview</strong>
            <small>Preview</small>
            <em>Coming soon</em>
            <Icon name="arrow" size={16} />
          </button>

          <button type="button" className="wb-studio-card wb-studio-pink" disabled>
            <Icon name="spark" size={22} />
            <strong>Mind map</strong>
            <small>Preview</small>
            <em>Coming soon</em>
            <Icon name="arrow" size={16} />
          </button>
        </div>

        <div className="wb-divider" />

        <label className="wb-field wb-bank-select">
          Active question bank
          <select
            value={activeBankId}
            disabled={disabled}
            onChange={(e) => onSelectBank(e.target.value)}
          >
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <div className="wb-settings">
          <label className="wb-check">
            <span>Instant grading</span>
            <input
              type="checkbox"
              checked={instantGrading}
              disabled={disabled}
              onChange={(e) => onToggleInstantGrading(e.target.checked)}
            />
          </label>

          <label className="wb-check">
            <span>Shuffle questions</span>
            <input
              type="checkbox"
              checked={shuffleQuestions}
              disabled={disabled}
              onChange={(e) => onToggleShuffle(e.target.checked)}
            />
          </label>

          <label className="wb-check">
            <span>10-minute time limit</span>
            <input
              type="checkbox"
              checked={timeLimit}
              disabled={disabled}
              onChange={(e) => onToggleTimeLimit(e.target.checked)}
            />
          </label>
        </div>

        <div className="wb-divider" />

        <button
          type="button"
          className="wb-studio-row"
          disabled={disabled}
          onClick={onOpenMistakes}
        >
          <Icon name="wrong" size={20} />
          <span>Mistake notebook</span>
          <span className="wb-count">{wrongCount}</span>
        </button>

        <button
          type="button"
          className="wb-studio-row"
          disabled={disabled}
          onClick={onOpenNotes}
        >
          <Icon name="file" size={20} />
          <span>Study notes</span>
          <Icon name="arrow" size={16} />
        </button>

        <button
          type="button"
          className="wb-studio-row"
          disabled={disabled}
          onClick={onOpenSearch}
        >
          <Icon name="search" size={20} />
          <span>Search sources</span>
          <Icon name="arrow" size={16} />
        </button>

        <div className="wb-studio-output">
          <Icon name="spark" size={22} />
          <strong>Studio output will be saved here</strong>
          <p>After adding sources, create quizzes, flashcards, and reports.</p>
          <button
            type="button"
            className="wb-primary"
            disabled={disabled}
            onClick={onOpenNotes}
          >
            <Icon name="file" size={16} />
            <span>Add note</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
