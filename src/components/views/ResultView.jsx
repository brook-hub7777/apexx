import React from 'react';
import Icon from '../Icons';
import { mmss } from '../../utils/toolkit';

export default function ResultView({
  bankName = "Practice Workbook",
  result,
  wrongQuestions = [],
  onRetryMistakes,
  onPracticeAgain,
  onGenerateReportImage
}) {
  if (!result) return null;

  const { score, right, total, spent, byChap } = result;

  return (
    <>
      <div className="wb-pane-head">
        <div className="wb-breadcrumb">
          <span>Report</span>
        </div>
      </div>

      <div className="wb-main-content">
        <section className="wb-result">
          <div className="report paper">
            <span className="wb-eyebrow">PRACTICE COMPLETED</span>
            <h1>{bankName} · Report</h1>

            <div className="score">
              {score}<small>%</small>
            </div>

            <div className="verdict-line">
              {score >= 80 ? 'Well done! Great mastery of the material.' : 'Keep practicing to reinforce tricky concepts.'}
            </div>

            <div className="tally">
              <div>
                <div className="n">{right} / {total}</div>
                <div className="l">CORRECT</div>
              </div>
              <div>
                <div className="n">{total - right}</div>
                <div className="l">MISTAKES</div>
              </div>
              <div>
                <div className="n">{mmss(spent)}</div>
                <div className="l">TIME SPENT</div>
              </div>
            </div>

            <div className="wb-section-title" style={{ marginTop: '24px' }}>
              <h2>Chapter breakdown</h2>
            </div>
            {Object.entries(byChap || {}).map(([chap, stats]) => {
              const pct = stats.n > 0 ? Math.round((stats.r / stats.n) * 100) : 0;
              return (
                <div key={chap} className="chapline">
                  <span className="nm">{chap}</span>
                  <div className="bar"><i style={{ width: `${pct}%` }} /></div>
                  <span className="pc">{pct}%</span>
                </div>
              );
            })}

            <div className="wb-action-row" style={{ marginTop: '28px', justifyContent: 'center' }}>
              <button
                className="wb-primary"
                disabled={!wrongQuestions.length}
                onClick={onRetryMistakes}
              >
                <Icon name="wrong" size={16} />
                <span>Retry these mistakes ({wrongQuestions.length})</span>
              </button>

              <button className="wb-button" onClick={onPracticeAgain}>
                <Icon name="spark" size={16} />
                <span>Practice whole bank again</span>
              </button>

              <button className="wb-button" onClick={onGenerateReportImage}>
                <Icon name="image" size={16} />
                <span>Share study poster</span>
              </button>

              <button className="wb-button" onClick={() => window.print()}>
                <Icon name="print" size={16} />
                <span>Print / PDF</span>
              </button>
            </div>

            {!wrongQuestions.length && (
              <p className="wb-fine" style={{ textAlign: 'center', marginTop: '16px' }}>
                ✓ Perfect run! There are no mistakes to retry.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
