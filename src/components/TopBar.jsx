import React from 'react';
import Icon from './Icons';

export default function TopBar({
  title = "Practice Workbook",
  onCreateNotebook,
  onCopyBank,
  onOpenAnalytics,
  soundMuted,
  onToggleSound,
  isDark,
  onToggleTheme,
  onOpenShare,
  onOpenSettings,
  disabled = false
}) {
  return (
    <header className="wb-top">
      <button className="wb-brand" disabled={disabled} onClick={onCreateNotebook}>
        <span className="wb-brand-mark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 3h12a3 3 0 0 1 3 3v15H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3M3 17h16M8 3v10l3-2 3 2V3" />
          </svg>
        </span>
        <strong>{title}</strong>
        <span className="wb-brand-sub">Local study space</span>
      </button>

      <div className="wb-top-end">
        <div className="wb-top-actions">
          <button className="wb-primary wb-create" disabled={disabled} onClick={onCreateNotebook}>
            <Icon name="plus" size={17} />
            <span>Create notebook</span>
          </button>

          <button className="wb-button wb-top-action" disabled={disabled} onClick={onCopyBank}>
            <Icon name="copy" size={17} />
            <span>Copy</span>
          </button>

          <button className="wb-button wb-top-action" disabled={disabled} onClick={onOpenAnalytics}>
            <Icon name="chart" size={17} />
            <span>Analytics</span>
          </button>
        </div>

        <span className="wb-local">
          <span />
          <span>Saved on this device</span>
        </span>

        <button
          className="wb-icon"
          aria-label={soundMuted ? "Enable sound" : "Mute sound"}
          aria-pressed={soundMuted}
          onClick={onToggleSound}
        >
          <Icon name={soundMuted ? "mute" : "sound"} size={20} />
        </button>

        <button
          className="wb-icon wb-theme-toggle"
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          aria-pressed={isDark}
          title={isDark ? "Dark · warm ink" : "Light · signal yellow"}
          onClick={onToggleTheme}
        >
          <Icon name={isDark ? "sun" : "moon"} size={20} />
          <span>{isDark ? "Light" : "Dark"}</span>
        </button>

        <button className="wb-button wb-share" disabled={disabled} onClick={onOpenShare}>
          <Icon name="share" size={20} />
          <span>Share</span>
        </button>

        <button className="wb-button wb-settings-button" disabled={disabled} onClick={onOpenSettings}>
          <Icon name="tune" size={20} />
          <span>Settings</span>
        </button>

        <span className="wb-avatar" aria-hidden="true">W</span>
      </div>
    </header>
  );
}
