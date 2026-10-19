import React, { useState } from 'react';
import Icon from './Icons';

export default function SourcesRail({
  sources,
  onToggleSelect,
  onSelectAll,
  onOpenSource,
  onOpenImport,
  disabled = false,
  isMobileActive = false
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const allSelected = sources.length > 0 && sources.every(s => s.selected);
  const filteredSources = sources.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className={`wb-pane wb-sources ${isMobileActive ? 'wb-mobile-active' : ''}`} role="complementary">
      <div className="wb-pane-head">
        <h2>Sources</h2>
        <span className="wb-count">{sources.length}</span>
      </div>

      <button
        className="wb-button wb-add"
        disabled={disabled}
        onClick={onOpenImport}
      >
        <Icon name="plus" size={20} />
        <span>Add sources</span>
      </button>

      <div className="wb-source-research">
        <span>Find new sources</span>
        <div>
          <button type="button" disabled={disabled} onClick={onOpenImport}>
            ◉ Web⌄
          </button>
          <button type="button" disabled={disabled} onClick={onOpenImport}>
            <Icon name="search" size={14} />
            <span>Fast research⌄</span>
          </button>
        </div>
      </div>

      <label className="wb-source-search">
        <Icon name="search" size={16} />
        <input
          placeholder="Search saved sources"
          aria-label="Search saved sources"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>

      <p className="wb-fine wb-source-hint">
        Selected sources are used for generation and search
      </p>

      <label className="wb-check wb-select-all">
        <span>Select all sources</span>
        <input
          type="checkbox"
          checked={allSelected}
          disabled={disabled}
          onChange={(e) => onSelectAll(e.target.checked)}
        />
      </label>

      <div className="wb-source-list">
        {filteredSources.map((source) => (
          <div key={source.id} className="wb-source-row">
            <button
              type="button"
              className="wb-source-link"
              onClick={() => onOpenSource(source.id)}
            >
              <Icon name="file" size={20} />
              <span>
                <strong>{source.title}</strong>
                <small>{source.kind} {source.sample && '· Sample source'}</small>
              </span>
            </button>
            <label className="wb-checkbox">
              <input
                aria-label={`Select source: ${source.title}`}
                type="checkbox"
                checked={!!source.selected}
                disabled={disabled}
                onChange={() => onToggleSelect(source.id)}
              />
            </label>
          </div>
        ))}
      </div>

      <div className="wb-source-bottom">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6zM8 12l3 3 5-6" />
        </svg>
        <div>
          <strong>Your sources stay yours</strong>
          <p>Files are read in your browser. No account needed.</p>
        </div>
      </div>
    </aside>
  );
}
