import React, { useState, useEffect } from 'react';
import { SAMPLE_SOURCES, SAMPLE_BANKS } from './constants/initialData';
import {
  sound,
  haptic,
  confetti,
  createShareLink,
  parseShareLink,
  renderPosterCanvas
} from './utils/toolkit';
import {
  generateQuestions,
  gradeSession,
  shuffleArray
} from './utils/extractor';

import TopBar from './components/TopBar';
import MobileNav from './components/MobileNav';
import SourcesRail from './components/SourcesRail';
import StudioRail from './components/StudioRail';

import HomeView from './components/views/HomeView';
import BankOverviewView from './components/views/BankOverviewView';
import QuizView from './components/views/QuizView';
import ResultView from './components/views/ResultView';
import FlashcardsView from './components/views/FlashcardsView';
import EditorView from './components/views/EditorView';
import SourceReaderView from './components/views/SourceReaderView';
import MistakeNotebookView from './components/views/MistakeNotebookView';
import StudyNotesView from './components/views/StudyNotesView';
import SourceSearchView from './components/views/SourceSearchView';

import ImportModal from './components/modals/ImportModal';
import GenerateModal from './components/modals/GenerateModal';
import CitationModal from './components/modals/CitationModal';
import ShareModal from './components/modals/ShareModal';
import PosterModal from './components/modals/PosterModal';

export default function App() {
  // 1. Core State
  const [sources, setSources] = useState(() => {
    try {
      const saved = localStorage.getItem('exam-sources');
      return saved ? JSON.parse(saved) : SAMPLE_SOURCES;
    } catch {
      return SAMPLE_SOURCES;
    }
  });

  const [banks, setBanks] = useState(() => {
    try {
      const saved = localStorage.getItem('exam-banks');
      return saved ? JSON.parse(saved) : SAMPLE_BANKS;
    } catch {
      return SAMPLE_BANKS;
    }
  });

  const [activeBankId, setActiveBankId] = useState(() => banks[0]?.id || 'ds');

  const [mistakes, setMistakes] = useState(() => {
    try {
      const saved = localStorage.getItem('exam-wrong');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem('exam-notes') || '';
    } catch {
      return '';
    }
  });

  // UI Navigation & View state
  const [mode, setMode] = useState('home');
  const [activeModal, setActiveModal] = useState('');
  const [mobileTab, setMobileTab] = useState('work');

  // Study Settings
  const [instantGrading, setInstantGrading] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [timeLimit, setTimeLimit] = useState(false);

  // Theme & Sound
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('workbook-theme') === 'dark';
    } catch {
      return false;
    }
  });

  const [soundMuted, setSoundMuted] = useState(() => {
    try {
      return localStorage.getItem('sound-muted') === 'true';
    } catch {
      return false;
    }
  });

  // Modal & Detail Payloads
  const [activeSourceId, setActiveSourceId] = useState(null);
  const [activeCitation, setActiveCitation] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [lastResultWrongQs, setLastResultWrongQs] = useState([]);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState([]);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');

  // Notifications & Storage alerts
  const [toastMessage, setToastMessage] = useState('');
  const [storageError, setStorageError] = useState(false);

  // Active question bank object
  const activeBank = banks.find(b => b.id === activeBankId) || banks[0] || { id: 'ds', name: 'Untitled Bank', qs: [] };

  // Sync theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('workbook-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('workbook-theme', 'light');
    }
  }, [isDark]);

  // Sync sound muted
  useEffect(() => {
    sound.muted = soundMuted;
    localStorage.setItem('sound-muted', String(soundMuted));
  }, [soundMuted]);

  // Sync storage safely
  useEffect(() => {
    try {
      localStorage.setItem('exam-banks', JSON.stringify(banks));
      setStorageError(false);
    } catch (e) {
      setStorageError(true);
    }
  }, [banks]);

  useEffect(() => {
    try {
      localStorage.setItem('exam-wrong', JSON.stringify(mistakes));
    } catch (e) {
      setStorageError(true);
    }
  }, [mistakes]);

  useEffect(() => {
    try {
      localStorage.setItem('exam-notes', notes);
    } catch (e) {
      setStorageError(true);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('exam-sources', JSON.stringify(sources));
    } catch (e) {
      setStorageError(true);
    }
  }, [sources]);

  // Deep-linking hash detection
  useEffect(() => {
    if (window.location.hash) {
      parseShareLink(window.location.hash)
        .then((imported) => {
          if (imported) {
            setBanks((prev) => [imported, ...prev]);
            setActiveBankId(imported.id);
            setMode('questions');
            showToast(`Imported shared question bank: ${imported.name}`);
            window.history.replaceState(null, '', window.location.pathname);
          }
        })
        .catch((err) => {
          console.warn('Share hash parse error', err);
        });
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // --- Handlers ---
  const handleToggleSourceSelect = (id) => {
    setSources((prev) => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const handleSelectAllSources = (val) => {
    setSources((prev) => prev.map(s => ({ ...s, selected: val })));
  };

  const handleOpenSource = (id) => {
    setActiveSourceId(id);
    setMode('source');
    setMobileTab('work');
  };

  const handleRemoveSource = (id) => {
    setSources((prev) => prev.filter(s => s.id !== id));
    setMode('home');
    showToast('Source removed.');
  };

  const handleAddSource = (newSources) => {
    const list = Array.isArray(newSources) ? newSources : [newSources];
    if (!list.length) return;
    setSources((prev) => [...list, ...prev]);
    setActiveSourceId(list[0].id);
    setMode('source');
    showToast(`Added ${list.length} source${list.length > 1 ? 's' : ''}.`);
  };

  // Question Generation
  const handleGenerateQuestions = ({ maxCount, style }) => {
    const selected = sources.filter(s => s.selected);
    const newQs = generateQuestions(selected, maxCount, style, true);
    const firstTitle = selected[0]?.title.replace(/\.[^.]+$/, '') || 'Generated';
    const newBank = {
      id: 'gen-' + Date.now(),
      name: `${firstTitle} · Practice`,
      qs: newQs
    };
    setBanks((prev) => [newBank, ...prev]);
    setActiveBankId(newBank.id);
    setActiveModal('');
    setMode('questions');
    showToast(`Created ${newQs.length} question drafts. Review against sources.`);
  };

  // Quiz initiation
  const startQuizWithQuestions = (qsList, isInstant) => {
    const listToRun = shuffleQuestions ? shuffleArray(qsList) : qsList;
    setActiveQuizQuestions(listToRun);
    setInstantGrading(isInstant);
    setMode('quiz');
    setMobileTab('work');
  };

  const handleStartPractice = () => {
    if (!activeBank?.qs?.length) return;
    startQuizWithQuestions(activeBank.qs, instantGrading);
  };

  const handleFinishQuiz = (userAnswers, spentSeconds) => {
    const result = gradeSession(activeQuizQuestions, userAnswers, spentSeconds);
    const wrongList = activeQuizQuestions.filter((q, idx) => !result.graded[idx]);

    setLastResult(result);
    setLastResultWrongQs(wrongList);
    setMode('result');

    if (result.score >= 80) {
      sound.win();
      confetti();
    }

    if (wrongList.length) {
      setMistakes((prev) => {
        const seenStems = new Set(prev.map(m => m.s));
        const newUniques = wrongList.filter(q => !seenStems.has(q.s));
        return [...newUniques, ...prev];
      });
    }
  };

  const handleRetryMistakes = () => {
    if (!lastResultWrongQs.length) return;
    startQuizWithQuestions(lastResultWrongQs, true);
  };

  const handlePracticeAgain = () => {
    if (!activeBank?.qs?.length) return;
    startQuizWithQuestions(activeBank.qs, instantGrading);
  };

  const handleGenerateReportImage = () => {
    if (!lastResult) return;
    const canvas = renderPosterCanvas({
      bankName: activeBank.name,
      score: lastResult.score,
      right: lastResult.right,
      total: lastResult.total,
      spent: lastResult.spent,
      byChap: lastResult.byChap
    });
    setPosterUrl(canvas.toDataURL('image/png'));
    setActiveModal('poster');
  };

  const handleOpenShare = async () => {
    try {
      const link = await createShareLink(activeBank);
      setShareLink(link);
      setActiveModal('share');
    } catch (e) {
      showToast('Cannot create share link: ' + e.message);
    }
  };

  const handleSaveBank = (updatedBank) => {
    setBanks((prev) => prev.map(b => b.id === updatedBank.id ? updatedBank : b));
  };

  const handleDeleteBank = (bankId) => {
    const remaining = banks.filter(b => b.id !== bankId);
    setBanks(remaining);
    setActiveBankId(remaining[0]?.id || '');
    setMode('home');
    showToast('Question bank deleted.');
  };

  const handleCreateNotebook = () => {
    const name = window.prompt('Enter new notebook title:', 'Untitled Practice Workbook');
    if (name && name.trim()) {
      const newBank = {
        id: 'nb-' + Date.now(),
        name: name.trim(),
        qs: [
          {
            c: 'General',
            k: 'single',
            s: 'Sample question statement',
            o: ['Choice A', 'Choice B', 'Choice C', 'Choice D'],
            a: [0],
            e: 'Explanation'
          }
        ]
      };
      setBanks((prev) => [newBank, ...prev]);
      setActiveBankId(newBank.id);
      setMode('edit');
      showToast('Created new notebook.');
    }
  };

  const handleCopyBank = () => {
    if (!activeBank) return;
    const copy = {
      ...activeBank,
      id: 'copy-' + Date.now(),
      name: `${activeBank.name} (Copy)`
    };
    setBanks((prev) => [copy, ...prev]);
    setActiveBankId(copy.id);
    setMode('questions');
    showToast('Duplicated question bank.');
  };

  const handleExportBankJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeBank, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${activeBank.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleExportMarkdownNotes = () => {
    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(notes);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "study-notes.md");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="wb-app">
      {/* 1. Header */}
      <TopBar
        title="Practice Workbook"
        onCreateNotebook={handleCreateNotebook}
        onCopyBank={handleCopyBank}
        onOpenAnalytics={() => {
          if (lastResult) setMode('result');
          else showToast('Analytics will appear after you complete a practice session.');
        }}
        soundMuted={soundMuted}
        onToggleSound={() => setSoundMuted(!soundMuted)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenShare={handleOpenShare}
        onOpenSettings={() => setMobileTab('studio')}
        disabled={mode === 'quiz'}
      />

      {/* 2. Responsive Mobile Tab Bar */}
      <MobileNav activeTab={mobileTab} onSelectTab={setMobileTab} />

      {/* 3. Storage Error Banner */}
      {storageError && (
        <div className="wb-error-banner" role="alert">
          Browser storage is full or unavailable. Changes are in memory only. Export your bank before closing.
        </div>
      )}

      {/* 4. Three-Column Workspace Layout */}
      <div className="wb-layout">
        {/* Column 1: Sources Rail */}
        <SourcesRail
          sources={sources}
          onToggleSelect={handleToggleSourceSelect}
          onSelectAll={handleSelectAllSources}
          onOpenSource={handleOpenSource}
          onOpenImport={() => setActiveModal('import')}
          disabled={mode === 'quiz'}
          isMobileActive={mobileTab === 'sources'}
        />

        {/* Column 2: Main Canvas */}
        <main className={`wb-pane wb-main ${mobileTab === 'work' ? 'wb-mobile-active' : ''}`} role="main">
          {mode === 'home' && (
            <HomeView
              sourcesCount={sources.filter(s => s.selected).length}
              banks={banks}
              onSelectBank={(id) => {
                setActiveBankId(id);
                setMode('questions');
              }}
              onCreateManually={() => {
                const newBank = {
                  id: 'bank-' + Date.now(),
                  name: 'Custom Question Bank',
                  qs: [
                    {
                      c: 'General',
                      k: 'single',
                      s: 'New question',
                      o: ['Option A', 'Option B', 'Option C', 'Option D'],
                      a: [0],
                      e: ''
                    }
                  ]
                };
                setBanks((prev) => [newBank, ...prev]);
                setActiveBankId(newBank.id);
                setMode('edit');
              }}
              onSearch={(q) => {
                setSearchInitialQuery(q);
                setMode('search');
              }}
              onPromptClick={(prompt) => {
                if (prompt === 'Create a question bank') {
                  setActiveModal('generate');
                } else if (prompt === 'Learn about a new topic') {
                  setActiveModal('import');
                } else {
                  setMode('questions');
                }
              }}
            />
          )}

          {mode === 'questions' && (
            <BankOverviewView
              bank={activeBank}
              onBack={() => setMode('home')}
              onStartPractice={handleStartPractice}
              onEditQuestions={() => setMode('edit')}
              onExportJson={handleExportBankJson}
            />
          )}

          {mode === 'quiz' && (
            <QuizView
              bank={activeBank}
              questions={activeQuizQuestions}
              instantGrading={instantGrading}
              timeLimit={timeLimit}
              onBack={() => setMode('questions')}
              onFinishQuiz={handleFinishQuiz}
              onOpenCitation={(source) => {
                setActiveCitation(source);
                setActiveModal('citation');
              }}
              onRecordMistake={(q) => {
                setMistakes((prev) => {
                  if (prev.some(m => m.s === q.s)) return prev;
                  return [q, ...prev];
                });
              }}
            />
          )}

          {mode === 'result' && (
            <ResultView
              bankName={activeBank.name}
              result={lastResult}
              wrongQuestions={lastResultWrongQs}
              onRetryMistakes={handleRetryMistakes}
              onPracticeAgain={handlePracticeAgain}
              onGenerateReportImage={handleGenerateReportImage}
            />
          )}

          {mode === 'cards' && (
            <FlashcardsView
              bank={activeBank}
              onBack={() => setMode('questions')}
            />
          )}

          {mode === 'edit' && (
            <EditorView
              bank={activeBank}
              onSaveBank={handleSaveBank}
              onDeleteBank={handleDeleteBank}
              onDoneEditing={() => setMode('questions')}
              canDelete={banks.length > 1}
            />
          )}

          {mode === 'source' && (
            <SourceReaderView
              source={sources.find(s => s.id === activeSourceId) || sources[0]}
              onBack={() => setMode('home')}
              onGenerateFromSource={(src) => {
                setSources(prev => prev.map(s => s.id === src.id ? { ...s, selected: true } : s));
                setActiveModal('generate');
              }}
              onRemoveSource={handleRemoveSource}
            />
          )}

          {mode === 'wrong' && (
            <MistakeNotebookView
              mistakes={mistakes}
              onBack={() => setMode('home')}
              onReviewMistakes={() => {
                if (mistakes.length) startQuizWithQuestions(mistakes, true);
              }}
              onClearMistakes={() => {
                setMistakes([]);
                showToast('Mistake notebook cleared.');
              }}
            />
          )}

          {mode === 'note' && (
            <StudyNotesView
              notes={notes}
              onChangeNotes={setNotes}
              onBack={() => setMode('home')}
              onExportMarkdown={handleExportMarkdownNotes}
            />
          )}

          {mode === 'search' && (
            <SourceSearchView
              sources={sources}
              initialQuery={searchInitialQuery}
              onBack={() => setMode('home')}
              onOpenCitation={(hit) => {
                setActiveCitation(hit);
                setActiveModal('citation');
              }}
            />
          )}
        </main>

        {/* Column 3: Studio Rail */}
        <StudioRail
          banks={banks}
          activeBankId={activeBankId}
          onSelectBank={(id) => {
            setActiveBankId(id);
          }}
          instantGrading={instantGrading}
          onToggleInstantGrading={setInstantGrading}
          shuffleQuestions={shuffleQuestions}
          onToggleShuffle={setShuffleQuestions}
          timeLimit={timeLimit}
          onToggleTimeLimit={setTimeLimit}
          wrongCount={mistakes.length}
          onOpenQuiz={() => setActiveModal('generate')}
          onOpenFlashcards={() => {
            setMode('cards');
            setMobileTab('work');
          }}
          onOpenPractice={() => {
            setInstantGrading(true);
            setMode('questions');
            setMobileTab('work');
            showToast('Practice mode selected');
          }}
          onOpenMockExam={() => {
            setInstantGrading(false);
            setMode('questions');
            setMobileTab('work');
            showToast('Exam mode selected. Click Start practice.');
          }}
          onOpenReports={() => {
            if (lastResult) {
              setMode('result');
              setMobileTab('work');
            } else {
              showToast('Complete a practice session to see a report here.');
            }
          }}
          onOpenSearch={() => {
            setMode('search');
            setMobileTab('work');
          }}
          onOpenMistakes={() => {
            setMode('wrong');
            setMobileTab('work');
          }}
          onOpenNotes={() => {
            setMode('note');
            setMobileTab('work');
          }}
          disabled={mode === 'quiz'}
          isMobileActive={mobileTab === 'studio'}
        />
      </div>

      {/* 5. Modals */}
      {activeModal === 'import' && (
        <ImportModal
          onAdd={handleAddSource}
          onClose={() => setActiveModal('')}
        />
      )}

      {activeModal === 'generate' && (
        <GenerateModal
          sources={sources}
          onGenerate={handleGenerateQuestions}
          onClose={() => setActiveModal('')}
        />
      )}

      {activeModal === 'citation' && (
        <CitationModal
          citation={activeCitation}
          onClose={() => setActiveModal('')}
        />
      )}

      {activeModal === 'share' && (
        <ShareModal
          link={shareLink}
          onClose={() => setActiveModal('')}
          onToast={showToast}
        />
      )}

      {activeModal === 'poster' && (
        <PosterModal
          posterUrl={posterUrl}
          onClose={() => setActiveModal('')}
        />
      )}

      {/* 6. Toast Notification */}
      {toastMessage && (
        <div className="wb-toast">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
