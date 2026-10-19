import React from 'react';

export default function MobileNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'sources', label: 'Sources' },
    { id: 'work', label: 'Study' },
    { id: 'studio', label: 'Studio' }
  ];

  return (
    <nav className="wb-mobile-nav" aria-label="Workspace navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`wb-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          onClick={() => onSelectTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
