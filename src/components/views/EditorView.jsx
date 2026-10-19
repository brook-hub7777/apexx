import React, { useState } from 'react';
import Icon from '../Icons';

export default function EditorView({
  bank,
  onSaveBank,
  onDeleteBank,
  onDoneEditing,
  canDelete = true
}) {
  const [name, setName] = useState(bank.name);
  const [questions, setQuestions] = useState([...bank.qs]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const curQ = questions[selectedIndex] || {
    c: 'General',
    k: 'single',
    s: 'New question',
    o: ['Option A', 'Option B', 'Option C', 'Option D'],
    a: [0],
    e: ''
  };

  const handleUpdateCurQ = (updates) => {
    const updated = questions.map((q, idx) => idx === selectedIndex ? { ...q, ...updates } : q);
    setQuestions(updated);
    onSaveBank({ ...bank, name, qs: updated });
  };

  const handleNameChange = (val) => {
    setName(val);
    onSaveBank({ ...bank, name: val, qs: questions });
  };

  const handleMove = (idx, delta) => {
    const target = idx + delta;
    if (target < 0 || target >= questions.length) return;
    const reordered = [...questions];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    setQuestions(reordered);
    setSelectedIndex(target);
    onSaveBank({ ...bank, name, qs: reordered });
  };

  const handleDeleteQ = (idx) => {
    if (questions.length <= 1) return;
    const filtered = questions.filter((_, i) => i !== idx);
    setQuestions(filtered);
    setSelectedIndex(Math.max(0, Math.min(selectedIndex, filtered.length - 1)));
    onSaveBank({ ...bank, name, qs: filtered });
  };

  const handleAddQ = () => {
    const newQ = {
      c: curQ.c || 'General',
      k: 'single',
      s: 'New question statement',
      o: ['Choice A', 'Choice B', 'Choice C', 'Choice D'],
      a: [0],
      e: ''
    };
    const nextList = [...questions, newQ];
    setQuestions(nextList);
    setSelectedIndex(nextList.length - 1);
    onSaveBank({ ...bank, name, qs: nextList });
  };

  return (
    <>
      <div className="wb-pane-head">
        <div className="wb-breadcrumb">
          <button className="wb-icon" onClick={onDoneEditing} aria-label="Done editing">
            <Icon name="arrow" size={18} />
          </button>
          <span>Edit question bank</span>
        </div>
      </div>

      <div className="wb-main-content">
        <section className="wb-editor">
          <div className="wb-field">
            <label>Question bank title</label>
            <input
              type="text"
              maxLength={160}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="wb-edit-layout">
            {/* Left Column: Reorderable List */}
            <div className="wb-edit-list">
              <div className="wb-edit-list-items">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className={`wb-edit-item ${idx === selectedIndex ? 'is-active' : ''}`}
                onClick={() => setSelectedIndex(idx)}
              >
                <span className="wb-edit-item-num">{idx + 1}</span>
                <span className="wb-edit-item-stem">{q.s || '(Untitled)'}</span>
                <div className="wb-edit-item-actions">
                  <button
                    className="wb-icon-btn"
                    disabled={idx === 0}
                    onClick={(e) => { e.stopPropagation(); handleMove(idx, -1); }}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    className="wb-icon-btn"
                    disabled={idx === questions.length - 1}
                    onClick={(e) => { e.stopPropagation(); handleMove(idx, 1); }}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    className="wb-icon-btn is-delete"
                    disabled={questions.length <= 1}
                    onClick={(e) => { e.stopPropagation(); handleDeleteQ(idx); }}
                    title="Delete question"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="wb-button wb-add-q-btn" onClick={handleAddQ}>
            <Icon name="plus" size={14} />
            <span>Add question</span>
          </button>
        </div>

        {/* Right Column: Question Form Editor */}
        <div className="wb-edit-form">
          <div className="wb-form-row">
            <label className="wb-field">
              <span>Chapter / Category</span>
              <input
                type="text"
                value={curQ.c || ''}
                onChange={(e) => handleUpdateCurQ({ c: e.target.value })}
              />
            </label>

            <label className="wb-field">
              <span>Question type</span>
              <select
                value={curQ.k}
                onChange={(e) => {
                  const newK = e.target.value;
                  const newOpts = newK === 'single' || newK === 'multi' ? (curQ.o?.length ? curQ.o : ['Option A', 'Option B']) : [];
                  const newA = newK === 'multi' ? [0] : (newK === 'blank' ? [''] : [0]);
                  handleUpdateCurQ({ k: newK, o: newOpts, a: newA });
                }}
              >
                <option value="single">Single choice</option>
                <option value="multi">Multiple choice</option>
                <option value="judge">True / false</option>
                <option value="blank">Fill in</option>
              </select>
            </label>
          </div>

          <label className="wb-field">
            <span>Question stem</span>
            <textarea
              rows={3}
              value={curQ.s || ''}
              onChange={(e) => handleUpdateCurQ({ s: e.target.value })}
            />
          </label>

          {(curQ.k === 'single' || curQ.k === 'multi') && (
            <div className="wb-options-editor">
              <label>Options & Correct Answer(s)</label>
              {(curQ.o || []).map((opt, optIdx) => {
                const isCorrect = curQ.k === 'multi' ? curQ.a?.includes(optIdx) : curQ.a?.[0] === optIdx;
                return (
                  <div key={optIdx} className="wb-opt-edit-row">
                    <input
                      type={curQ.k === 'multi' ? 'checkbox' : 'radio'}
                      name="correct-opt"
                      checked={!!isCorrect}
                      onChange={() => {
                        if (curQ.k === 'multi') {
                          const nextA = isCorrect ? curQ.a.filter(i => i !== optIdx) : [...(curQ.a || []), optIdx];
                          handleUpdateCurQ({ a: nextA });
                        } else {
                          handleUpdateCurQ({ a: [optIdx] });
                        }
                      }}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...curQ.o];
                        newOpts[optIdx] = e.target.value;
                        handleUpdateCurQ({ o: newOpts });
                      }}
                    />
                    <button
                      className="wb-icon-btn"
                      disabled={curQ.o.length <= 2}
                      onClick={() => {
                        const newOpts = curQ.o.filter((_, i) => i !== optIdx);
                        handleUpdateCurQ({ o: newOpts, a: [0] });
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
              <button
                className="wb-pill-button"
                onClick={() => handleUpdateCurQ({ o: [...(curQ.o || []), `Option ${String.fromCharCode(65 + curQ.o.length)}`] })}
              >
                + Add option
              </button>
            </div>
          )}

          {curQ.k === 'judge' && (
            <div className="wb-field">
              <span>Correct Answer</span>
              <div className="wb-judge-select">
                <label>
                  <input
                    type="radio"
                    name="judge-ans"
                    checked={curQ.a?.[0] === 0}
                    onChange={() => handleUpdateCurQ({ a: [0] })}
                  />
                  <span>True</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="judge-ans"
                    checked={curQ.a?.[0] === 1}
                    onChange={() => handleUpdateCurQ({ a: [1] })}
                  />
                  <span>False</span>
                </label>
              </div>
            </div>
          )}

          {curQ.k === 'blank' && (
            <label className="wb-field">
              <span>Expected Answer (Case-insensitive)</span>
              <input
                type="text"
                value={Array.isArray(curQ.a) ? curQ.a[0] || '' : curQ.a || ''}
                onChange={(e) => handleUpdateCurQ({ a: [e.target.value] })}
              />
            </label>
          )}

          <label className="wb-field">
            <span>Explanation</span>
            <textarea
              rows={3}
              value={curQ.e || ''}
              onChange={(e) => handleUpdateCurQ({ e: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div className="wb-action-row wb-editor-actions">
        <button className="wb-primary" onClick={onDoneEditing}>
          Done editing
        </button>
        <button
          className="wb-button is-danger"
          disabled={!canDelete}
          onClick={() => {
            if (window.confirm("Delete this entire question bank? Sources and mistake records will remain.")) {
              onDeleteBank(bank.id);
            }
          }}
        >
          Delete bank
        </button>
      </div>

          <p className="wb-fine">
            Edits auto-save to browser memory. At least one bank must remain.
          </p>
        </section>
      </div>
    </>
  );
}
