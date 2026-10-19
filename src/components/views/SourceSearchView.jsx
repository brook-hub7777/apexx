import React, { useState } from 'react';
import Icon from '../Icons';

export default function SourceSearchView({
  sources = [],
  initialQuery = '',
  onBack,
  onOpenCitation
}) {
  const [query, setQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [results, setResults] = useState(() => {
    if (!initialQuery) return [];
    const q = initialQuery.toLowerCase();
    return sources.filter(s => s.selected).flatMap(src => {
      return (src.text || '').split('\n').map((line, idx) => ({
        id: src.id,
        title: src.title,
        text: line,
        index: idx + 1
      })).filter(item => item.text.toLowerCase().includes(q));
    }).slice(0, 20);
  });

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    const hits = sources.filter(s => s.selected).flatMap(src => {
      return (src.text || '').split('\n').map((line, idx) => ({
        id: src.id,
        title: src.title,
        text: line,
        index: idx + 1
      })).filter(item => item.text.toLowerCase().includes(q));
    }).slice(0, 20);
    setResults(hits);
    setHasSearched(true);
  };

  return (
    <>
      <div className="wb-pane-head">
        <div className="wb-breadcrumb">
          <button className="wb-icon" onClick={onBack} aria-label="Back">
            <Icon name="arrow" size={18} />
          </button>
          <span>Data table / Search</span>
        </div>
      </div>

      <div className="wb-main-content">
        <section className="wb-reader">
          <div className="wb-eyebrow">KEYWORD SEARCH</div>
          <h1>Find it in your sources</h1>
          <p className="wb-reader-meta">
            Keyword search across selected sources. This does not generate AI answers.
          </p>

          <form className="wb-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter a keyword, e.g. sort"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="wb-primary">
              <Icon name="search" size={16} />
              <span>Find</span>
            </button>
          </form>

          {hasSearched && (
            <p className="wb-fine" style={{ marginBottom: '16px' }}>
              Matching excerpts: {results.length}{results.length === 20 ? '+' : ''}
            </p>
          )}

          <div>
            {results.map((hit, idx) => (
              <button
                type="button"
                key={idx}
                className="wb-hit"
                onClick={() => onOpenCitation(hit)}
              >
                <small>{hit.title} · Line {hit.index}</small>
                <p>{hit.text}</p>
                <span>View source excerpt ↗</span>
              </button>
            ))}

            {hasSearched && results.length === 0 && (
              <div className="wb-empty">
                <p>No matches found. Try a shorter keyword or select another source document.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
