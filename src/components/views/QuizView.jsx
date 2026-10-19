import React, { useState, useEffect } from 'react';
import Icon from '../Icons';
import { mmss, sound, haptic } from '../../utils/toolkit';
import { checkAnswer } from '../../utils/extractor';

export default function QuizView({
  bank,
  questions,
  instantGrading = true,
  timeLimit = false,
  onBack,
  onFinishQuiz,
  onOpenCitation,
  onRecordMistake
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [checkedStates, setCheckedStates] = useState({});
  const [seconds, setSeconds] = useState(timeLimit ? 600 : 0);

  const curQ = questions[currentIndex];
  const curAnswer = userAnswers[currentIndex];
  const isChecked = !!checkedStates[currentIndex];
  const isCorrect = isChecked && checkAnswer(curQ, curAnswer);

  // Timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (timeLimit) {
          if (prev <= 1) {
            clearInterval(interval);
            onFinishQuiz(userAnswers, 600);
            return 0;
          }
          return prev - 1;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLimit]);

  const handleSelectSingle = (optIdx) => {
    if (isChecked) return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));
  };

  const handleToggleMulti = (optIdx) => {
    if (isChecked) return;
    const existing = Array.isArray(curAnswer) ? [...curAnswer] : [];
    const idx = existing.indexOf(optIdx);
    if (idx !== -1) existing.splice(idx, 1);
    else existing.push(optIdx);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: existing }));
  };

  const handleSelectJudge = (val) => {
    if (isChecked) return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: val }));
  };

  const handleBlankChange = (val) => {
    if (isChecked) return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: val }));
  };

  const handleCheckAnswer = () => {
    if (curAnswer == null) return;
    const correct = checkAnswer(curQ, curAnswer);
    setCheckedStates((prev) => ({ ...prev, [currentIndex]: true }));

    if (correct) {
      sound.ding();
    } else {
      sound.err();
      haptic(16);
      if (onRecordMistake) onRecordMistake(curQ);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishQuiz(userAnswers, timeLimit ? 600 - seconds : seconds);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <>
      <div className="wb-pane-head">
        <div className="wb-breadcrumb">
          <button className="wb-icon" onClick={onBack} aria-label="Back">
            <Icon name="arrow" size={18} />
          </button>
          <span>{instantGrading ? 'Practice mode' : 'Exam mode'}</span>
        </div>
        <div className="wb-head-tools">
          <span className="wb-timer">{mmss(seconds)}</span>
        </div>
      </div>

      <div className="wb-main-content">
        <div className="wb-quiz">
          <div className="wb-quiz-title">
            <span>{bank.name}</span>
            <strong>{currentIndex + 1} / {questions.length}</strong>
          </div>

          <div className="wb-answer-strip">
            {questions.map((q, idx) => {
              const isNow = idx === currentIndex;
              const isDone = userAnswers[idx] != null;
              const isWrong = checkedStates[idx] && !checkAnswer(q, userAnswers[idx]);
              return (
                <button
                  key={idx}
                  className={`bub ${isNow ? 'now' : ''} ${isDone ? 'done' : ''} ${isWrong ? 'wrong' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="wb-progress">
            <i style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>

          <div className="qhead">
            <span className="qno">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="qkind">
              {curQ.k === 'single' ? 'Single choice' :
               curQ.k === 'multi' ? 'Multiple choice' :
               curQ.k === 'judge' ? 'True / false' : 'Fill in'}
            </span>
            {curQ.c && <span className="qchap">{curQ.c}</span>}
          </div>

          <div className="stem">{curQ.s}</div>

          <div className="opts">
            {curQ.k === 'single' && (
              (curQ.o || []).map((opt, optIdx) => {
                const isSelected = curAnswer === optIdx;
                let optClass = 'opt';
                if (isSelected) optClass += ' pick';
                if (isChecked) {
                  if (curQ.a?.includes(optIdx)) optClass += ' right';
                  else if (isSelected) optClass += ' miss';
                }
                return (
                  <button
                    key={optIdx}
                    className={optClass}
                    disabled={isChecked}
                    onClick={() => handleSelectSingle(optIdx)}
                  >
                    <span className="k">{letters[optIdx]}</span>
                    <span>{opt}</span>
                  </button>
                );
              })
            )}

            {curQ.k === 'multi' && (
              (curQ.o || []).map((opt, optIdx) => {
                const isSelected = Array.isArray(curAnswer) && curAnswer.includes(optIdx);
                let optClass = 'opt';
                if (isSelected) optClass += ' pick';
                if (isChecked) {
                  if (curQ.a?.includes(optIdx)) optClass += ' right';
                  else if (isSelected) optClass += ' miss';
                }
                return (
                  <button
                    key={optIdx}
                    className={optClass}
                    disabled={isChecked}
                    onClick={() => handleToggleMulti(optIdx)}
                  >
                    <span className="k">{letters[optIdx]}</span>
                    <span>{opt}</span>
                  </button>
                );
              })
            )}

            {curQ.k === 'judge' && (
              [
                { label: 'True', val: 0 },
                { label: 'False', val: 1 }
              ].map(({ label, val }) => {
                const isSelected = curAnswer === val;
                let optClass = 'opt';
                if (isSelected) optClass += ' pick';
                if (isChecked) {
                  if (curQ.a?.[0] === val) optClass += ' right';
                  else if (isSelected) optClass += ' miss';
                }
                return (
                  <button
                    key={val}
                    className={optClass}
                    disabled={isChecked}
                    onClick={() => handleSelectJudge(val)}
                  >
                    <span className="k">{val === 0 ? 'T' : 'F'}</span>
                    <span>{label}</span>
                  </button>
                );
              })
            )}

            {curQ.k === 'blank' && (
              <input
                type="text"
                className="blank"
                placeholder="Type your answer here..."
                value={curAnswer || ''}
                disabled={isChecked}
                onChange={(e) => handleBlankChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (!isChecked && instantGrading) handleCheckAnswer();
                    else if (isChecked || !instantGrading) handleNext();
                  }
                }}
              />
            )}
          </div>

          {isChecked && (
            <div className={`mark ${isCorrect ? '' : 'bad'}`}>
              <div className="verdict">
                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </div>
              {curQ.e && <div className="why">{curQ.e}</div>}
              {curQ.source && (
                <div style={{ marginTop: '12px' }}>
                  <button
                    type="button"
                    className="wb-citation wb-quiz-citation"
                    onClick={() => onOpenCitation(curQ.source)}
                  >
                    <span>Question source: {curQ.source.title} (Line {curQ.source.index}) ↗</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="wb-quiz-footer">
            <button
              className="wb-button"
              disabled={currentIndex === 0}
              onClick={handlePrev}
            >
              Previous
            </button>

            {instantGrading ? (
              !isChecked ? (
                <button
                  className="wb-primary"
                  disabled={curAnswer == null}
                  onClick={handleCheckAnswer}
                >
                  Check answer
                </button>
              ) : (
                <button className="wb-primary" onClick={handleNext}>
                  {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
                </button>
              )
            ) : (
              <button className="wb-primary" onClick={handleNext}>
                {currentIndex < questions.length - 1 ? 'Next' : 'Submit exam'}
              </button>
            )}
          </div>

          <p className="wb-fine" style={{ textAlign: 'center', marginTop: '16px' }}>
            {instantGrading
              ? 'Practice mode · instant feedback · mistakes saved automatically'
              : 'Exam mode · answers will be graded upon final submission'}
          </p>
        </div>
      </div>
    </>
  );
}
