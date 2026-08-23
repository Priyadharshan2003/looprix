import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GitPullRequest,
  CheckCircle2,
  ShieldCheck,
  Check,
  Sparkles,
  GitMerge,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PullRequest } from '../../types';
import { Badge } from '../common/Badge';
import { CodeDiffViewer } from '../common/CodeDiffViewer';

export const PullRequestsView: React.FC = () => {
  const { pullRequests, mergePullRequest, setActiveTab } = useApp();
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(pullRequests[0] || null);

  const handleMerge = (id: string) => {
    mergePullRequest(id);
    if (selectedPR?.id === id) {
      setSelectedPR({ ...selectedPR, status: 'merged' });
    }
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 select-none">
      {/* ══ Header ════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-accent-green text-accent-green-fg border-2 border-border-strong text-[11px] font-semibold shadow-brutal-sm mb-2 font-display">
            <GitPullRequest className="w-3.5 h-3.5" />
            Autonomous Pull Request Agent
          </div>
          <h2 className="text-2xl font-bold text-foreground font-display tracking-tight leading-tight">
            Autonomous Pull Requests Hub
          </h2>
          <p className="text-sm text-muted-foreground">
            Production-ready PRs generated, tested, and validated by the Antigravity Self-Correction Loop.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('self-healing')}
          className="nb-btn px-4 py-2.5 bg-brand-yellow text-brand-yellow-foreground text-sm flex items-center gap-2 self-start shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Generate New PR Loop
        </button>
      </div>

      {/* ══ Main Grid: PR List + Inspector ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* PR List */}
        <div className="lg:col-span-5">
          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {pullRequests.map(pr => {
              const isSelected = selectedPR?.id === pr.id;
              const isMerged = pr.status === 'merged';

              return (
                <div
                  key={pr.id}
                  onClick={() => setSelectedPR(pr)}
                  className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'border-border-strong bg-brand-yellow text-brand-yellow-foreground shadow-brutal'
                      : 'border-border bg-card text-foreground hover:border-border-strong hover:shadow-brutal-sm'
                  }`}
                >
                  {/* PR number + language + status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold font-mono">#{pr.number}</span>
                      <Badge
                        size="sm"
                        variant={pr.language === 'abap' ? 'warning' : pr.language === 'typescript' ? 'info' : 'success'}
                      >
                        {pr.language.toUpperCase()}
                      </Badge>
                    </div>
                    <Badge size="sm" variant={isMerged ? 'purple' : 'success'}>
                      {pr.status}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h4 className="text-[13px] font-semibold font-display line-clamp-2 leading-tight">
                    {pr.title}
                  </h4>

                  {/* Repo + time */}
                  <div className={`flex items-center justify-between text-[11px] ${isSelected ? 'text-brand-yellow-foreground/70' : 'text-muted-foreground'}`}>
                    <span className="truncate">{pr.repository}</span>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Clock className="w-3 h-3" />
                      <span>{pr.createdAt}</span>
                    </div>
                  </div>

                  {/* Coverage + healed chips */}
                  <div className={`flex items-center gap-2 pt-2 border-t-2 ${isSelected ? 'border-brand-yellow-foreground/20' : 'border-border'}`}>
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      <TrendingUp className="w-3 h-3 text-accent-green" />
                      <span className={isSelected ? 'text-brand-yellow-foreground' : 'text-accent-green'}>
                        +{pr.coverageReport.afterCoverage - pr.coverageReport.beforeCoverage}% ({pr.coverageReport.afterCoverage}%)
                      </span>
                    </div>
                    <span className={`text-[10px] ${isSelected ? 'text-brand-yellow-foreground/70' : 'text-muted-foreground'}`}>
                      · {pr.securitySummary.resolvedIssues} issues healed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PR Inspector */}
        <div className="lg:col-span-7">
          {selectedPR ? (
            <div className="nb-card-static p-6 space-y-5">
              {/* PR header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b-2 border-border">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[15px] font-bold text-accent-orange font-display">
                      PR #{selectedPR.number}
                    </span>
                    <Badge size="sm" variant={selectedPR.status === 'merged' ? 'purple' : 'success'}>
                      {selectedPR.status}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {selectedPR.branch}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-foreground font-display leading-tight">
                    {selectedPR.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    By {selectedPR.author} · Target: {selectedPR.targetBranch}
                  </p>
                </div>

                {selectedPR.status !== 'merged' ? (
                  <button
                    onClick={() => handleMerge(selectedPR.id)}
                    className="nb-btn px-5 py-2.5 bg-accent-green text-foreground text-sm flex items-center gap-1.5 shrink-0"
                  >
                    <GitMerge className="w-4 h-4" />
                    Approve & Merge PR
                  </button>
                ) : (
                  <div className="px-4 py-2.5 rounded-btn bg-secondary text-accent-green text-[12px] font-semibold border-2 border-border flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Merged to {selectedPR.targetBranch}
                  </div>
                )}
              </div>

              {/* 3 Metric cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: 'Coverage Achieved',
                    value: `${selectedPR.coverageReport.afterCoverage}%`,
                    sub: `Framework: ${selectedPR.coverageReport.framework}`,
                    color: 'text-accent-green',
                    icon: TrendingUp,
                  },
                  {
                    label: 'Issues Remediated',
                    value: `${selectedPR.securitySummary.resolvedIssues} Fixed`,
                    sub: '0 critical remaining',
                    color: 'text-accent-blue',
                    icon: ShieldCheck,
                  },
                  {
                    label: 'Risk Rating',
                    value: selectedPR.riskReport.level,
                    sub: 'Zero breaking changes',
                    color: 'text-accent-orange',
                    icon: CheckCircle2,
                  },
                ].map(metric => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="p-4 rounded-[12px] bg-secondary border-2 border-border space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                        <Icon className={`w-3.5 h-3.5 ${metric.color}`} />
                        {metric.label}
                      </div>
                      <div className={`text-[18px] font-bold font-display ${metric.color}`}>
                        {metric.value}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{metric.sub}</span>
                    </div>
                  );
                })}
              </div>

              {/* PR Description */}
              <div className="p-4 rounded-[12px] bg-secondary border-2 border-border text-[12px]">
                <span className="font-bold text-accent-orange text-[11px] font-display uppercase tracking-wide block mb-2">
                  Autonomous PR Description
                </span>
                <pre className="whitespace-pre-wrap font-mono text-muted-foreground leading-relaxed text-[11px]">
                  {selectedPR.description}
                </pre>
              </div>

              {/* Code Diff */}
              {selectedPR.filesChanged.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[12px] font-bold text-foreground font-display uppercase tracking-wide">
                    Files Changed & Unit Tests ({selectedPR.filesChanged.length})
                  </h4>
                  <CodeDiffViewer
                    filename={selectedPR.filesChanged[0].filename}
                    originalCode={selectedPR.filesChanged[0].originalCode}
                    remediatedCode={selectedPR.filesChanged[0].remediatedCode}
                    generatedTestCode={selectedPR.filesChanged[0].generatedTestCode}
                    language={selectedPR.language}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="nb-card-static h-96 flex items-center justify-center text-center text-muted-foreground">
              <div>
                <GitPullRequest className="w-10 h-10 mx-auto mb-3 text-border" />
                <p className="text-sm font-display">Select a pull request to inspect</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
