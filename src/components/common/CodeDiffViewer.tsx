import React, { useState } from 'react';
import { Copy, Check, Split, AlignJustify, ShieldCheck, FileCode, CheckCircle2, Terminal } from 'lucide-react';

interface CodeDiffViewerProps {
  filename?: string;
  originalCode: string;
  remediatedCode: string;
  generatedTestCode?: string;
  language?: string;
  showTestTab?: boolean;
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({
  filename = 'source_code',
  originalCode,
  remediatedCode,
  generatedTestCode,
  language = 'typescript',
  showTestTab = true,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified' | 'tests'>('split');
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const origLines = originalCode.trim().split('\n');
  const remLines = remediatedCode.trim().split('\n');

  return (
    <div className="border border-border-strong bg-card text-card-foreground font-mono shadow-brutal overflow-hidden rounded-none transition-colors duration-theme">
      {/* Brutalist Terminal Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-secondary border-b border-border-strong gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-card border border-border px-2 py-0.5 text-[10px] font-bold text-foreground uppercase shadow-brutal-sm">
            <Terminal className="w-3 h-3 text-accent-green" />
            <span>DIFF_VIEWER :: {filename}</span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-accent-orange text-accent-foreground border border-border-strong shadow-brutal-sm">
            {language}
          </span>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5">
          <div className="flex bg-card border border-border p-0.5 text-xs font-bold shadow-brutal-sm">
            <button
              onClick={() => setViewMode('split')}
              aria-label="Switch to side-by-side split diff view"
              className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-colors ${
                viewMode === 'split'
                  ? 'bg-accent-green text-accent-green-fg border border-border-strong'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              [SIDE-BY-SIDE]
            </button>
            <button
              onClick={() => setViewMode('unified')}
              aria-label="Switch to unified diff view"
              className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-colors ${
                viewMode === 'unified'
                  ? 'bg-accent-green text-accent-green-fg border border-border-strong'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              [UNIFIED]
            </button>
            {showTestTab && generatedTestCode && (
              <button
                onClick={() => setViewMode('tests')}
                aria-label="Switch to generated test suite view"
                className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-colors ${
                  viewMode === 'tests'
                    ? 'bg-accent-cyan text-accent-cyan-fg border border-border-strong'
                    : 'text-accent-cyan hover:text-foreground'
                }`}
              >
                [TEST_SUITE]
              </button>
            )}
          </div>

          <button
            onClick={() =>
              handleCopy(viewMode === 'tests' ? generatedTestCode || '' : remediatedCode)
            }
            className="px-2 py-1 bg-card hover:bg-secondary text-foreground border border-border text-xs font-bold uppercase flex items-center gap-1 shadow-brutal-sm transition-colors duration-theme"
            title="Copy Code"
            aria-label="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
            <span>COPY</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border-strong text-xs font-mono bg-card">
          {/* Left Column: Original / Vulnerable */}
          <div className="flex flex-col">
            <div className="px-3 py-1.5 bg-accent-red/15 border-b border-border-strong text-accent-red font-black flex items-center justify-between text-[11px]">
              <span>[ - BEFORE / VULNERABLE ]</span>
              <span className="text-muted-foreground font-mono text-[10px]">{origLines.length} LINES</span>
            </div>
            <div className="p-3 overflow-x-auto max-h-[440px] leading-relaxed bg-card text-foreground">
              {origLines.map((line, idx) => {
                const isViolation =
                  line.includes('VIOLATION') ||
                  line.includes('UPDATE vbak') ||
                  line.includes('CONVERT_TO_LOCAL_CURRENCY') ||
                  line.includes('STRIPE_SECRET_KEY') ||
                  line.includes('innerHTML') ||
                  line.includes('DB_CONN') ||
                  line.includes('SELECT * FROM user_events');
                return (
                  <div
                    key={idx}
                    className={`flex items-start px-2 py-0.5 ${
                      isViolation
                        ? 'bg-accent-red/20 text-accent-red border-l-4 border-accent-red font-semibold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span className="w-8 select-none text-muted-foreground/60 text-right pr-3 shrink-0 font-mono text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre">{line || ' '}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Remediated / Self-Healed */}
          <div className="flex flex-col">
            <div className="px-3 py-1.5 bg-accent-green/15 border-b border-border-strong text-accent-green font-black flex items-center justify-between text-[11px]">
              <span>[ + AFTER / LOOPRIX HEALED ]</span>
              <span className="text-muted-foreground font-mono text-[10px]">{remLines.length} LINES</span>
            </div>
            <div className="p-3 overflow-x-auto max-h-[440px] leading-relaxed bg-card text-foreground">
              {remLines.map((line, idx) => {
                const isRemediated =
                  line.includes('CLEAN CORE') ||
                  line.includes('SECURED') ||
                  line.includes('HIGH PERFORMANCE') ||
                  line.includes('MODIFY ENTITIES OF') ||
                  line.includes('i_currencyconversion') ||
                  line.includes('DOMPurify.sanitize') ||
                  line.includes('process.env.STRIPE_SECRET_KEY') ||
                  line.includes('stmt = text(') ||
                  line.includes('Session = Depends');
                return (
                  <div
                    key={idx}
                    className={`flex items-start px-2 py-0.5 ${
                      isRemediated
                        ? 'bg-accent-green/20 text-accent-green border-l-4 border-accent-green font-semibold'
                        : 'text-foreground'
                    }`}
                  >
                    <span className="w-8 select-none text-muted-foreground/60 text-right pr-3 shrink-0 font-mono text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre">{line || ' '}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'unified' && (
        <div className="p-3 overflow-x-auto max-h-[480px] text-xs font-mono leading-relaxed bg-card text-foreground">
          <div className="text-accent-red font-bold mb-2 select-none">--- VULNERABLE SOURCE ---</div>
          {origLines.map((line, idx) => (
            <div key={`orig-${idx}`} className="flex items-start px-2 py-0.5 text-accent-red bg-accent-red/10">
              <span className="w-8 select-none text-accent-red/70 text-right pr-3 shrink-0">- {idx + 1}</span>
              <span className="whitespace-pre">{line || ' '}</span>
            </div>
          ))}
          <div className="text-accent-green font-bold my-2 select-none">+++ AUTONOMOUS REMEDIATION +++</div>
          {remLines.map((line, idx) => (
            <div key={`rem-${idx}`} className="flex items-start px-2 py-0.5 text-accent-green bg-accent-green/10">
              <span className="w-8 select-none text-accent-green/70 text-right pr-3 shrink-0">+ {idx + 1}</span>
              <span className="whitespace-pre">{line || ' '}</span>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'tests' && generatedTestCode && (
        <div className="p-4 bg-card text-card-foreground max-h-[480px] overflow-x-auto">
          <div className="mb-3 flex items-center justify-between pb-2 border-b border-border text-xs">
            <div className="flex items-center gap-2 text-accent-cyan font-bold uppercase">
              <Terminal className="w-4 h-4" />
              <span>TEST RUNNER :: (TARGET: &gt;= 80% COVERAGE)</span>
            </div>
            <span className="text-muted-foreground font-mono text-[11px]">[FRAMEWORK: {language === 'abap' ? 'ABAP_UNIT' : language === 'python' ? 'PYTEST' : 'VITEST'}]</span>
          </div>
          <pre className="text-xs font-mono text-accent-green leading-relaxed overflow-x-auto">
            {generatedTestCode}
          </pre>
        </div>
      )}
    </div>
  );
};
