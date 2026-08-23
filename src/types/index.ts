export type Language = 'abap' | 'typescript' | 'python';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type FindingCategory = 'security' | 'clean_core' | 'performance' | 'refactoring' | 'secret';

export interface SecurityFinding {
  id: string;
  file: string;
  line: number;
  column?: number;
  severity: FindingSeverity;
  category: FindingCategory;
  title: string;
  description: string;
  cwe?: string;
  owaspCategory?: string;
  sapViolationType?: 'direct_table_update' | 'obsolete_api' | 'enhancement_misuse' | 'custom_core_extension' | 'modification';
  vulnerableCode: string;
  remediatedCode: string;
  reasoning: string;
  impact: string;
}

export interface ASTNode {
  type: string;
  name: string;
  line: number;
  children?: ASTNode[];
  meta?: Record<string, any>;
}

export interface ASTOutput {
  functions: { name: string; line: number; complexity: number; params: string[] }[];
  classes: { name: string; methods: string[]; line: number }[];
  imports: string[];
  security_findings: SecurityFinding[];
  rawAST?: ASTNode;
}

export interface AgentModule {
  id: string;
  name: string;
  moduleNumber: number;
  role: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'retrying';
  icon: string;
  supportedLangs: Language[];
  outputType: string;
}

export interface SelfCorrectionStep {
  iteration: number;
  agent: string;
  status: 'running' | 'pass' | 'fail' | 'fixing' | 'validating';
  timestamp: string;
  log: string;
  metrics?: {
    coverage?: number;
    criticalIssues?: number;
    cleanCoreScore?: number;
  };
  diff?: {
    file: string;
    original: string;
    modified: string;
  };
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  description: string;
  repository: string;
  branch: string;
  targetBranch: string;
  author: string;
  createdAt: string;
  status: 'open' | 'merged' | 'closed' | 'validating';
  language: Language;
  riskReport: {
    level: 'Low Risk' | 'Medium Risk' | 'High Risk';
    breakingChanges: boolean;
    regressionRisk: string;
  };
  securitySummary: {
    resolvedIssues: number;
    criticalFixed: number;
    highFixed: number;
    owaspCovered: string[];
  };
  coverageReport: {
    beforeCoverage: number;
    afterCoverage: number;
    testsGenerated: number;
    framework: string;
  };
  cleanCoreScore?: {
    before: number;
    after: number;
  };
  filesChanged: {
    filename: string;
    additions: number;
    deletions: number;
    originalCode: string;
    remediatedCode: string;
    generatedTestCode?: string;
  }[];
  agentLoops: number;
}

export interface Repository {
  id: string;
  name: string;
  provider: 'github' | 'gitlab' | 'azure_devops';
  url: string;
  branch: string;
  language: Language;
  lastScanned: string;
  healthScore: number;
  cleanCoreScore?: number;
  criticalVulnerabilities: number;
  coverage: number;
  prsOpen: number;
  status: 'synced' | 'scanning' | 'healing' | 'idle';
}

export interface SharedMemoryEvent {
  taskId: string;
  timestamp: string;
  agent: string;
  findingType: string;
  severity: FindingSeverity;
  payload: any;
}
