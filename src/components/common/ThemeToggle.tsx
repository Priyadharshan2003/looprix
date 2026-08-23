import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`h-9 px-3 border-2 border-border-strong bg-card hover:bg-secondary text-foreground font-mono text-xs font-bold shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal active:translate-x-[1px] active:translate-y-[1px] active:shadow-brutal-sm transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      {isDark ? (
        <>
          <Moon className="w-3.5 h-3.5 text-accent-cyan" />
          <span>[DARK]</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-accent-orange" />
          <span>[LIGHT]</span>
        </>
      )}
    </button>
  );
};
