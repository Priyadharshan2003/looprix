import React, { useEffect, useState } from 'react';

export const ThemeInspector: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  };

  const ColorSwatch = ({ name, bgClass, textClass, borderClass = '' }: { name: string, bgClass: string, textClass: string, borderClass?: string }) => (
    <div className={`p-4 rounded-[12px] flex flex-col gap-2 shadow-brutal-sm ${bgClass} ${borderClass ? `border-2 ${borderClass}` : 'border-2 border-border-strong'}`}>
      <span className={`text-[12px] font-bold font-display ${textClass}`}>{name}</span>
      <span className={`text-[10px] ${textClass} text-subtext`}>{bgClass} / {textClass}</span>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between bg-card p-6 rounded-[24px] border-[3px] border-border-strong shadow-brutal-lg">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">Theme Inspector</h1>
          <p className="text-muted-foreground text-sm mt-1">Validating design tokens and WCAG AA contrast across modes.</p>
        </div>
        <button 
          onClick={toggleTheme}
          className="nb-btn px-6 py-3 bg-foreground text-background font-bold"
        >
          Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ColorSwatch name="Background" bgClass="bg-background" textClass="text-foreground" />
        <ColorSwatch name="Card" bgClass="bg-card" textClass="text-foreground" />
        <ColorSwatch name="Muted" bgClass="bg-muted" textClass="text-muted-foreground" />
        <ColorSwatch name="Primary" bgClass="bg-primary" textClass="text-primary-foreground" />
        
        <ColorSwatch name="Secondary" bgClass="bg-secondary" textClass="text-secondary-foreground" />
        <ColorSwatch name="Accent Red" bgClass="bg-accent-red" textClass="text-primary-foreground" />
        <ColorSwatch name="Accent Orange" bgClass="bg-accent-orange" textClass="text-foreground" />
        <ColorSwatch name="Accent Green" bgClass="bg-accent-green" textClass="text-foreground" />
        
        <ColorSwatch name="Accent Blue" bgClass="bg-accent-blue" textClass="text-primary-foreground" />
        <ColorSwatch name="Accent Purple" bgClass="bg-accent-purple" textClass="text-primary-foreground" />
        <ColorSwatch name="Accent Cyan" bgClass="bg-accent-cyan" textClass="text-foreground" />
        <ColorSwatch name="Brand Yellow" bgClass="bg-brand-yellow" textClass="text-foreground" />
      </div>

      <div className="bg-card p-6 rounded-[24px] border-[3px] border-border-strong shadow-brutal-lg space-y-4">
        <h2 className="text-lg font-bold text-foreground font-display">Button Examples</h2>
        <div className="flex flex-wrap gap-4">
          <button className="nb-btn px-5 py-2.5 bg-primary text-primary-foreground text-sm border-2 border-border-strong font-bold">Primary Button</button>
          <button className="nb-btn px-5 py-2.5 bg-brand-yellow text-foreground text-sm border-2 border-border-strong font-bold">Yellow Action</button>
          <button className="nb-btn px-5 py-2.5 bg-accent-green text-foreground text-sm border-2 border-border-strong font-bold">Green Success</button>
          <button className="nb-btn px-5 py-2.5 bg-accent-red text-primary-foreground text-sm border-2 border-border-strong font-bold">Red Destructive</button>
        </div>
      </div>
    </div>
  );
};
