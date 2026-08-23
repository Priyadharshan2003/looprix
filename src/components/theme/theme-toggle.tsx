import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from './theme-provider';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return {
          icon: <Moon className="w-3.5 h-3.5 text-accent-cyan transition-transform duration-theme" />,
          text: '🌙 DARK',
          tooltip: 'Theme: Dark (Click to switch to Light)',
        };
      case 'light':
        return {
          icon: <Sun className="w-3.5 h-3.5 text-accent-orange transition-transform duration-theme" />,
          text: '☀ LIGHT',
          tooltip: 'Theme: Light (Click to switch to System)',
        };
      case 'system':
        return {
          icon: <Laptop className="w-3.5 h-3.5 text-accent-green transition-transform duration-theme" />,
          text: `⚙ SYSTEM (${resolvedTheme.toUpperCase()})`,
          tooltip: `Theme: System (${resolvedTheme}) - (Click to switch to Dark)`,
        };
    }
  };

  const current = getThemeLabel();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`h-9 px-3 border border-border-strong bg-card hover:bg-secondary text-foreground font-mono text-xs font-bold shadow-brutal hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal-lg active:translate-x-[1px] active:translate-y-[1px] active:shadow-brutal-sm transition-all duration-theme flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
      title={current.tooltip}
      aria-label={`Toggle theme. Current theme is ${theme}.`}
    >
      <span className="flex items-center gap-1.5 select-none">
        {current.icon}
        <span>{current.text}</span>
      </span>
    </button>
  );
};
