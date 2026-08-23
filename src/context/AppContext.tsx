import React, { createContext, useContext, useState, useMemo } from 'react';
import { Repository, PullRequest, SecurityFinding, AgentModule, SharedMemoryEvent, Language } from '../types';
import { INITIAL_REPOSITORIES, INITIAL_PULL_REQUESTS, AGENT_MODULES, CODE_SAMPLES } from '../data/mockData';

export type NavTab = 
  | 'overview' 
  | 'self-healing' 
  | 'security' 
  | 'compliance' 
  | 'agent-studio' 
  | 'repositories' 
  | 'pull-requests' 
  | 'settings'
  | 'theme-inspector'
  | 'about';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  repositories: Repository[];
  selectedRepo: Repository;
  setSelectedRepo: (repo: Repository) => void;
  pullRequests: PullRequest[];
  findings: SecurityFinding[];
  agentModules: AgentModule[];
  sharedMemoryLogs: SharedMemoryEvent[];
  addRepository: (repo: Omit<Repository, 'id' | 'lastScanned' | 'healthScore' | 'criticalVulnerabilities' | 'coverage' | 'prsOpen' | 'status'>) => void;
  mergePullRequest: (id: string) => void;
  addPullRequest: (pr: PullRequest) => void;
  addSharedMemoryLog: (log: Omit<SharedMemoryEvent, 'timestamp'>) => void;
  stats: {
    totalRepos: number;
    activeAgentsCount: number;
    prsGeneratedCount: number;
    issuesFixedCount: number;
    avgCleanCoreScore: number;
    avgCoverage: number;
    autoResolvedRate: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [repositories, setRepositories] = useState<Repository[]>(INITIAL_REPOSITORIES);
  const [selectedRepo, setSelectedRepo] = useState<Repository>(INITIAL_REPOSITORIES[0]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>(INITIAL_PULL_REQUESTS);
  const [agentModules] = useState<AgentModule[]>(AGENT_MODULES);

  // Combine findings from mock samples
  const allFindings = useMemo(() => {
    return [
      ...CODE_SAMPLES.abap.findings,
      ...CODE_SAMPLES.typescript.findings,
      ...CODE_SAMPLES.python.findings
    ];
  }, []);

  const [findings, setFindings] = useState<SecurityFinding[]>(allFindings);

  const [sharedMemoryLogs, setSharedMemoryLogs] = useState<SharedMemoryEvent[]>([
    {
      taskId: 'task-ag-8821',
      timestamp: 'Just now',
      agent: 'Security Agent',
      findingType: 'CWE-89 SQL Injection',
      severity: 'critical',
      payload: { query: "f'SELECT * FROM user_events WHERE user_id = {user_id}'", file: 'analytics.py:14' }
    },
    {
      taskId: 'task-ag-8820',
      timestamp: '1 min ago',
      agent: 'Clean Core Agent',
      findingType: 'Direct Table Mutation (VBAK)',
      severity: 'critical',
      payload: { table: 'VBAK', method: 'process_order', file: 'zcl_sales_order_processor.clas.abap' }
    },
    {
      taskId: 'task-ag-8819',
      timestamp: '2 mins ago',
      agent: 'Self-Healing Agent',
      findingType: 'Synthesizing RAP EML Patch',
      severity: 'info',
      payload: { iterations: 1, confidence: 0.98, target: 'i_salesordertp' }
    },
    {
      taskId: 'task-ag-8818',
      timestamp: '3 mins ago',
      agent: 'Unit Test Agent',
      findingType: 'Generated ABAP Unit / Pytest Suites',
      severity: 'info',
      payload: { coverageAchieved: '94.2%', framework: 'pytest & ABAP Unit' }
    }
  ]);

  const addRepository = (newRepoData: Omit<Repository, 'id' | 'lastScanned' | 'healthScore' | 'criticalVulnerabilities' | 'coverage' | 'prsOpen' | 'status'>) => {
    const newRepo: Repository = {
      ...newRepoData,
      id: `repo-${Date.now()}`,
      lastScanned: 'Just now',
      healthScore: 88,
      cleanCoreScore: newRepoData.language === 'abap' ? 78 : undefined,
      criticalVulnerabilities: 1,
      coverage: 76,
      prsOpen: 0,
      status: 'synced',
    };
    setRepositories(prev => [newRepo, ...prev]);
    setSelectedRepo(newRepo);
  };

  const mergePullRequest = (id: string) => {
    setPullRequests(prev => prev.map(pr => pr.id === id ? { ...pr, status: 'merged' } : pr));
  };

  const addPullRequest = (newPr: PullRequest) => {
    setPullRequests(prev => [newPr, ...prev]);
  };

  const addSharedMemoryLog = (log: Omit<SharedMemoryEvent, 'timestamp'>) => {
    const fullLog: SharedMemoryEvent = {
      ...log,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setSharedMemoryLogs(prev => [fullLog, ...prev.slice(0, 40)]);
  };

  const stats = useMemo(() => {
    const totalRepos = repositories.length;
    const activeAgentsCount = agentModules.filter(m => m.status === 'running' || m.status === 'completed').length;
    const prsGeneratedCount = pullRequests.length;
    const issuesFixedCount = pullRequests.reduce((acc, pr) => acc + pr.securitySummary.resolvedIssues, 14);
    const avgCleanCoreScore = 84;
    const avgCoverage = 86.8;
    const autoResolvedRate = 74;

    return {
      totalRepos,
      activeAgentsCount,
      prsGeneratedCount,
      issuesFixedCount,
      avgCleanCoreScore,
      avgCoverage,
      autoResolvedRate,
    };
  }, [repositories, pullRequests, agentModules]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        repositories,
        selectedRepo,
        setSelectedRepo,
        pullRequests,
        findings,
        agentModules,
        sharedMemoryLogs,
        addRepository,
        mergePullRequest,
        addPullRequest,
        addSharedMemoryLog,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
