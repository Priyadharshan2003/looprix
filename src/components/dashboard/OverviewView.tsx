import React from 'react';
import {
  Zap,
  Sparkles,
  GitPullRequest,
  ShieldAlert,
  Activity,
  TrendingUp,
  ArrowRight,
  FolderGit2,
  Circle,
  CheckCircle2,
  Clock,
  Cpu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { CleanCoreGauge } from '../common/CleanCoreGauge';

/* ─── Tiny sparkline: 8-point mini bar chart ─────────────── */
const MiniSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[2px] h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Coverage bar (before → after) ─────────────────────── */
const CoverageDelta: React.FC<{ before: number; after: number }> = ({ before, after }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px]">
      <span className="text-muted-foreground">{before}%</span>
      <span className="font-semibold text-accent-green">{after}%</span>
    </div>
    <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/30" style={{ width: `${before}%` }} />
      <div className="absolute inset-y-0 left-0 rounded-full bg-accent-green transition-all" style={{ width: `${after}%` }} />
    </div>
  </div>
);

/* ─── Severity bar row ───────────────────────────────────── */
const SevBar: React.FC<{ label: string; count: number; total: number; color: string; textColor: string }> = ({
  label, count, total, color, textColor,
}) => (
  <div className="flex items-center gap-3">
    <span className="text-[11px] text-muted-foreground w-14 shrink-0">{label}</span>
    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
      />
    </div>
    <span className={`text-[11px] font-bold w-4 text-right ${textColor}`}>{count}</span>
  </div>
);

export const OverviewView: React.FC = () => {
  const { stats, repositories, pullRequests, findings, setActiveTab, setSelectedRepo } = useApp();

  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const highCount     = findings.filter(f => f.severity === 'high').length;
  const mediumCount   = findings.filter(f => f.severity === 'medium').length;
  const lowCount      = findings.filter(f => f.severity === 'low').length;
  const totalFindings = criticalCount + highCount + mediumCount + lowCount;

  const sparklineData = [24, 31, 28, 38, 35, 42, 47, stats.issuesFixedCount];

  return (
    <div className="grid grid-cols-12 gap-4">

      {/* ══════════════════════════════════════════════════════
          MASTHEAD HERO — Full width mission control card
          ══════════════════════════════════════════════════ */}
      <div className="col-span-12">
        <div
          className="relative overflow-hidden rounded-[24px] border-[3px] border-hero-border bg-hero-bg text-hero-fg shadow-brutal-lg"
          style={{
            background: `
              radial-gradient(circle at top left, rgba(122,174,255,.25), transparent 30%),
              radial-gradient(circle at right, rgba(124,217,146,.15), transparent 30%),
              linear-gradient(135deg, #1C2433, #243146, #2D415B)
            `,
          }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

              {/* Left: eyebrow + headline */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-accent-green/15 border border-accent-green/40 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-accent-green text-[11px] font-semibold tracking-wide">
                      All {stats.activeAgentsCount} Agents Running
                    </span>
                  </div>
                  <span className="text-hero-muted text-[11px] hidden sm:block">· Last scan 2 min ago</span>
                </div>

                <div>
                  <h1 className="text-[26px] lg:text-[32px] font-bold font-display leading-[1.1] tracking-tight text-hero-fg">
                    Mission Control
                  </h1>
                  <p className="text-hero-muted text-[13px] mt-1.5 max-w-sm leading-relaxed">
                    Autonomous agents continuously review, secure, and self-heal your enterprise codebases.
                  </p>
                </div>
              </div>

              {/* Center: 3 inline hero metrics */}
              <div className="flex items-center gap-8 lg:gap-12 shrink-0">
                {[
                  { value: stats.issuesFixedCount, label: 'Issues Healed', color: 'text-accent-green' },
                  { value: `${stats.autoResolvedRate}%`, label: 'Auto-Resolved', color: 'text-brand-yellow' },
                  { value: stats.prsGeneratedCount,  label: 'PRs Created',   color: 'text-accent-blue' },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div className={`text-[32px] font-bold font-display leading-none ${m.color}`}>{m.value}</div>
                    <div className="text-hero-muted text-[11px] mt-1.5 font-medium">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Right: CTA */}
              <button
                onClick={() => setActiveTab('self-healing')}
                className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-[14px] bg-brand-yellow text-brand-yellow-foreground font-bold text-[13px] border-2 border-border-strong shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all font-display self-start lg:self-auto"
              >
                <Zap className="w-4 h-4 fill-current" />
                Execute Self-Heal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          KPI STRIP — 5 metric cards with mini sparklines
          ══════════════════════════════════════════════════ */}

      {/* Heal Rate — wide card with sparkline */}
      <div
        className="col-span-12 sm:col-span-6 lg:col-span-3 stat-card bg-card p-5 flex flex-col justify-between gap-4 cursor-pointer"
        onClick={() => setActiveTab('self-healing')}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-foreground uppercase tracking-widest font-display">Heal Rate</p>
            <div className="text-[36px] font-bold font-display text-foreground leading-none mt-2">
              {stats.autoResolvedRate}
              <span className="text-lg text-foreground font-bold">%</span>
            </div>
          </div>
          <Activity className="w-5 h-5 text-accent-green mt-1" />
        </div>
        <div className="space-y-2">
          <MiniSparkline data={[55, 62, 68, 71, 68, 74, 74, stats.autoResolvedRate]} color="var(--color-green)" />
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent-green rounded-full" style={{ width: `${stats.autoResolvedRate}%` }} />
          </div>
          <p className="text-[10px] font-bold text-accent-green-text">↑ 8.2% improvement vs last week</p>
        </div>
      </div>

      {/* Issues Fixed */}
      <div
        className="col-span-6 sm:col-span-3 lg:col-span-2 stat-card bg-card p-5 cursor-pointer"
        onClick={() => setActiveTab('security')}
      >
        <p className="text-[11px] font-bold text-foreground uppercase tracking-widest font-display">Issues Fixed</p>
        <div className="text-[36px] font-bold font-display text-foreground mt-2 leading-none">{stats.issuesFixedCount}</div>
        <div className="mt-3">
          <MiniSparkline data={sparklineData} color="var(--color-orange)" />
        </div>
        <p className="text-[10px] text-accent-orange-text mt-1.5 font-bold">↑ 12 this week</p>
      </div>

      {/* Active Agents */}
      <div className="col-span-6 sm:col-span-3 lg:col-span-2 stat-card bg-card p-5">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-bold text-foreground uppercase tracking-widest font-display">Agents</p>
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse mt-1" />
        </div>
        <div className="text-[36px] font-bold font-display text-foreground mt-2 leading-none">
          {stats.activeAgentsCount}
          <span className="text-lg text-foreground font-bold">/11</span>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full ${i < stats.activeAgentsCount ? 'bg-accent-green' : 'bg-muted'}`}
            />
          ))}
        </div>
        <p className="text-[10px] text-accent-green-text font-bold mt-1.5">100% uptime</p>
      </div>

      {/* PRs Created */}
      <div
        className="col-span-6 sm:col-span-3 lg:col-span-2 stat-card bg-card p-5 cursor-pointer"
        onClick={() => setActiveTab('pull-requests')}
      >
        <p className="text-[11px] font-bold text-foreground uppercase tracking-widest font-display">Auto PRs</p>
        <div className="text-[36px] font-bold font-display text-foreground mt-2 leading-none">{stats.prsGeneratedCount}</div>
        <div className="mt-3 flex items-end gap-1 h-8">
          {[1, 2, 2, 3, 2, 4, 3, stats.prsGeneratedCount].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-accent-blue"
              style={{ height: `${(v / stats.prsGeneratedCount) * 100}%`, opacity: 0.3 + i * 0.09 }}
            />
          ))}
        </div>
        <p className="text-[10px] text-accent-blue-text font-bold mt-1.5">All tested & gated</p>
      </div>

      {/* Repositories */}
      <div
        className="col-span-6 sm:col-span-3 lg:col-span-3 stat-card bg-card p-5 cursor-pointer"
        onClick={() => setActiveTab('repositories')}
      >
        <p className="text-[11px] font-bold text-foreground uppercase tracking-widest font-display">Repositories</p>
        <div className="text-[36px] font-bold font-display text-foreground mt-2 leading-none">{stats.totalRepos}</div>
        <div className="mt-3 space-y-1.5">
          {repositories.slice(0, 3).map(r => (
            <div key={r.id} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${r.healthScore > 80 ? 'bg-accent-green' : 'bg-accent-orange'}`} />
              <span className="text-[11px] text-foreground font-bold truncate flex-1">{r.name.split('/')[1] || r.name}</span>
              <span className="text-[11px] font-bold text-foreground">{r.coverage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BENTO ROW 1: Repo Health (5) + Security Radar (4) + Clean Core (3)
          ══════════════════════════════════════════════════ */}

      {/* Repository Health — nested widget group */}
      <div className="col-span-12 lg:col-span-5 nb-card-static p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-accent-orange" />
            <h3 className="text-[13px] font-bold text-foreground font-display">Repository Health</h3>
          </div>
          <button
            onClick={() => setActiveTab('repositories')}
            className="text-[11px] font-bold text-foreground hover:text-accent-orange-text transition-colors font-display flex items-center gap-1"
          >
            + Connect <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 space-y-3">
          {repositories.map(repo => (
            <div
              key={repo.id}
              onClick={() => { setSelectedRepo(repo); setActiveTab('self-healing'); }}
              className="group p-3.5 rounded-[14px] bg-secondary border-2 border-border hover:border-border-strong hover:shadow-brutal-sm transition-all cursor-pointer"
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${repo.healthScore > 80 ? 'bg-accent-green' : 'bg-accent-orange'}`} />
                  <span className="text-[13px] font-semibold font-display text-foreground truncate">
                    {repo.name.split('/')[1] || repo.name}
                  </span>
                  <Badge size="sm" variant={repo.language === 'abap' ? 'warning' : repo.language === 'typescript' ? 'info' : 'success'}>
                    {repo.language === 'abap' ? 'ABAP' : repo.language === 'typescript' ? 'TS' : 'PY'}
                  </Badge>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-[15px] font-bold font-display text-accent-green-text">{repo.coverage}%</span>
                </div>
              </div>

              {/* Coverage bar */}
              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-accent-green rounded-full transition-all"
                    style={{ width: `${repo.coverage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-foreground font-semibold">
                  <span className="font-mono">{repo.branch} · {repo.lastScanned}</span>
                  <span>{repo.prsOpen} open PR{repo.prsOpen !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Bottom: score dots */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-foreground">Health</span>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i < Math.round(repo.healthScore / 10) ? 'bg-accent-green' : 'bg-muted'
                    }`}
                  />
                ))}
                <span className="text-[10px] font-bold text-foreground ml-auto">{repo.healthScore}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Radar — severity bars */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-4 nb-card-static p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-accent-red" />
            <h3 className="text-[13px] font-bold text-foreground font-display">Security Radar</h3>
          </div>
          <button
            onClick={() => setActiveTab('security')}
            className="text-[11px] font-bold text-foreground hover:text-accent-blue-text transition-colors font-display"
          >
            Inspect →
          </button>
        </div>

        {/* Total findings hero number */}
        <div className="mb-5 p-4 rounded-[14px] bg-secondary border-2 border-border flex items-center justify-between">
          <div>
            <div className="text-[32px] font-bold font-display text-foreground leading-none">{totalFindings}</div>
            <div className="text-[11px] font-bold text-foreground mt-1">Total findings</div>
          </div>
          <div className="text-right">
            <div className="text-[14px] font-bold text-accent-green-text font-display">100%</div>
            <div className="text-[10px] font-bold text-foreground">Auto-healed</div>
          </div>
        </div>

        {/* Severity bars */}
        <div className="flex-1 space-y-3">
          <SevBar label="Critical" count={criticalCount} total={totalFindings} color="bg-accent-red"    textColor="text-accent-red-text"    />
          <SevBar label="High"     count={highCount}     total={totalFindings} color="bg-accent-orange" textColor="text-accent-orange-text" />
          <SevBar label="Medium"   count={mediumCount}   total={totalFindings} color="bg-accent-purple" textColor="text-accent-purple-text" />
          <SevBar label="Low"      count={lowCount}      total={totalFindings} color="bg-accent-blue"   textColor="text-accent-blue-text"   />
        </div>

        {/* Agent status strip */}
        <div className="mt-4 pt-3 border-t-2 border-border grid grid-cols-3 gap-2">
          {[
            { label: 'OWASP', value: 'A03 ✓', color: 'text-accent-green-text' },
            { label: 'Secrets', value: '0 live', color: 'text-accent-green-text' },
            { label: 'Risk', value: 'Low', color: 'text-accent-blue-text' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`text-[11px] font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] font-bold text-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Core Gauge */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 nb-card-static p-5 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-foreground font-display">SAP Clean Core</h3>
          <button
            onClick={() => setActiveTab('compliance')}
            className="text-[11px] font-bold text-foreground hover:text-accent-orange-text transition-colors font-display"
          >
            Details →
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <CleanCoreGauge score={stats.avgCleanCoreScore} size="lg" showTier />
        </div>

        <div className="mt-3 space-y-2 pt-3 border-t-2 border-border text-[11px]">
          {[
            { label: 'RAP / EML Adoption',   value: '88%',       color: 'text-accent-green-text' },
            { label: 'Released CDS Views',    value: '96%',       color: 'text-accent-cyan-text'  },
            { label: 'Direct Table Writes',   value: '0 found',   color: 'text-foreground'   },
          ].map(r => (
            <div key={r.label} className="flex justify-between">
              <span className="font-semibold text-foreground">{r.label}</span>
              <span className={`font-bold ${r.color}`}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BENTO ROW 2: PR Activity Feed (8) + Agent Timeline (4)
          ══════════════════════════════════════════════════ */}

      {/* PR Activity Feed — 3 cards side-by-side */}
      <div className="col-span-12 lg:col-span-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-accent-green" />
            <h3 className="text-[13px] font-bold text-foreground font-display">Autonomous Pull Requests</h3>
          </div>
          <button
            onClick={() => setActiveTab('pull-requests')}
            className="text-[11px] font-bold text-foreground hover:text-accent-green-text transition-colors font-display"
          >
            View all ({pullRequests.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pullRequests.slice(0, 3).map(pr => (
            <div
              key={pr.id}
              onClick={() => setActiveTab('pull-requests')}
              className="nb-card p-4 cursor-pointer flex flex-col justify-between gap-3"
            >
              {/* Top */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[11px] font-bold text-accent-orange-text font-mono">#{pr.number}</span>
                  <Badge size="sm" variant={pr.language === 'abap' ? 'warning' : pr.language === 'typescript' ? 'info' : 'success'}>
                    {pr.language === 'abap' ? 'ABAP' : pr.language === 'typescript' ? 'TS' : 'PY'}
                  </Badge>
                  <Badge size="sm" variant={pr.status === 'merged' ? 'purple' : 'success'}>
                    {pr.status}
                  </Badge>
                </div>
                <h4 className="text-[12px] font-semibold text-foreground font-display line-clamp-2 leading-tight">
                  {pr.title}
                </h4>
                <p className="text-[10px] text-foreground font-mono font-semibold mt-1 truncate">
                  {pr.repository.split('/')[1] || pr.repository}
                </p>
              </div>

              {/* Coverage delta bar */}
              <CoverageDelta before={pr.coverageReport.beforeCoverage} after={pr.coverageReport.afterCoverage} />

              {/* Bottom chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-green/15 text-accent-green-text border border-accent-green/40">
                  +{pr.coverageReport.afterCoverage - pr.coverageReport.beforeCoverage}% cov
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-blue/15 text-accent-blue-text border border-accent-blue/40">
                  {pr.securitySummary.resolvedIssues} fixed
                </span>
                <span className="text-[10px] font-semibold text-foreground ml-auto flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {pr.createdAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Activity Timeline */}
      <div className="col-span-12 lg:col-span-4 nb-card-static p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent-purple" />
            <h3 className="text-[13px] font-bold text-foreground font-display">Agent Activity</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent-green">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            Live
          </div>
        </div>

        {/* Live activity items */}
        <div className="flex-1 space-y-3 overflow-hidden">
          {[
            {
              agent: 'Security Agent',
              action: 'CWE-89 SQL Injection detected',
              time: 'Just now',
              color: 'bg-accent-red',
              textColor: 'text-accent-red',
            },
            {
              agent: 'Clean Core Agent',
              action: 'Direct table mutation flagged (VBAK)',
              time: '1 min',
              color: 'bg-accent-orange',
              textColor: 'text-accent-orange',
            },
            {
              agent: 'Self-Healing Agent',
              action: 'RAP EML patch synthesized',
              time: '2 min',
              color: 'bg-accent-green',
              textColor: 'text-accent-green',
            },
            {
              agent: 'Test Agent',
              action: '94.2% coverage achieved',
              time: '3 min',
              color: 'bg-accent-blue',
              textColor: 'text-accent-blue',
            },
            {
              agent: 'PR Agent',
              action: 'PR #103 opened & validated',
              time: '4 min',
              color: 'bg-accent-purple',
              textColor: 'text-accent-purple',
            },
          ].map((event, idx) => (
            <div key={idx} className="flex items-start gap-3">
              {/* Timeline dot + line */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${event.color}`} />
                {idx < 4 && <div className="w-px h-6 bg-border mt-1" />}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0 -mt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold ${event.textColor}`}>{event.agent}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{event.time}</span>
                </div>
                <p className="text-[11px] text-foreground mt-0.5 leading-tight">{event.action}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setActiveTab('agent-studio')}
          className="mt-4 w-full py-2 rounded-[10px] border-2 border-border bg-secondary text-foreground hover:border-border-strong hover:bg-brand-yellow hover:text-primary-foreground text-[11px] font-semibold transition-all font-display"
        >
          Open Orchestrator →
        </button>
      </div>

    </div>
  );
};
