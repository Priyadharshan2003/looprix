import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  RotateCcw,
  Sparkles,
  Code2,
  GitPullRequest,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CODE_SAMPLES } from '../../data/mockData';
import { Language, PullRequest } from '../../types';
import { CodeDiffViewer } from '../common/CodeDiffViewer';
import { Badge } from '../common/Badge';
import { AgentLoopFlow } from '../common/AgentLoopFlow';

const langConfig = {
  abap:       { label: 'SAP ABAP',   color: 'bg-accent-orange text-accent-orange-fg', activeColor: 'bg-accent-orange', border: 'border-accent-orange' },
  typescript: { label: 'TypeScript', color: 'bg-accent-cyan text-accent-cyan-fg',   activeColor: 'bg-accent-cyan',   border: 'border-accent-cyan' },
  python:     { label: 'Python',     color: 'bg-accent-green text-accent-green-fg',  activeColor: 'bg-accent-green',  border: 'border-accent-green' },
};

export const SelfHealingRunnerView: React.FC = () => {
  const { addPullRequest, addSharedMemoryLog, setActiveTab } = useApp();

  const [selectedLang, setSelectedLang] = useState<Language>('python');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState<'idle' | 'review' | 'fix' | 'test' | 'validation' | 'pr' | 'completed'>('idle');
  const [iteration, setIteration] = useState(1);
  const [logs, setLogs] = useState<string[]>([]);
  const [createdPR, setCreatedPR] = useState<PullRequest | null>(null);

  const sample = CODE_SAMPLES[selectedLang];

  const handleRunAgentLoop = async () => {
    setIsRunning(true);
    setCurrentStage('review');
    setIteration(1);
    setLogs([]);
    setCreatedPR(null);

    const appendLog = (msg: string) => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    appendLog(`[AST_ENGINE] Building syntax graph for ${sample.filename}...`);
    appendLog(`[AST_ENGINE] Parsed AST: Extracted functions, classes, imports, and symbol tables.`);
    await new Promise(r => setTimeout(r, 800));

    appendLog(`[SECURITY_AGENT] Running OWASP Top 10 & Clean Core inspection...`);
    sample.findings.forEach(f => {
      appendLog(`🚨 [${f.severity.toUpperCase()}] FINDING: ${f.title} (Line ${f.line})`);
      addSharedMemoryLog({
        taskId: `task-ag-${Math.floor(Math.random() * 9000 + 1000)}`,
        agent: f.category === 'clean_core' ? 'Clean Core Agent' : 'Security Agent',
        findingType: f.title,
        severity: f.severity,
        payload: { file: f.file, line: f.line, description: f.description }
      });
    });

    await new Promise(r => setTimeout(r, 1000));

    setCurrentStage('fix');
    appendLog(`[SELF_HEALING_AGENT] Consuming findings from Antigravity Shared Memory...`);
    appendLog(`[SELF_HEALING_AGENT] Generating automated patch adhering to SOLID & Clean Core...`);
    appendLog(`[SELF_HEALING_AGENT] Patch synthesized successfully.`);
    await new Promise(r => setTimeout(r, 1000));

    setCurrentStage('test');
    const testFramework = selectedLang === 'abap' ? 'ABAP Unit' : selectedLang === 'python' ? 'pytest' : 'Vitest / Jest';
    appendLog(`[TEST_AGENT] Generating unit test suite in ${testFramework}...`);
    appendLog(`[TEST_AGENT] Target coverage requirement: >= 80%. Synthesizing assertions...`);
    await new Promise(r => setTimeout(r, 900));

    setCurrentStage('validation');
    appendLog(`[VALIDATION_AGENT] Executing test suite against remediated AST...`);
    appendLog(`[VALIDATION_AGENT] Static analysis: PASSED (0 Critical, 0 High issues).`);
    const coverage = selectedLang === 'python' ? 94.2 : selectedLang === 'abap' ? 88.5 : 91.8;
    appendLog(`[VALIDATION_AGENT] Test Coverage: ${coverage}% (Threshold: 80% -> [PASS]).`);
    await new Promise(r => setTimeout(r, 900));

    setCurrentStage('pr');
    appendLog(`[PR_AGENT] Creating git branch looprix/patch-${selectedLang}-${Date.now().toString().slice(-4)}...`);
    appendLog(`[PR_AGENT] Writing risk assessment and opening Git Pull Request...`);

    const newPR: PullRequest = {
      id: `pr-${Date.now()}`,
      number: Math.floor(Math.random() * 50) + 110,
      title: `Fix: Autonomous Remediation of ${sample.findings[0].title}`,
      description: `### Looprix Autonomous Multi-Agent Remediation\n\nSelf-healed ${sample.findings.length} findings with ${coverage}% test coverage.`,
      repository: selectedLang === 'abap' ? 'sap-enterprise-core/s4-order-fulfillment' : selectedLang === 'typescript' ? 'fintech-global/checkout-web-service' : 'cloud-scale/data-ingestion-fastapi',
      branch: `looprix/fix-${selectedLang}-${Date.now().toString().slice(-4)}`,
      targetBranch: 'main',
      author: 'Looprix Autonomous Agent [bot]',
      createdAt: 'Just now',
      status: 'open',
      language: selectedLang,
      riskReport: {
        level: 'Low Risk',
        breakingChanges: false,
        regressionRisk: 'Verified via Antigravity Self-Correction Loop'
      },
      securitySummary: {
        resolvedIssues: sample.findings.length,
        criticalFixed: sample.findings.filter(f => f.severity === 'critical').length,
        highFixed: sample.findings.filter(f => f.severity === 'high').length,
        owaspCovered: sample.findings.map(f => ('cwe' in f && typeof (f as any).cwe === 'string' ? (f as any).cwe : f.title))
      },
      coverageReport: {
        beforeCoverage: 55,
        afterCoverage: coverage,
        testsGenerated: 3,
        framework: testFramework
      },
      filesChanged: [{
        filename: sample.filename,
        additions: 32,
        deletions: 14,
        originalCode: sample.vulnerableCode,
        remediatedCode: sample.remediatedCode,
        generatedTestCode: sample.generatedTests
      }],
      agentLoops: 1
    };

    addPullRequest(newPR);
    setCreatedPR(newPR);
    setCurrentStage('completed');
    setIsRunning(false);
    appendLog(`[LOOPRIX_ENGINE] PULL REQUEST #${newPR.number} OPENED AND VERIFIED [PASS]`);

    try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
  };

  return (
    <div className="space-y-6 select-none">
      {/* ══ Header ════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-accent-green text-accent-green-fg border-2 border-border-strong text-[11px] font-semibold shadow-brutal-sm mb-2 font-display">
            <Sparkles className="w-3.5 h-3.5" />
            Self-Healing Engine
          </div>
          <h2 className="text-2xl font-bold text-foreground font-display tracking-tight leading-tight">
            Self-Correction & Autonomous Remediation
          </h2>
          <p className="text-sm text-muted-foreground">
            Test multi-agent self-healing across SAP Clean Core ABAP, TypeScript, and Python.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-[14px] bg-secondary border-2 border-border-strong shadow-brutal-sm self-start">
          {(Object.keys(langConfig) as Language[]).map(lang => {
            const cfg = langConfig[lang];
            const isActive = selectedLang === lang;
            return (
              <button
                key={lang}
                disabled={isRunning}
                onClick={() => { setSelectedLang(lang); setCurrentStage('idle'); setCreatedPR(null); }}
                className={`px-3 py-1.5 rounded-[10px] text-[12px] font-semibold font-display transition-all disabled:bg-secondary disabled:text-muted-foreground disabled:border-border disabled:cursor-not-allowed ${
                  isActive
                    ? `${cfg.color} border-2 border-border-strong shadow-brutal-sm`
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ Agent Loop Flow ════════════════════════════ */}
      <AgentLoopFlow currentStage={currentStage} iteration={iteration} maxIterations={5} />

      {/* ══ Target Summary + Execute ══════════════════ */}
      <div className="nb-card-static p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent-orange" />
              <span className="text-[13px] font-bold text-foreground font-display">{sample.title}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">File: {sample.filename}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              {sample.findings.map(f => (
                <Badge key={f.id} severity={f.severity as any} size="sm">
                  {f.title.split(':')[0]}
                </Badge>
              ))}
            </div>

            <button
              onClick={handleRunAgentLoop}
              disabled={isRunning}
              className={`nb-btn px-5 py-2.5 text-[13px] flex items-center gap-2 ${
                isRunning
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-brand-yellow text-brand-yellow-foreground'
              }`}
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Agent Loop Running...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  Execute Autonomous Loop
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ══ Success Banner ════════════════════════════ */}
      {createdPR && (
        <div className="nb-card-static p-4 bg-accent-green text-foreground border-border-strong flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-foreground text-background flex items-center justify-center font-bold text-lg border-2 border-border-strong shadow-brutal-sm">
              ✓
            </div>
            <div>
              <div className="font-bold text-[13px] font-display">
                Pull Request #{createdPR.number} Created & Validated
              </div>
              <div className="text-[11px] text-subtext">
                Coverage: {createdPR.coverageReport.afterCoverage}% · 0 critical issues remaining
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('pull-requests')}
            className="nb-btn px-4 py-2 bg-foreground text-background text-[12px] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <GitPullRequest className="w-4 h-4" />
            Inspect PR Hub →
          </button>
        </div>
      )}

      {/* ══ Code Diff + Agent Log ════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Code diff */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-border">
            <h3 className="text-[13px] font-bold text-foreground font-display flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent-orange" />
              Source Remediation View
            </h3>
            <span className="text-[11px] text-muted-foreground">After vs Before</span>
          </div>
          <CodeDiffViewer
            filename={sample.filename}
            originalCode={sample.vulnerableCode}
            remediatedCode={sample.remediatedCode}
            generatedTestCode={sample.generatedTests}
            language={sample.language}
            showTestTab={true}
          />
        </div>

        {/* Agent log stream */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-border">
            <h3 className="text-[13px] font-bold text-foreground font-display">Agent Log Stream</h3>
            <span className="text-[11px] text-muted-foreground">Shared Memory</span>
          </div>

          <div className="nb-card-static p-3 font-mono text-[11px] h-[520px] flex flex-col bg-card">
            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-border text-[10px]">
              <span className="text-accent-green font-semibold">Console Stream</span>
              <span className="text-muted-foreground">BUFFER: OK</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                  <Play className="w-8 h-8 mb-2 text-border" />
                  <p className="text-[11px]">Click "Execute Autonomous Loop" to start the agent stream</p>
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed text-[10.5px] px-2 py-1 rounded-[6px] ${
                      log.includes('🚨')
                        ? 'text-accent-red bg-accent-red/10 border-l-2 border-accent-red'
                        : log.includes('PASS') || log.includes('OPENED')
                        ? 'text-accent-green bg-accent-green/10 border-l-2 border-accent-green font-semibold'
                        : log.includes('[VALIDATION_AGENT]')
                        ? 'text-accent-cyan'
                        : log.includes('[SELF_HEALING_AGENT]')
                        ? 'text-accent-orange'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>

            {isRunning && (
              <div className="pt-2 border-t-2 border-border text-[10px] text-accent-orange flex items-center gap-1.5">
                <RotateCcw className="w-3 h-3 animate-spin" />
                Agents reasoning in progress…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
