import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  GitBranch,
  ChevronDown,
  CheckCircle2,
  Zap,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../theme/theme-toggle';
import { Badge } from '../common/Badge';

export const Header: React.FC = () => {
  const { repositories, selectedRepo, setSelectedRepo, setActiveTab, pullRequests } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);

  const openPRCount = pullRequests.filter(p => p.status === 'open').length;

  return (
    <header className="h-[52px] border-b-[3px] border-border-strong bg-card px-3 lg:px-4 flex items-center justify-between sticky top-0 z-20 select-none transition-colors duration-theme gap-3">

      {/* Left: Repo Selector */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative">
          <button
            id="repo-selector-btn"
            onClick={() => { setShowRepoDropdown(!showRepoDropdown); setShowNotifications(false); }}
            className="h-8 flex items-center gap-2 px-3 rounded-[10px] border-2 border-border-strong bg-card hover:bg-secondary text-foreground text-[12px] font-bold shadow-brutal-sm hover:-translate-y-px hover:shadow-brutal transition-all font-display"
          >
            <GitBranch className="w-3.5 h-3.5 text-accent-orange-text shrink-0" />
            <span className="max-w-[120px] lg:max-w-[180px] truncate">{selectedRepo.name}</span>
            <Badge size="sm" variant={selectedRepo.language === 'abap' ? 'warning' : selectedRepo.language === 'typescript' ? 'info' : 'success'}>
              {selectedRepo.language === 'abap' ? 'ABAP' : selectedRepo.language.toUpperCase()}
            </Badge>
            <ChevronDown className="w-3 h-3 text-foreground shrink-0" />
          </button>

          {showRepoDropdown && (
            <>
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowRepoDropdown(false)} />
              <div className="absolute left-0 mt-2 w-80 rounded-[20px] border-[3px] border-border-strong bg-card shadow-brutal-lg p-3 z-50 animate-fade-in-up">
                <div className="text-[10px] font-bold text-foreground uppercase tracking-widest px-2 py-1.5 font-display">
                  Repositories
                </div>
                {repositories.map(repo => (
                  <button
                    key={repo.id}
                    onClick={() => { setSelectedRepo(repo); setShowRepoDropdown(false); }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-[12px] text-left text-[12px] transition-all ${
                      selectedRepo.id === repo.id
                        ? 'bg-foreground text-background font-bold shadow-brutal-sm'
                        : 'text-foreground font-semibold hover:bg-secondary'
                    }`}
                  >
                    <div>
                      <div className="font-bold font-display truncate">{repo.name}</div>
                      <div className="text-[10px] font-mono font-semibold text-muted-foreground">{repo.branch}</div>
                    </div>
                    <Badge size="sm" variant={repo.language === 'abap' ? 'warning' : 'info'}>
                      {repo.language === 'abap' ? 'ABAP' : repo.language.toUpperCase()}
                    </Badge>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* System status — pill */}
        <div className="hidden md:flex items-center gap-1.5 h-8 px-3 rounded-[10px] border-2 border-border-strong bg-accent-green text-accent-green-fg text-[11px] font-semibold shadow-brutal-sm font-display">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green-fg animate-pulse" />
          11/11 Online
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Run Agent Loop */}
        <button
          id="execute-loop-btn"
          onClick={() => setActiveTab('self-healing')}
          className="h-8 flex items-center gap-1.5 px-3.5 rounded-[10px] border-2 border-border-strong bg-brand-yellow text-brand-yellow-foreground font-bold text-[12px] shadow-brutal-sm hover:-translate-y-px hover:shadow-brutal active:translate-y-px transition-all font-display"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Run Loop</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => { setShowNotifications(!showNotifications); setShowRepoDropdown(false); }}
            className="h-8 w-8 flex items-center justify-center rounded-[10px] border-2 border-border-strong bg-card hover:bg-secondary text-foreground shadow-brutal-sm hover:-translate-y-px hover:shadow-brutal transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {openPRCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-red text-accent-red-fg text-[9px] font-bold flex items-center justify-center border border-border-strong">
                {openPRCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-50 bg-transparent" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 rounded-[20px] border-[3px] border-border-strong bg-card shadow-brutal-lg p-4 z-60 animate-fade-in-up">
                <div className="flex items-center justify-between pb-3 border-b-2 border-border mb-3">
                  <span className="text-[13px] font-bold text-foreground font-display">Agent Activity</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-green text-foreground font-bold border border-border-strong">LIVE</span>
                </div>
                {[
                  { icon: CheckCircle2, color: 'bg-accent-green text-foreground', title: 'PR #104 Auto-Opened', sub: 'SQL Injection healed · 94.2% coverage', time: 'Just now' },
                  { icon: CheckCircle2, color: 'bg-accent-orange text-foreground', title: 'Clean Core Fix Applied', sub: 'VBAK → RAP EML migration complete', time: '10 min' },
                ].map((n, i) => {
                  const Icon = n.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                      <div className={`w-7 h-7 rounded-[10px] border-2 border-border-strong flex items-center justify-center shrink-0 ${n.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-foreground font-display">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{n.sub}</p>
                        <span className="text-[10px] text-subtext mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => { setActiveTab('pull-requests'); setShowNotifications(false); }}
                  className="w-full mt-2 text-[11px] font-semibold text-center text-accent-green hover:text-foreground transition-colors font-display"
                >
                  View all PRs →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme */}
        <ThemeToggle />
      </div>
    </header>
  );
};
