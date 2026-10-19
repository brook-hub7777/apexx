import React from 'react';
import Icon from '../Icons';

export default function SourceReaderView({
  source,
  onBack,
  onGenerateFromSource,
  onRemoveSource
}) {
  if (!source) return null;

  const lines = (source.text || '').split('\n');
  const charCount = (source.text || '').length;

  return (
    <>
      <div className="wb-pane-head">
        <div className="wb-breadcrumb">
          <button className="wb-icon" onClick={onBack} aria-label="Back">
            <Icon name="arrow" size={18} />
          </button>
          <span>Source reader</span>
        </div>
      </div>

      <div className="wb-main-content">
        <section className="wb-reader">
          <div className="wb-eyebrow">SOURCE READER · {source.kind} · {charCount} CHARACTERS</div>
          <h1 className="wb-source-title">{source.title}</h1>
          <p className="wb-reader-meta">
            {source.sample ? 'Original sample · demonstrates the source-to-practice workflow' : 'Custom user study source'}
          </p>

          <div className="wb-action-row">
            <button className="wb-primary" onClick={() => onGenerateFromSource(source)}>
              <Icon name="spark" size={16} />
              <span>Generate question bank</span>
            </button>
            <button
              className="wb-button"
              onClick={() => {
                if (window.confirm(`Remove source "${source.title}"?`)) {
                  onRemoveSource(source.id);
                }
              }}
            >
              <Icon name="trash" size={16} />
              <span>Remove source</span>
            </button>
          </div>

          <div className="wb-source-text">
            {lines.map((line, idx) => (
              <p key={idx}>
                <span className="wb-line-no">{idx + 1}</span>
                {line || ' '}
              </p>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
