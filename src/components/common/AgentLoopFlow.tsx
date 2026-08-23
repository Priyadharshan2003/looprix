import React from 'react';
import { Shield, Sparkles, TestTube2, CheckCircle2, GitPullRequest, Search } from 'lucide-react';

interface AgentLoopFlowProps {
  currentStage?: 'review' | 'fix' | 'test' | 'validation' | 'pr' | 'completed' | 'idle';
  iteration?: number;
  maxIterations?: number;
  interactive?: boolean;
}

const stages = [
  { id: 'review',     label: 'Detect',    sub: 'AST + OWASP scan',     icon: Search,        color: 'bg-accent-blue' },
  { id: 'fix',        label: 'Patch',     sub: 'Self-healing code',     icon: Sparkles,      color: 'bg-accent-orange' },
  { id: 'test',       label: 'Test',      sub: 'Generate unit tests',   icon: TestTube2,     color: 'bg-accent-purple' },
  { id: 'validation', label: 'Validate',  sub: 'Coverage ≥ 80%',        icon: CheckCircle2,  color: 'bg-accent-green' },
  { id: 'pr',         label: 'Create PR', sub: 'Open git pull request', icon: GitPullRequest, color: 'bg-accent-green' },
];

const stageOrder = ['review', 'fix', 'test', 'validation', 'pr', 'completed'];

export const AgentLoopFlow: React.FC<AgentLoopFlowProps> = ({
  currentStage = 'idle',
  iteration = 1,
  maxIterations = 5,
}) => {
  const currentIdx = stageOrder.indexOf(currentStage);

  const getStageState = (stageId: string): 'idle' | 'active' | 'completed' => {
    if (currentStage === 'idle') return 'idle';
    if (currentStage === 'completed') return 'completed';
    const stageIdx = stageOrder.indexOf(stageId);
    if (stageIdx === currentIdx) return 'active';
    if (stageIdx < currentIdx) return 'completed';
    return 'idle';
  };

  return (
    <div className="nb-card-static p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h4 className="text-[14px] font-bold text-foreground font-display leading-tight">
            Antigravity Self-Correction Loop
          </h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Autonomous multi-agent remediation pipeline
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-secondary border-2 border-border text-[11px] font-semibold font-display">
          <span className="text-muted-foreground">Iteration</span>
          <span className="text-accent-orange font-bold">{iteration} / {maxIterations}</span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const state = getStageState(stage.id);
          const isLast = idx === stages.length - 1;

          return (
            <React.Fragment key={stage.id}>
              <div
                className={`timeline-step flex flex-col items-center p-3 min-w-[100px] text-center ${
                  state === 'active'
                    ? 'active'
                    : state === 'completed'
                    ? 'completed'
                    : 'bg-card text-muted-foreground'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-[12px] flex items-center justify-center mb-2 border-2 ${
                    state === 'active'
                      ? 'bg-foreground border-foreground text-brand-yellow'
                      : state === 'completed'
                      ? 'bg-foreground border-foreground text-accent-green'
                      : 'bg-secondary border-border text-muted-foreground'
                  }`}
                >
                  {state === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[12px] font-semibold font-display leading-tight ${
                    state === 'idle' ? 'text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {stage.label}
                </span>
                <span
                  className={`text-[10px] mt-0.5 leading-tight ${
                    state === 'idle' ? 'text-subtext' : 'text-muted-foreground'
                  }`}
                >
                  {stage.sub}
                </span>

                {/* Status tag */}
                <div
                  className={`mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                    state === 'active'
                      ? 'bg-brand-yellow text-brand-yellow-foreground border-border-strong'
                      : state === 'completed'
                      ? 'bg-accent-green text-accent-green-fg border-border-strong'
                      : 'bg-muted text-subtext border-border'
                  }`}
                >
                  {state === 'active' ? 'Running' : state === 'completed' ? 'Done' : 'Waiting'}
                </div>
              </div>

              {/* Connector arrow */}
              {!isLast && (
                <div
                  className={`flex-shrink-0 w-8 flex items-center justify-center text-[18px] font-bold ${
                    getStageState(stages[idx + 1].id) !== 'idle' || state === 'completed'
                      ? 'text-accent-green'
                      : 'text-muted'
                  }`}
                >
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
