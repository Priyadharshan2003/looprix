import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'looprix-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        return stored;
      }
    } catch (e) {
      // localStorage fallback
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

  // Compute and apply theme to DOM (html element)
  useEffect(() => {
    const root = document.documentElement;

    const getSystemTheme = (): ResolvedTheme => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const effectiveTheme: ResolvedTheme = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(effectiveTheme);

    // Apply class to html tag
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    root.style.colorScheme = effectiveTheme;

    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      // Ignore storage errors
    }

    // If system mode is selected, listen for OS-level theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newSystemTheme: ResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newSystemTheme);
        root.classList.remove('light', 'dark');
        root.classList.add(newSystemTheme);
        root.style.colorScheme = newSystemTheme;
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Cycle: DARK -> LIGHT -> SYSTEM -> DARK
  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark';
    });
  };

  const contextValue = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
