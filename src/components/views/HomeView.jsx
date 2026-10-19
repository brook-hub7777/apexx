import React, { useState } from 'react';
import Icon from '../Icons';

export default function HomeView({
  sourcesCount = 3,
  banks = [],
  activeBankId,
  onSelectBank,
  onCreateManually,
  onSearch,
  onPromptClick
}) {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <>
      <div className="wb-pane-head">
        <div className="wb-breadcrumb">
          <span>Chat</span>
        </div>
        <div className="wb-head-tools">
          <button className="wb-icon" aria-label="Conversation settings">
            <Icon name="tune" size={18} />
          </button>
          <button className="wb-icon" aria-label="More actions">
            <Icon name="gear" size={18} />
          </button>
          <span className="wb-source-badge">{sourcesCount} sources selected</span>
        </div>
      </div>

      <div className="wb-main-content">
        <section className="wb-chat-empty">
          <div className="wb-comic-art" aria-hidden="true">
            <div className="wb-comic-caption">
              <span>VOL. 01 / STUDY CLUB</span>
              <strong>FIELD<br />NOTES<span>✦</span></strong>
              <small>READ. THINK. REPEAT.</small>
            </div>
            <img alt="" width="1024" height="1024" fetchpriority="high" src="/media/study-archivist-v2.webp" />
            <span className="wb-comic-stamp">KEEP<br />CURIOUS</span>
          </div>

          <h1>Let’s start your notebook…</h1>
          <p>
            This is your blank canvas to understand, create, or make progress. Add your own sources, or start with one of the prompts below.
          </p>

          <strong>What would you like this notebook to help you do?</strong>
          <div className="wb-prompt-chips">
            <button
              type="button"
              className="wb-chip"
              onClick={() => onPromptClick("Learn about a new topic")}
            >
              Learn about a new topic
            </button>
            <button
              type="button"
              className="wb-chip"
              onClick={() => onPromptClick("Create a question bank")}
            >
              Create a question bank
            </button>
            <button
              type="button"
              className="wb-chip"
              onClick={() => onPromptClick("Make progress on a review")}
            >
              Make progress on a review
            </button>
          </div>

          <form className="wb-chat-prompt" onSubmit={handleSearchSubmit}>
            <input
              placeholder="Ask a question or create something"
              aria-label="Ask a question or create something"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span>{sourcesCount} sources</span>
            <button type="submit" aria-label="Search">
              <Icon name="arrow" size={21} />
            </button>
          </form>
        </section>

        <section className="wb-library wb-home-library">
          <div className="wb-section-title">
            <h2>My question banks<span>{banks.length}</span></h2>
            <button type="button" className="wb-text-button" onClick={onCreateManually}>
              <Icon name="plus" size={17} />
              <span>Create manually</span>
            </button>
          </div>

          {banks.map((bank) => {
            const chapters = new Set(bank.qs.map(q => q.c)).size;
            const isCurrent = bank.id === activeBankId;
            return (
              <button
                type="button"
                key={bank.id}
                className={`wb-bank-row ${isCurrent ? 'is-current' : ''}`}
                onClick={() => onSelectBank(bank.id)}
              >
                <span className="wb-bank-symbol">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <path d="m8 8 1 1 2-2m-3 7 1 1 2-2M14 8h3M14 14h3" />
                  </svg>
                </span>
                <span className="wb-bank-copy">
                  <strong>{bank.name}</strong>
                  <small>{bank.qs.length} questions <span>·</span> {chapters} chapters</small>
                </span>
                <Icon name="arrow" size={18} />
              </button>
            );
          })}
        </section>

        <div className="wb-boundary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6zM8 12l3 3 5-6" />
          </svg>
          <p>
            Local extraction, not AI reasoning. Generated questions are drafts for you to review. No sources are sent to a model.
          </p>
        </div>
      </div>
    </>
  );
}
