import React from 'react';
import { FindingSeverity } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'cyan' | 'yellow';
  severity?: FindingSeverity;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  severity,
  size = 'md',
  className = '',
  dot = false,
}) => {
  let resolvedVariant = variant;
  if (severity) {
    switch (severity) {
      case 'critical': resolvedVariant = 'danger'; break;
      case 'high':     resolvedVariant = 'warning'; break;
      case 'medium':   resolvedVariant = 'purple'; break;
      case 'low':      resolvedVariant = 'info'; break;
      case 'info':     resolvedVariant = 'cyan'; break;
    }
  }

  const variantStyles: Record<string, string> = {
    default: 'bg-secondary text-foreground border-border-strong',
    success: 'bg-accent-green text-accent-green-fg border-border-strong',
    warning: 'bg-accent-orange text-accent-orange-fg border-border-strong',
    danger:  'bg-accent-red text-accent-red-fg border-border-strong',
    info:    'bg-accent-blue text-accent-blue-fg border-border-strong',
    purple:  'bg-accent-purple text-accent-purple-fg border-border-strong',
    cyan:    'bg-accent-cyan text-accent-cyan-fg border-border-strong',
    yellow:  'bg-brand-yellow text-brand-yellow-foreground border-border-strong',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'text-[10px] px-2 py-0.5 rounded-[6px]',
    md: 'text-[11px] px-2.5 py-0.5 rounded-[8px]',
    lg: 'text-xs px-3 py-1 rounded-[10px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans font-semibold border select-none transition-colors duration-theme uppercase tracking-wide ${variantStyles[resolvedVariant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
};
