import React, { useState } from 'react';
import {
  Cpu,
  GitBranch,
  Binary,
  ShieldAlert,
  Sparkles,
  Zap,
  Wrench,
  Activity,
  CheckSquare,
  CheckCircle2,
  GitPullRequest,
  RotateCcw,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgentModule } from '../../types';
import { Badge } from '../common/Badge';

const iconMap: Record<string, React.ElementType> = {
  GitBranch, Binary, Cpu, ShieldAlert, Sparkles, Zap,
  Wrench, Activity, CheckSquare, CheckCircle2, GitPullRequest, RotateCcw,
};

const agentColors = [
  'bg-accent-blue/20 text-accent-blue border-accent-blue/40',
  'bg-accent-orange/20 text-accent-orange border-accent-orange/40',
  'bg-accent-green/20 text-accent-green border-accent-green/40',
  'bg-accent-red/20 text-accent-red border-accent-red/40',
  'bg-accent-purple/20 text-accent-purple border-accent-purple/40',
  'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40',
  'bg-brand-yellow/20 text-accent-orange border-brand-yellow/40',
  'bg-accent-blue/20 text-accent-blue border-accent-blue/40',
  'bg-accent-green/20 text-accent-green border-accent-green/40',
  'bg-accent-purple/20 text-accent-purple border-accent-purple/40',
  'bg-accent-orange/20 text-accent-orange border-accent-orange/40',
];

export const AgentStudioView: React.FC = () => {
  const { agentModules, sharedMemoryLogs, setActiveTab } = useApp();
  const [selectedAgent, setSelectedAgent] = useState<AgentModule>(agentModules[2]);

  return (
    <div className="space-y-6 select-none">
      {/* ══ Header ════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-accent-purple text-accent-purple-fg border-2 border-border-strong text-[11px] font-semibold shadow-brutal-sm mb-2 font-display">
            <Cpu className="w-3.5 h-3.5" />
            Antigravity Orchestrator
          </div>
          <h2 className="text-2xl font-bold text-foreground font-display tracking-tight leading-tight">
            Antigravity Multi-Agent Framework
          </h2>
          <p className="text-sm text-muted-foreground">
            Dynamic agent scheduling, shared memory coordination, self-correction loops (≤5 iterations), and tool-calling interfaces.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('self-healing')}
          className="nb-btn px-4 py-2.5 bg-accent-green text-accent-green-fg text-sm flex items-center gap-2 self-start shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          Trigger All Agents
        </button>
      </div>

      {/* ══ Agent Chips Grid ══════════════════════════ */}
      <div className="nb-card-static p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-bold text-foreground font-display">Agent Pipeline</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-accent-green text-accent-green-fg border-2 border-border-strong text-[11px] font-bold shadow-brutal-sm">
            <span className="w-2 h-2 rounded-full bg-accent-green-fg animate-pulse" />
            {agentModules.length} / {agentModules.length} Online
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {agentModules.map((agent, idx) => {
            const Icon = iconMap[agent.icon] ?? Cpu;
            const isSelected = selectedAgent.id === agent.id;
            const colorClass = agentColors[idx % agentColors.length];

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`agent-chip online cursor-pointer p-3.5 flex flex-col gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-brand-yellow text-brand-yellow-foreground border-border-strong shadow-brutal'
                    : 'bg-card text-foreground border-border hover:border-border-strong hover:shadow-brutal-sm'
                }`}
              >
                {/* Icon + module number */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-[10px] flex items-center justify-center border-2 ${
                      isSelected
                        ? 'bg-foreground border-foreground text-brand-yellow'
                        : `${colorClass} border`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-subtext font-mono">M0{agent.moduleNumber}</span>
                </div>

                {/* Name + role */}
                <div>
                  <h4 className="text-[11px] font-bold font-display line-clamp-1 leading-tight">
                    {agent.name}
                  </h4>
                  <p className={`text-[10px] line-clamp-2 mt-0.5 leading-tight ${isSelected ? 'text-brand-yellow-foreground/70' : 'text-muted-foreground'}`}>
                    {agent.role}
                  </p>
                </div>

                {/* Status dot */}
                <div className="flex items-center gap-1.5 mt-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-glow" />
                  <span className={`text-[9px] font-semibold ${isSelected ? 'text-brand-yellow-foreground/70' : 'text-accent-green'}`}>
                    Online
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ Inspector + Shared Memory Feed ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Selected Agent Inspector */}
        <div className="lg:col-span-6">
          <div className="nb-card-static p-6 space-y-4 h-full">
            <div className="flex items-center justify-between pb-4 border-b-2 border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Module 0{selectedAgent.moduleNumber}
                  </span>
                  <Badge variant="success" size="sm">Antigravity</Badge>
                </div>
                <h3 className="text-[16px] font-bold text-foreground font-display">{selectedAgent.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground">Role</span>
                <div className="text-[12px] font-semibold text-foreground font-display">{selectedAgent.role}</div>
              </div>
            </div>

            <div className="space-y-4 text-[12px]">
              <div>
                <span className="font-bold text-foreground font-display text-[11px] uppercase tracking-wide">
                  Core Responsibility
                </span>
                <p className="text-muted-foreground mt-1.5 leading-relaxed">{selectedAgent.description}</p>
              </div>

              <div className="p-4 rounded-[12px] bg-secondary border-2 border-border space-y-2 font-mono text-[11px]">
                {[
                  { label: 'AST Parsers', value: 'SAP ABAP, TypeScript, Python', color: 'text-accent-orange' },
                  { label: 'Output Contract', value: selectedAgent.outputType, color: 'text-accent-cyan' },
                  { label: 'Retry Guard', value: '≤ 5 loops', color: 'text-accent-green' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-muted-foreground">{row.label}:</span>
                    <span className={`font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div>
                <span className="font-bold text-foreground font-display text-[11px] uppercase tracking-wide">
                  Bound Antigravity Tools
                </span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { name: 'GitHub Tool', desc: 'Create Branch, Commit, Open PR' },
                    { name: 'Security Test Tool', desc: 'Scan, Validate, Coverage Runner' },
                  ].map(tool => (
                    <div key={tool.name} className="p-3 rounded-[10px] bg-secondary border-2 border-border">
                      <span className="font-bold text-foreground block text-[11px] font-display">{tool.name}</span>
                      <span className="text-[10px] text-muted-foreground">{tool.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Memory Feed */}
        <div className="lg:col-span-6">
          <div className="nb-card-static p-5 flex flex-col h-[460px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-border">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-accent-orange" />
                <h3 className="text-[14px] font-bold text-foreground font-display">Shared Memory Feed</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent-green">
                <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                Bus Active
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {sharedMemoryLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-[12px] bg-secondary border-2 border-border space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-accent-orange font-display">{log.agent}</span>
                    <span className="text-muted-foreground text-[10px]">{log.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        log.severity === 'critical' ? 'bg-accent-red' : log.severity === 'high' ? 'bg-accent-orange' : 'bg-accent-cyan'
                      }`}
                    />
                    <span className="font-semibold text-foreground">{log.findingType}</span>
                  </div>
                  <pre className="text-[10px] text-accent-green bg-card p-2.5 rounded-[8px] border-2 border-border overflow-x-auto font-mono">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
