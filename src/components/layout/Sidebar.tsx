import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ShieldAlert,
  Cpu,
  GitPullRequest,
  FolderGit2,
  Settings,
  Zap,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

const NAV: {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeDot?: 'red' | 'orange' | 'green';
}[] = [
  { id: 'overview',     label: 'Overview',      icon: LayoutDashboard },
  { id: 'self-healing', label: 'Self-Healing',   icon: Sparkles,       badge: 1,   badgeDot: 'green' },
  { id: 'security',     label: 'Security',       icon: ShieldAlert,    badge: 2,   badgeDot: 'red'   },
  { id: 'compliance',   label: 'Clean Core',     icon: FileCheck2                                     },
  { id: 'agent-studio', label: 'Orchestrator',   icon: Cpu                                            },
  { id: 'repositories', label: 'Repositories',   icon: FolderGit2                                     },
  { id: 'pull-requests',label: 'Pull Requests',  icon: GitPullRequest, badge: 2,   badgeDot: 'orange'},
  { id: 'settings',     label: 'Settings',       icon: Settings                                       },
  { id: 'about',        label: 'About',          icon: Info                                           },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <aside
      className={`relative flex flex-col shrink-0 h-full bg-card border-r-[3px] border-border-strong transition-all duration-300 z-30 ${
        collapsed ? 'w-[60px]' : 'w-[192px]'
      }`}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div className="h-[52px] flex items-center px-3 border-b-2 border-border-strong gap-2.5">
        <div
          className="w-7 h-7 shrink-0 rounded-[8px] bg-brand-yellow border-2 border-border-strong flex items-center justify-center shadow-brutal-sm cursor-pointer"
          onClick={() => setActiveTab('overview')}
        >
          <Zap className="w-4 h-4 text-brand-yellow-foreground fill-brand-yellow-foreground" />
        </div>
        {!collapsed && (
          <span className="text-[14px] font-bold font-display text-foreground tracking-tight select-none">
            Looprix
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex items-center justify-center w-5 h-5 rounded-[6px] border border-border text-muted-foreground hover:text-foreground hover:border-border-strong transition-all ml-auto shrink-0`}
          aria-label={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* ── Nav ──────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`relative w-full flex items-center gap-2.5 px-2.5 h-[36px] rounded-[10px] text-left transition-all group ${
                isActive
                  ? 'bg-foreground text-background shadow-brutal-sm font-bold'
                  : 'text-foreground font-semibold hover:bg-secondary'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && (
                <span className="text-[13px] font-bold font-display flex-1 truncate">
                  {item.label}
                </span>
              )}
              {/* Badge */}
              {!collapsed && item.badge && (
                <span
                  className={`text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border ml-auto shrink-0 ${
                    item.badgeDot === 'red'    ? 'bg-accent-red text-accent-red-fg border-border-strong' :
                    item.badgeDot === 'orange' ? 'bg-accent-orange text-accent-orange-fg border-border-strong' :
                                                 'bg-accent-green text-accent-green-fg border-border-strong'
                  } ${isActive ? 'opacity-0' : 'opacity-100'}`}
                >
                  {item.badge}
                </span>
              )}
              {/* Collapsed badge dot */}
              {collapsed && item.badge && (
                <span
                  className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                    item.badgeDot === 'red' ? 'bg-accent-red' :
                    item.badgeDot === 'orange' ? 'bg-accent-orange' : 'bg-accent-green'
                  }`}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer status ─────────────────────────────── */}
      <div className="p-2 pt-0 border-t border-border">
        <div
          className={`flex items-center gap-2 px-2.5 h-[36px] rounded-[10px] bg-secondary border border-border ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <span className="w-2 h-2 shrink-0 rounded-full bg-accent-green animate-pulse-glow" />
          {!collapsed && (
            <span className="text-[11px] text-foreground font-bold leading-tight">
              <span className="font-bold text-accent-green-text">11</span>
              <span className="text-foreground">/11 online</span>
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
