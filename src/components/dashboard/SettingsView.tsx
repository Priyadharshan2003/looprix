import React, { useState } from 'react';
import {
  Cpu,
  Shield,
  Key,
  Sliders,
  Check,
  Save,
  Sparkles,
  Settings,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const SettingsView: React.FC = () => {
  const [model, setModel] = useState<'gpt-5' | 'gpt-5-mini' | 'claude-3-7-sonnet' | 'azure-openai'>('gpt-5');
  const [maxLoops, setMaxLoops] = useState<number>(5);
  const [targetCoverage, setTargetCoverage] = useState<number>(80);
  const [autoOpenPR, setAutoOpenPR] = useState<boolean>(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const llmModels = [
    { id: 'gpt-5',            name: 'OpenAI GPT-5',           badge: 'Recommended', badgeVariant: 'yellow' as const, desc: 'Highest reasoning for complex SAP & AST transformations.' },
    { id: 'claude-3-7-sonnet',name: 'Claude 3.7 Sonnet',      badge: 'Best Code',   badgeVariant: 'purple' as const, desc: 'Hybrid reasoning and supreme code synthesis capabilities.' },
    { id: 'gpt-5-mini',       name: 'GPT-5 Mini',             badge: 'Fast',        badgeVariant: 'info' as const,   desc: 'Fast, cost-effective for quick linter/AST scans.' },
    { id: 'azure-openai',     name: 'Azure OpenAI Enterprise', badge: 'Enterprise',  badgeVariant: 'default' as const, desc: 'Dedicated tenant with zero data retention.' },
  ];

  return (
    <div className="space-y-6 select-none max-w-5xl">
      {/* ══ Header ════════════════════════════════════ */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-secondary text-accent-orange border-2 border-border text-[11px] font-semibold mb-2 font-display">
          <Settings className="w-3.5 h-3.5" />
          System Configuration & AI Engine
        </div>
        <h2 className="text-2xl font-bold text-foreground font-display tracking-tight leading-tight">
          Antigravity Engine Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure multi-agent LLM routing, self-correction iteration thresholds, and tool-calling boundaries.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* ══ LLM Engine ════════════════════════════ */}
        <div className="nb-card-static p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-border">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent-orange" />
              <h3 className="text-[14px] font-bold text-foreground font-display">LLM Orchestration Layer</h3>
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-pill border border-border">
              Multi-Model Router
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {llmModels.map(item => (
              <label
                key={item.id}
                onClick={() => setModel(item.id as any)}
                className={`p-4 rounded-[14px] border-2 cursor-pointer flex flex-col gap-2 transition-all ${
                  model === item.id
                    ? 'border-border-strong bg-brand-yellow text-brand-yellow-foreground shadow-brutal-sm'
                    : 'border-border bg-secondary text-foreground hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold font-display">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.badgeVariant} size="sm">{item.badge}</Badge>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      model === item.id ? 'border-foreground bg-foreground' : 'border-border bg-card'
                    }`}>
                      {model === item.id && <div className="w-2 h-2 rounded-full bg-brand-yellow" />}
                    </div>
                  </div>
                </div>
                <p className={`text-[11px] leading-relaxed ${model === item.id ? 'text-brand-yellow-foreground/70' : 'text-muted-foreground'}`}>
                  {item.desc}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* ══ Self-Correction Quality Gates ═══════════ */}
        <div className="nb-card-static p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-border">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-accent-green" />
              <h3 className="text-[14px] font-bold text-foreground font-display">Self-Correction Quality Gates</h3>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">PRD Section 9 & 10</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Max loops */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-foreground font-display">Max Self-Correction Loops</span>
                <span className="text-[13px] font-bold text-accent-orange font-display">{maxLoops} loops</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={maxLoops}
                onChange={e => setMaxLoops(Number(e.target.value))}
                aria-label="Maximum self-correction loops"
                className="w-full accent-accent-orange h-2 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1 loop</span>
                <span>5 loops</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Agent will re-attempt remediation up to {maxLoops} times if validation fails.
              </p>
            </div>

            {/* Coverage gate */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-foreground font-display">Coverage Gate Requirement</span>
                <span className="text-[13px] font-bold text-accent-green font-display">{targetCoverage}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={95}
                step={5}
                value={targetCoverage}
                onChange={e => setTargetCoverage(Number(e.target.value))}
                aria-label="Coverage gate requirement percentage"
                className="w-full accent-accent-green h-2 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>70%</span>
                <span>95%</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Validation Agent blocks PR generation if coverage falls below {targetCoverage}%.
              </p>
            </div>
          </div>
        </div>

        {/* ══ Tool Permissions ══════════════════════ */}
        <div className="nb-card-static p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-border">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-purple" />
              <h3 className="text-[14px] font-bold text-foreground font-display">Tool Permissions & Autonomy</h3>
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-pill border border-border">
              Antigravity Guard
            </span>
          </div>

          <label className="flex items-center justify-between p-4 rounded-[12px] bg-secondary border-2 border-border cursor-pointer hover:border-border-strong transition-all group">
            <div>
              <span className="text-[13px] font-semibold text-foreground font-display block">
                Autonomous Git Pull Request Opening
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5 block leading-relaxed">
                Allow Pull Request Agent to create branches and open PRs automatically upon test pass.
              </span>
            </div>
            {/* Custom toggle */}
            <div
              className={`relative w-12 h-6 rounded-full border-2 border-border-strong transition-colors ${
                autoOpenPR ? 'bg-accent-green' : 'bg-muted'
              }`}
              onClick={() => setAutoOpenPR(!autoOpenPR)}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary-foreground border border-input-border shadow transition-all ${
                autoOpenPR ? 'left-6' : 'left-0.5'
              }`} />
              <input type="checkbox" checked={autoOpenPR} onChange={e => setAutoOpenPR(e.target.checked)} className="sr-only" />
            </div>
          </label>
        </div>

        {/* ══ Save Bar ══════════════════════════════ */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <div className="flex items-center gap-2 text-[12px] text-accent-green font-semibold animate-fade-in-up">
              <CheckCircle2 className="w-4 h-4" />
              Configuration saved & synced with Antigravity runtime
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground font-mono">Looprix Core v1.0.0</span>
          )}

          <button
            type="submit"
            className="nb-btn-primary px-6 py-2.5 text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
