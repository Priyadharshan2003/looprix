import React, { useState } from 'react';
import {
  FolderGit2,
  GitBranch,
  Plus,
  Binary,
  Sparkles,
  X,
  Activity,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Language } from '../../types';

const langColors: Record<string, string> = {
  abap:       'bg-accent-orange/20 text-accent-orange',
  typescript: 'bg-accent-blue/20 text-accent-blue',
  python:     'bg-accent-green/20 text-accent-green',
};

export const RepositoryOnboardingView: React.FC = () => {
  const { repositories, addRepository, setSelectedRepo, setActiveTab } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [repoProvider, setRepoProvider] = useState<'github' | 'gitlab' | 'azure_devops'>('github');
  const [repoLang, setRepoLang] = useState<Language>('abap');
  const [repoBranch, setRepoBranch] = useState('main');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName || !repoUrl) return;
    addRepository({ name: repoName, url: repoUrl, provider: repoProvider, language: repoLang, branch: repoBranch });
    setShowModal(false);
    setRepoName('');
    setRepoUrl('');
  };

  return (
    <div className="space-y-6 select-none">
      {/* ══ Header ════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-accent-blue text-accent-blue-fg border-2 border-border-strong text-[11px] font-semibold shadow-brutal-sm mb-2 font-display">
            <FolderGit2 className="w-3.5 h-3.5" />
            Repository Onboarding & AST Engine
          </div>
          <h2 className="text-2xl font-bold text-foreground font-display tracking-tight leading-tight">
            Repository Onboarding & AST Graph
          </h2>
          <p className="text-sm text-muted-foreground">
            Connect GitHub, GitLab, and Azure DevOps repositories. Convert source code into analyzable AST structures.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="nb-btn-primary px-4 py-2.5 text-sm flex items-center gap-2 self-start shrink-0"
        >
          <Plus className="w-4 h-4" />
          Connect Repository
        </button>
      </div>

      {/* ══ Repository Cards ══════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {repositories.map(repo => (
          <div
            key={repo.id}
            className="nb-card p-5 flex flex-col justify-between gap-4"
          >
            <div>
              {/* Language + provider badges */}
              <div className="flex items-center justify-between mb-3">
                <Badge
                  size="sm"
                  variant={repo.language === 'abap' ? 'warning' : repo.language === 'typescript' ? 'info' : 'success'}
                >
                  {repo.language.toUpperCase()}
                </Badge>
                <span className="text-[10px] font-semibold bg-secondary text-muted-foreground px-2 py-0.5 rounded-pill border border-border capitalize">
                  {repo.provider.replace('_', ' ')}
                </span>
              </div>

              {/* Repo name */}
              <h3 className="font-bold text-[14px] text-foreground font-display truncate mb-1">
                {repo.name}
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                <GitBranch className="w-3 h-3 inline mr-1" />
                {repo.branch}
              </p>
            </div>

            {/* Metrics */}
            <div className="space-y-2 py-3 border-y-2 border-border text-[12px]">
              {[
                { label: 'Coverage', value: `${repo.coverage}%`, color: 'text-accent-green' },
                { label: 'Open PRs', value: `${repo.prsOpen} PRs`, color: 'text-accent-orange' },
                { label: 'Health Score', value: `${repo.healthScore}/100`, color: 'text-foreground' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={`font-bold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Health bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Health</span>
                <span className="font-bold text-foreground">{repo.healthScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-green transition-all"
                  style={{ width: `${repo.healthScore}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => { setSelectedRepo(repo); setActiveTab('self-healing'); }}
              className="w-full py-2.5 rounded-btn border-2 border-border-strong bg-secondary text-foreground hover:bg-brand-yellow hover:text-primary-foreground text-[12px] font-semibold transition-all font-display flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Self-Heal
            </button>
          </div>
        ))}
      </div>

      {/* ══ AST Engine Schemas ════════════════════════ */}
      <div className="nb-card-static p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-border">
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-accent-orange" />
            <h3 className="text-[14px] font-bold text-foreground font-display">AST Parsing Engine Schemas</h3>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-pill border border-border">
            Module 2 Contract
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
          {[
            {
              label: 'SAP ABAP AST Engine',
              color: 'text-accent-orange',
              bg: 'bg-accent-orange/10 border-accent-orange/30',
              code: `METHOD calculate_tax.\n  // AST Structure:\n  {\n    "type": "AbapMethod",\n    "clean_core_score": 62,\n    "table_mutations": ["VBAK"],\n    "obsolete_apis": ["CONVERT..."]\n  }`,
            },
            {
              label: 'TypeScript AST Engine',
              color: 'text-accent-cyan',
              bg: 'bg-accent-cyan/10 border-accent-cyan/30',
              code: `function calculateTax() {\n  // AST Structure:\n  {\n    "type": "FunctionDecl",\n    "xss_risks": ["innerHTML"],\n    "secrets": ["STRIPE_SECRET"]\n  }`,
            },
            {
              label: 'Python AST Engine',
              color: 'text-accent-green',
              bg: 'bg-accent-green/10 border-accent-green/30',
              code: `def calculate_tax():\n  # AST Structure:\n  {\n    "type": "FunctionDef",\n    "sql_injections": ["f-string"],\n    "db_leaks": ["DB_CONN"]\n  }`,
            },
          ].map(schema => (
            <div key={schema.label} className={`p-4 rounded-[12px] border-2 ${schema.bg} font-mono`}>
              <div className={`font-bold mb-3 text-[11px] font-display uppercase tracking-wide ${schema.color}`}>
                {schema.label}
              </div>
              <pre className="text-[10px] leading-relaxed overflow-x-auto text-foreground/80 whitespace-pre-wrap">
                {schema.code}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* ══ Connect Modal ════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-ink-primary/40 flex items-center justify-center p-4 z-100">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="connect-repo-title"
            className="nb-card-static p-6 max-w-md w-full space-y-4 animate-fade-in-up bg-card"
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-border">
              <h3 id="connect-repo-title" className="text-[15px] font-bold text-foreground font-display">Connect Repository</h3>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close connect repository modal"
                className="w-8 h-8 rounded-[8px] border-2 border-border hover:border-border-strong bg-secondary hover:bg-card text-foreground flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-4 text-[13px]">
              {[
                {
                  label: 'Git Provider',
                  type: 'select',
                  value: repoProvider,
                  onChange: (v: string) => setRepoProvider(v as any),
                  options: [
                    { value: 'github', label: 'GitHub' },
                    { value: 'gitlab', label: 'GitLab' },
                    { value: 'azure_devops', label: 'Azure DevOps' },
                  ],
                },
              ].map(field => (
                <div key={field.label}>
                  <label className="font-semibold text-foreground block mb-1.5 font-display">{field.label}</label>
                  <select
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    className="w-full p-2.5 rounded-btn bg-input border-2 border-input-border text-foreground font-medium focus:outline-none focus:border-border-strong transition-colors"
                  >
                    {field.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label className="font-semibold text-foreground block mb-1.5 font-display">Repository Name</label>
                <input
                  type="text"
                  placeholder="org/sap-order-core"
                  value={repoName}
                  onChange={e => setRepoName(e.target.value)}
                  className="w-full p-2.5 rounded-btn bg-input border-2 border-input-border text-foreground focus:outline-none focus:border-border-strong transition-colors"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5 font-display">Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo"
                  value={repoUrl}
                  onChange={e => setRepoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-btn bg-input border-2 border-input-border text-foreground focus:outline-none focus:border-border-strong transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1.5 font-display">Language</label>
                  <select
                    value={repoLang}
                    onChange={e => setRepoLang(e.target.value as any)}
                    className="w-full p-2.5 rounded-btn bg-input border-2 border-input-border text-foreground font-medium focus:outline-none focus:border-border-strong transition-colors"
                  >
                    <option value="abap">SAP ABAP</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1.5 font-display">Branch</label>
                  <input
                    type="text"
                    value={repoBranch}
                    onChange={e => setRepoBranch(e.target.value)}
                    className="w-full p-2.5 rounded-btn bg-input border-2 border-input-border text-foreground focus:outline-none focus:border-border-strong transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-btn border-2 border-border bg-secondary text-foreground font-semibold font-display hover:border-border-strong transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 nb-btn-primary font-display"
                >
                  Index & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
