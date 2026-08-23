import React, { useState } from 'react';
import { ThemeProvider } from './components/theme/theme-provider';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/dashboard/OverviewView';
import { SelfHealingRunnerView } from './components/dashboard/SelfHealingRunnerView';
import { SecurityDashboard } from './components/dashboard/SecurityDashboard';
import { ComplianceDashboard } from './components/dashboard/ComplianceDashboard';
import { AgentStudioView } from './components/dashboard/AgentStudioView';
import { RepositoryOnboardingView } from './components/dashboard/RepositoryOnboardingView';
import { PullRequestsView } from './components/dashboard/PullRequestsView';
import { SettingsView } from './components/dashboard/SettingsView';
import { ThemeInspector } from './components/dashboard/ThemeInspector';
import { AboutView } from './components/dashboard/AboutView';
import Background from './components/ui/noise-dark-blue-gradient-with-squares';

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'self-healing':
        return <SelfHealingRunnerView />;
      case 'security':
        return <SecurityDashboard />;
      case 'compliance':
        return <ComplianceDashboard />;
      case 'agent-studio':
        return <AgentStudioView />;
      case 'repositories':
        return <RepositoryOnboardingView />;
      case 'pull-requests':
        return <PullRequestsView />;
      case 'settings':
        return <SettingsView />;
      case 'theme-inspector':
        return <ThemeInspector />;
      case 'about':
        return <AboutView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <>
      <Background className="fixed inset-0 -z-10 hidden dark:block" />
      <div className="flex h-screen w-screen overflow-hidden bg-background dark:bg-transparent text-foreground select-none transition-colors duration-theme">
      {/* Collapsible Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto bg-background dark:bg-transparent">
          <div className="p-4 lg:p-5 pb-10">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
    </>
  );
};

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="looprix-theme">
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
