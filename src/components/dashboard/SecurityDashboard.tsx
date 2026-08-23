import React, { useState } from 'react';
import {
  ShieldAlert,
  KeyRound,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Search,
  Sparkles,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { FindingSeverity, SecurityFinding } from '../../types';

const severityConfig = {
  critical: { color: 'bg-accent-red', textColor: 'text-accent-red', bgLight: 'bg-accent-red/10', border: 'border-accent-red', label: 'Critical', icon: Flame },
  high:     { color: 'bg-accent-orange', textColor: 'text-accent-orange', bgLight: 'bg-accent-orange/10', border: 'border-accent-orange', label: 'High', icon: AlertTriangle },
  medium:   { color: 'bg-accent-purple', textColor: 'text-accent-purple', bgLight: 'bg-accent-purple/10', border: 'border-accent-purple', label: 'Medium', icon: Shield },
  low:      { color: 'bg-accent-blue', textColor: 'text-accent-blue', bgLight: 'bg-accent-blue/10', border: 'border-accent-blue', label: 'Low', icon: Shield },
  info:     { color: 'bg-accent-cyan', textColor: 'text-accent-cyan', bgLight: 'bg-accent-cyan/10', border: 'border-accent-cyan', label: 'Info', icon: Shield },
};

export const SecurityDashboard: React.FC = () => {
  const { findings, setActiveTab } = useApp();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFinding, setSelectedFinding] = useState<SecurityFinding | null>(findings[0]);

  const filteredFindings = findings.filter(f => {
    const matchesSeverity = selectedSeverity === 'all' || f.severity === selectedSeverity;
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.file.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const highCount     = findings.filter(f => f.severity === 'high').length;
  const secretCount   = findings.filter(f => f.category === 'secret').length;

  const metricCards = [
    { label: 'Critical', value: criticalCount, icon: Flame,         bg: 'bg-accent-red',    text: 'text-accent-red-fg',     sub: 'Priority 0 remediation' },
    { label: 'High',     value: highCount,     icon: AlertTriangle, bg: 'bg-accent-orange', text: 'text-accent-orange-fg', sub: 'OWASP A03 / A07' },
    { label: 'Secrets',  value: secretCount,   icon: KeyRound,      bg: 'bg-accent-purple', text: 'text-accent-purple-fg', sub: 'API keys & credentials' },
    { label: 'Heal Rate',value: '100%',        icon: CheckCircle2,  bg: 'bg-accent-green',  text: 'text-accent-green-fg', sub: 'Self-healing pass rate' },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* ══ Header ════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-accent-red text-accent-red-fg border-2 border-border-strong text-[11px] font-semibold shadow-brutal-sm mb-2 font-display">
            <ShieldAlert className="w-3.5 h-3.5" />
            Security & Secrets Agent
          </div>
          <h2 className="text-2xl font-bold text-foreground font-display tracking-tight leading-tight">
            Security & Vulnerability Intelligence
          </h2>
          <p className="text-sm text-muted-foreground">
            Continuous OWASP Top 10 analysis, hardcoded credential interception, and automated self-healing.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('self-healing')}
          className="nb-btn px-4 py-2.5 bg-brand-yellow text-brand-yellow-foreground text-sm flex items-center gap-2 self-start shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Run Auto Fixer
        </button>
      </div>

      {/* ══ Metric Cards ══════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`nb-card-static p-5 ${card.bg} ${card.text} flex flex-col justify-between gap-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-subtext font-display">{card.label}</span>
                <Icon className="w-5 h-5 text-subtext" />
              </div>
              <div className="text-3xl font-bold font-display tracking-tight">{card.value}</div>
              <div className="text-[10px] font-medium text-subtext">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ══ Main Grid: Findings + Inspector ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Finding List */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search findings, CWE, files…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border-2 border-border rounded-btn text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-strong transition-colors"
              />
            </div>
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              className="px-3 py-2.5 text-sm bg-card border-2 border-border rounded-btn text-foreground font-medium focus:outline-none focus:border-border-strong transition-colors"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical only</option>
              <option value="high">High only</option>
              <option value="medium">Medium only</option>
            </select>
          </div>

          {/* Finding cards */}
          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredFindings.map(finding => {
              const isSelected = selectedFinding?.id === finding.id;
              const cfg = severityConfig[finding.severity as keyof typeof severityConfig] ?? severityConfig.info;
              return (
                <div
                  key={finding.id}
                  onClick={() => setSelectedFinding(finding)}
                  className={`p-4 rounded-[14px] border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-border-strong bg-brand-yellow text-brand-yellow-foreground shadow-brutal-sm'
                      : 'border-border bg-card text-foreground hover:border-border-strong hover:shadow-brutal-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      severity={finding.severity as FindingSeverity}
                      size="sm"
                    >
                      {finding.severity}
                    </Badge>
                    {finding.cwe && (
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">
                        {finding.cwe}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[13px] font-semibold font-display line-clamp-1 mb-1">
                    {finding.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {finding.description}
                  </p>
                  <div className={`mt-2.5 text-[10px] font-mono truncate font-bold ${isSelected ? 'text-brand-yellow-foreground/70' : 'text-accent-blue'}`}>
                    {finding.file}:{finding.line}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Inspector */}
        <div className="lg:col-span-7">
          {selectedFinding ? (
            <div className="nb-card-static p-6 space-y-5">
              {/* Inspector header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b-2 border-border">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge severity={selectedFinding.severity as FindingSeverity} size="md">
                      {selectedFinding.severity}
                    </Badge>
                    {selectedFinding.owaspCategory && (
                      <span className="text-[11px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                        {selectedFinding.owaspCategory}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[16px] font-bold text-foreground font-display">
                    {selectedFinding.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('self-healing')}
                  className="nb-btn px-4 py-2 bg-accent-green text-foreground text-sm flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Execute Self-Heal
                </button>
              </div>

              {/* Description + Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                <div className="p-4 rounded-[12px] bg-secondary border-2 border-border space-y-1.5">
                  <span className="font-bold text-foreground text-[11px] font-display uppercase tracking-wide">
                    Vulnerability Detail
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{selectedFinding.description}</p>
                </div>
                <div className="p-4 rounded-[12px] bg-accent-red/8 border-2 border-accent-red/30 space-y-1.5">
                  <span className="font-bold text-accent-red text-[11px] font-display uppercase tracking-wide">
                    Threat Impact
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{selectedFinding.impact}</p>
                </div>
              </div>

              {/* Code diff */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-foreground font-display uppercase tracking-wide">
                    Code Patch Diff
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {selectedFinding.file}:{selectedFinding.line}
                  </span>
                </div>
                <div className="rounded-[12px] border-2 border-border bg-secondary p-3 font-mono text-[11px] space-y-2 overflow-hidden">
                  <div className="text-accent-red flex items-start gap-2 bg-accent-red/10 p-2.5 rounded-[8px] border-l-4 border-accent-red">
                    <span className="select-none font-bold shrink-0">−</span>
                    <span className="whitespace-pre-wrap">{selectedFinding.vulnerableCode}</span>
                  </div>
                  <div className="text-accent-green flex items-start gap-2 bg-accent-green/10 p-2.5 rounded-[8px] border-l-4 border-accent-green">
                    <span className="select-none font-bold shrink-0">+</span>
                    <span className="whitespace-pre-wrap">{selectedFinding.remediatedCode}</span>
                  </div>
                </div>
              </div>

              {/* Agent reasoning */}
              <div className="p-4 rounded-[12px] bg-secondary border-2 border-border text-[12px]">
                <span className="font-bold text-accent-orange text-[11px] font-display uppercase tracking-wide flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Antigravity Agent Reasoning
                </span>
                <p className="text-muted-foreground leading-relaxed">{selectedFinding.reasoning}</p>
              </div>
            </div>
          ) : (
            <div className="nb-card-static h-96 flex items-center justify-center text-center text-muted-foreground">
              <div>
                <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-border" />
                <p className="text-sm font-display">Select a finding to inspect</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
