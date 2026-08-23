import React from 'react';

interface CleanCoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showTier?: boolean;
}

export const CleanCoreGauge: React.FC<CleanCoreGaugeProps> = ({
  score,
  size = 'md',
  showTier = true,
}) => {
  const isHigh = score >= 90;
  const isMed  = score >= 70 && score < 90;

  const tier  = isHigh ? 'Tier 1 — Cloud Native' : isMed ? 'Tier 2 — Managed Core' : 'Tier 3 — Modification Risk';
  const color = isHigh ? 'var(--color-green)' : isMed ? 'var(--color-orange)' : 'var(--color-red)';
  const bgBadge = isHigh
    ? 'bg-accent-green text-accent-green-fg'
    : score >= 60 
    ? 'bg-accent-orange text-accent-orange-fg'
    : 'bg-accent-red text-accent-red-fg';

  // SVG radial progress
  const dimensions = size === 'lg' ? 160 : size === 'md' ? 130 : 100;
  const strokeWidth = size === 'lg' ? 13 : size === 'md' ? 11 : 9;
  const center = dimensions / 2;
  const radius = center - strokeWidth - 4;
  const circumference = 2 * Math.PI * radius;
  // Use 270° arc (from 225° to -45°, i.e., 3/4 circle)
  const arcLength = circumference * 0.75;
  const filled = arcLength * (score / 100);
  const textSize = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl';
  const labelSize = size === 'lg' ? 'text-[11px]' : 'text-[10px]';

  // Start angle: 135deg (bottom-left), go clockwise 270deg
  const startAngle = 135; // degrees
  const rotation = startAngle; // rotate the entire SVG

  return (
    <div className="flex flex-col items-center gap-3 font-sans select-none">
      {/* SVG Radial Gauge */}
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions}
          height={dimensions}
          style={{ transform: `rotate(${rotation}deg)` }}
          viewBox={`0 0 ${dimensions} ${dimensions}`}
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${filled} ${circumference - filled}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 800ms ease-out' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${textSize} font-bold text-foreground font-display leading-none`}>
            {score}
          </span>
          <span className={`${labelSize} text-muted-foreground mt-1 font-medium`}>
            / 100
          </span>
        </div>
      </div>

      {/* Title + Tier */}
      <div className="text-center space-y-1.5">
        <p className="text-[12px] font-semibold text-foreground font-display">
          Clean Core Score
        </p>
        {showTier && (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border border-border-strong ${bgBadge}`}>
            {tier}
          </span>
        )}
      </div>
    </div>
  );
};
