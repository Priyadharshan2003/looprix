import { Repository, SecurityFinding, PullRequest, AgentModule } from '../types';

export const INITIAL_REPOSITORIES: Repository[] = [
  {
    id: 'repo-sap-s4',
    name: 'sap-enterprise-core/s4-order-fulfillment',
    provider: 'github',
    url: 'https://github.com/sap-enterprise-core/s4-order-fulfillment',
    branch: 'main',
    language: 'abap',
    lastScanned: '5 mins ago',
    healthScore: 68,
    cleanCoreScore: 62,
    criticalVulnerabilities: 2,
    coverage: 54,
    prsOpen: 3,
    status: 'synced',
  },
  {
    id: 'repo-ts-pay',
    name: 'fintech-global/checkout-web-service',
    provider: 'gitlab',
    url: 'https://gitlab.com/fintech-global/checkout-web-service',
    branch: 'release/v3.2',
    language: 'typescript',
    lastScanned: '12 mins ago',
    healthScore: 84,
    criticalVulnerabilities: 1,
    coverage: 72,
    prsOpen: 2,
    status: 'synced',
  },
  {
    id: 'repo-py-api',
    name: 'cloud-scale/data-ingestion-fastapi',
    provider: 'azure_devops',
    url: 'https://dev.azure.com/cloud-scale/data-ingestion-fastapi',
    branch: 'master',
    language: 'python',
    lastScanned: '22 mins ago',
    healthScore: 76,
    criticalVulnerabilities: 3,
    coverage: 61,
    prsOpen: 4,
    status: 'synced',
  }
];

export const CODE_SAMPLES = {
  abap: {
    title: 'SAP S/4HANA Sales Order Processing (ABAP)',
    filename: 'zcl_sales_order_processor.clas.abap',
    language: 'abap' as const,
    vulnerableCode: `CLASS zcl_sales_order_processor DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    METHODS process_order IMPORTING iv_vbeln TYPE vbeln_va.
  PRIVATE SECTION.
    METHODS update_legacy_tables.
ENDCLASS.

CLASS zcl_sales_order_processor IMPLEMENTATION.
  METHOD process_order.
    " VIOLATION: Direct Database Table Update (Breaks Clean Core)
    UPDATE vbak SET netwr = netwr * '1.10' WHERE vbeln = iv_vbeln.
    IF sy-subrc <> 0.
      ROLLBACK WORK.
    ENDIF.

    " VIOLATION: Obsolete Function Module Call
    CALL FUNCTION 'CONVERT_TO_LOCAL_CURRENCY'
      EXPORTING
        date             = sy-datum
        foreign_amount   = 1000
        foreign_currency = 'USD'
        local_currency   = 'EUR'
      IMPORTING
        local_amount     = DATA(lv_eur_amount).

    " VIOLATION: Performance - Nested SELECT inside loop
    SELECT vbeln, posnr, matnr FROM vbap INTO TABLE @DATA(lt_items) WHERE vbeln = @iv_vbeln.
    LOOP AT lt_items INTO DATA(ls_item).
      SELECT SINGLE maktx FROM makt INTO @DATA(lv_desc) WHERE matnr = @ls_item-matnr.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.`,
    remediatedCode: `" Remediated by Looprix Self-Healing Agent (Antigravity Clean Core Engine)
CLASS zcl_sales_order_processor DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
    METHODS process_order IMPORTING iv_vbeln TYPE vbeln_va.
ENDCLASS.

CLASS zcl_sales_order_processor IMPLEMENTATION.
  METHOD process_order.
    " CLEAN CORE COMPLIANT: Use ABAP RESTful Application Programming (RAP) EML
    MODIFY ENTITIES OF i_salesordertp
      ENTITY SalesOrder
        UPDATE FIELDS ( TotalNetAmount )
        WITH VALUE #( ( SalesOrder = iv_vbeln
                        TotalNetAmount = 1100 ) )
      FAILED DATA(lt_failed)
      REPORTED DATA(lt_reported).

    " CLEAN CORE COMPLIANT: Use Released CDS View for Currency Conversion
    SELECT SINGLE converted_amount 
      FROM i_currencyconversion( 
             p_displaycurrency = 'EUR', 
             p_exchangeratetype = 'M', 
             p_amount = 1000, 
             p_sourcecurrency = 'USD', 
             p_exchangeratedate = @sy-datum )
      INTO @DATA(lv_eur_amount).

    " HIGH PERFORMANCE: Single Joined CDS Query (Zero Nested SELECTs)
    SELECT item~salesorder, item~salesorderitem, item~material, text~materialname
      FROM i_salesorderitemtp AS item
      LEFT OUTER JOIN i_materialtext AS text 
        ON text~material = item~material 
       AND text~language = @sy-langu
      WHERE item~salesorder = @iv_vbeln
      INTO TABLE @DATA(lt_items_optimized).
  ENDMETHOD.
ENDCLASS.`,
    generatedTests: `CLASS ltcl_sales_order_test DEFINITION FINAL FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    DATA mo_cut TYPE REF TO zcl_sales_order_processor.
    METHODS setup.
    METHODS test_clean_core_rap_execution FOR TESTING.
    METHODS test_currency_cds_conversion FOR TESTING.
ENDCLASS.

CLASS ltcl_sales_order_test IMPLEMENTATION.
  METHOD setup.
    mo_cut = NEW #( ).
  ENDMETHOD.

  METHOD test_clean_core_rap_execution.
    " Validate RAP transaction execution without direct table mutations
    mo_cut->process_order( iv_vbeln = '0000000101' ).
    cl_abap_unit_assert=>assert_equals(
      act = sy-subrc
      exp = 0
      msg = 'RAP Sales Order processing succeeded' ).
  ENDMETHOD.

  METHOD test_currency_cds_conversion.
    " Validate CDS conversion logic
    cl_abap_unit_assert=>assert_true(
      act = abap_true
      msg = 'CDS Currency view resolved within SLA' ).
  ENDMETHOD.
ENDCLASS.`,
    findings: [
      {
        id: 'f-abap-1',
        file: 'zcl_sales_order_processor.clas.abap',
        line: 11,
        severity: 'critical' as const,
        category: 'clean_core' as const,
        title: 'SAP Clean Core: Direct Database Table Mutation',
        description: 'Direct SQL UPDATE/INSERT on VBAK table bypasses S/4HANA Extensibility framework and locks cloud upgrades.',
        sapViolationType: 'direct_table_update' as const,
        vulnerableCode: "UPDATE vbak SET netwr = netwr * '1.10' WHERE vbeln = iv_vbeln.",
        remediatedCode: 'MODIFY ENTITIES OF i_salesordertp ENTITY SalesOrder UPDATE ...',
        reasoning: 'Direct table writes corrupt business object invariants and fail SAP Cloud Clean Core certification.',
        impact: 'Breaks S/4HANA Cloud upgrade compatibility and triggers compliance failure.'
      },
      {
        id: 'f-abap-2',
        file: 'zcl_sales_order_processor.clas.abap',
        line: 17,
        severity: 'high' as const,
        category: 'clean_core' as const,
        title: 'Use of Obsolete / Unreleased Function Module',
        description: 'CONVERT_TO_LOCAL_CURRENCY is deprecated in SAP BTP / S/4HANA Cloud and non-released for ABAP Cloud.',
        sapViolationType: 'obsolete_api' as const,
        vulnerableCode: "CALL FUNCTION 'CONVERT_TO_LOCAL_CURRENCY'",
        remediatedCode: 'SELECT SINGLE converted_amount FROM i_currencyconversion(...)',
        reasoning: 'Deprecated APIs are blocked in tier-1 cloud development profiles.',
        impact: 'Code will fail syntax check on S/4HANA Private/Public Cloud runtime.'
      },
      {
        id: 'f-abap-3',
        file: 'zcl_sales_order_processor.clas.abap',
        line: 28,
        severity: 'medium' as const,
        category: 'performance' as const,
        title: 'N+1 Query / Nested SELECT in Loop',
        description: 'Executing SELECT SINGLE inside LOOP AT causes severe HANA database round-trip overhead.',
        vulnerableCode: 'LOOP AT lt_items INTO DATA(ls_item).\n  SELECT SINGLE maktx FROM makt ...\nENDLOOP.',
        remediatedCode: 'SELECT item~salesorder, text~materialname FROM i_salesorderitemtp LEFT JOIN ...',
        reasoning: 'Batching or JOIN eliminates database context switches.',
        impact: 'Reduces database execution latency by 82% under peak transaction load.'
      }
    ]
  },
  typescript: {
    title: 'Fintech Payment Gateway & User Checkout (TypeScript)',
    filename: 'src/services/checkoutService.ts',
    language: 'typescript' as const,
    vulnerableCode: `import axios from 'axios';

// VIOLATION: Hardcoded Production Secret
const STRIPE_SECRET_KEY = 'sk_test_mock_valid_key_123';

export class CheckoutService {
  async processPayment(userPayload: { amount: number; cardToken: string; notes: string }) {
    // VIOLATION: XSS Vulnerability - Raw HTML Injection
    const receiptContainer = document.getElementById('receipt-box');
    if (receiptContainer) {
      receiptContainer.innerHTML = \`<div class="note">\${userPayload.notes}</div>\`;
    }

    // VIOLATION: Unsanitized Axios Request
    const response = await axios.post(
      'https://api.stripe.com/v1/charges',
      {
        amount: userPayload.amount,
        currency: 'usd',
        source: userPayload.cardToken,
      },
      {
        headers: { Authorization: \`Bearer \${STRIPE_SECRET_KEY}\` }
      }
    );
    return response.data;
  }
}`,
    remediatedCode: `import axios from 'axios';
import DOMPurify from 'dompurify';

export class CheckoutService {
  private readonly stripeApiKey: string;

  constructor() {
    // SECURED: Loaded securely from environment variables with runtime assertion
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('FATAL: STRIPE_SECRET_KEY environment variable is not defined');
    }
    this.stripeApiKey = key;
  }

  async processPayment(userPayload: { amount: number; cardToken: string; notes: string }) {
    // SECURED: Sanitize input with DOMPurify to eliminate XSS / Script injection
    const receiptContainer = document.getElementById('receipt-box');
    if (receiptContainer) {
      const sanitizedNotes = DOMPurify.sanitize(userPayload.notes);
      receiptContainer.textContent = sanitizedNotes;
    }

    // SECURED: Authenticated API call using environment secret
    const response = await axios.post(
      'https://api.stripe.com/v1/charges',
      {
        amount: Math.round(userPayload.amount * 100), // Standardize cents
        currency: 'usd',
        source: userPayload.cardToken,
      },
      {
        headers: {
          Authorization: \`Bearer \${this.stripeApiKey}\`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  }
}`,
    generatedTests: `import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheckoutService } from './checkoutService';
import axios from 'axios';

vi.mock('axios');

describe('CheckoutService Self-Healed Security & Logic Tests', () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock_valid_key_123';
    document.body.innerHTML = '<div id="receipt-box"></div>';
    vi.clearAllMocks();
  });

  it('should throw error if STRIPE_SECRET_KEY is missing', () => {
    delete process.env.STRIPE_SECRET_KEY;
    expect(() => new CheckoutService()).toThrowError(/STRIPE_SECRET_KEY/);
  });

  it('should sanitize malicious script tags in notes to prevent XSS (OWASP A03)', async () => {
    const service = new CheckoutService();
    const maliciousPayload = {
      amount: 49.99,
      cardToken: 'tok_visa',
      notes: '<script>alert(document.cookie)</script>Payment for Order #104'
    };

    (axios.post as any).mockResolvedValueOnce({ data: { id: 'ch_123', status: 'succeeded' } });

    await service.processPayment(maliciousPayload);
    const box = document.getElementById('receipt-box');
    expect(box?.innerHTML).not.toContain('<script>');
  });

  it('should securely call Stripe charges endpoint with env token', async () => {
    const service = new CheckoutService();
    (axios.post as any).mockResolvedValueOnce({ data: { id: 'ch_999' } });

    const result = await service.processPayment({ amount: 10, cardToken: 'tok_123', notes: 'Tip' });
    expect(result.id).toBe('ch_999');
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.stripe.com/v1/charges',
      expect.objectContaining({ amount: 1000, currency: 'usd' }),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer sk_test_mock_valid_key_123' })
      })
    );
  });
});`,
    findings: [
      {
        id: 'f-ts-1',
        file: 'src/services/checkoutService.ts',
        line: 4,
        severity: 'critical' as const,
        category: 'secret' as const,
        title: 'Hardcoded Stripe Live Secret Key',
        description: 'Exposing live API secrets in client-side / repo source enables unauthorized financial transactions.',
        cwe: 'CWE-798',
        owaspCategory: 'A07:2021 Identification and Authentication Failures',
        vulnerableCode: "const STRIPE_SECRET_KEY = 'sk_test_mock_valid_key_123';",
        remediatedCode: 'const key = process.env.STRIPE_SECRET_KEY;',
        reasoning: 'Secrets must be injected securely via runtime environment and KMS vaults.',
        impact: 'Zero-day credential leak, potential catastrophic PCI-DSS compliance failure.'
      },
      {
        id: 'f-ts-2',
        file: 'src/services/checkoutService.ts',
        line: 11,
        severity: 'high' as const,
        category: 'security' as const,
        title: 'Cross-Site Scripting (XSS) via innerHTML Injection',
        description: 'Unsanitized user payload injected into DOM allows attackers to execute arbitrary JavaScript.',
        cwe: 'CWE-79',
        owaspCategory: 'A03:2021 Injection',
        vulnerableCode: 'receiptContainer.innerHTML = `<div class="note">${userPayload.notes}</div>`;',
        remediatedCode: 'receiptContainer.textContent = DOMPurify.sanitize(userPayload.notes);',
        reasoning: 'Use textContent or DOMPurify to neutralize script injection vectors.',
        impact: 'Session hijacking, token theft, and DOM tampering.'
      }
    ]
  },
  python: {
    title: 'FastAPI Data Ingestion & SQL Query Engine (Python)',
    filename: 'app/api/v1/endpoints/analytics.py',
    language: 'python' as const,
    vulnerableCode: `from fastapi import APIRouter, Depends, HTTPException
import psycopg2
import os

router = APIRouter()

# VIOLATION: Hardcoded Database Connection String
DB_CONN = "postgresql://postgres:Admin1234!@prod-db.internal:5432/analytics_db"

@router.get("/user-activity")
def get_user_activity(user_id: str, date_filter: str):
    conn = psycopg2.connect(DB_CONN)
    cursor = conn.cursor()

    # VIOLATION: SQL Injection (OWASP A03)
    query = f"SELECT * FROM user_events WHERE user_id = '{user_id}' AND created_at >= '{date_filter}'"
    cursor.execute(query)
    records = cursor.fetchall()

    # VIOLATION: Resource Leak (Cursor & Conn not closed)
    return {"status": "success", "count": len(records), "data": records}
`,
    remediatedCode: `from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/user-activity", status_code=status.HTTP_200_OK)
def get_user_activity(
    user_id: str, 
    date_filter: str, 
    db: Session = Depends(get_db)
):
    """
    Remediated by Looprix Self-Healing Agent:
    - Parameterized SQL execution to prevent SQL Injection
    - Managed connection pool via SQLAlchemy Session dependency
    - Automated query boundary limits
    """
    try:
        # SECURED: Parameterized query prevents SQL Injection attacks
        stmt = text(
            """
            SELECT id, user_id, event_type, payload, created_at
            FROM user_events
            WHERE user_id = :user_id AND created_at >= :date_filter
            ORDER BY created_at DESC
            LIMIT 500
            """
        )
        result = db.execute(stmt, {"user_id": user_id, "date_filter": date_filter})
        records = [dict(row._mapping) for row in result.fetchall()]

        return {
            "status": "success",
            "count": len(records),
            "data": records
        }
    except Exception as e:
        logger.error(f"Database query failed for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve analytics event data safely."
        )
`,
    generatedTests: `import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from app.main import app
from app.db.session import get_db

client = TestClient(app)

@pytest.fixture
def mock_db():
    db = MagicMock()
    return db

def test_sql_injection_payload_is_neutralized(mock_db):
    """Verify that malicious SQL payloads like ' OR 1=1;-- are handled as literal params"""
    app.dependency_overrides[get_db] = lambda: mock_db
    mock_db.execute.return_value.fetchall.return_value = []

    malicious_user = "admin' OR '1'='1"
    response = client.get(f"/user-activity?user_id={malicious_user}&date_filter=2026-01-01")
    
    assert response.status_code == 200
    # Ensure execute was called with parametrized dictionary
    args, kwargs = mock_db.execute.call_args
    assert kwargs == {} or args[1] == {"user_id": malicious_user, "date_filter": "2026-01-01"}

def test_user_activity_happy_path(mock_db):
    app.dependency_overrides[get_db] = lambda: mock_db
    mock_row = MagicMock()
    mock_row._mapping = {"id": 1, "user_id": "usr_99", "event_type": "checkout", "created_at": "2026-08-20"}
    mock_db.execute.return_value.fetchall.return_value = [mock_row]

    response = client.get("/user-activity?user_id=usr_99&date_filter=2026-08-01")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 1
    assert data["data"][0]["user_id"] == "usr_99"
`,
    findings: [
      {
        id: 'f-py-1',
        file: 'app/api/v1/endpoints/analytics.py',
        line: 14,
        severity: 'critical' as const,
        category: 'security' as const,
        title: 'CWE-89: SQL Injection via Formatted String Query',
        description: 'Direct string interpolation in SQL command allows complete database exfiltration and command execution.',
        cwe: 'CWE-89',
        owaspCategory: 'A03:2021 Injection',
        vulnerableCode: 'query = f"SELECT * FROM user_events WHERE user_id = \'{user_id}\' AND created_at >= \'{date_filter}\'"',
        remediatedCode: 'stmt = text("SELECT ... WHERE user_id = :user_id AND created_at >= :date_filter")',
        reasoning: 'Always bind variables via parameterized statement drivers.',
        impact: 'Full arbitrary database write/dump privilege escalation.'
      },
      {
        id: 'f-py-2',
        file: 'app/api/v1/endpoints/analytics.py',
        line: 8,
        severity: 'critical' as const,
        category: 'secret' as const,
        title: 'Hardcoded Production Database Credentials',
        description: 'PostgreSQL connection string with plaintext password embedded in source code.',
        cwe: 'CWE-798',
        vulnerableCode: 'DB_CONN = "postgresql://postgres:Admin1234!@prod-db.internal:5432/analytics_db"',
        remediatedCode: 'db: Session = Depends(get_db) # injected from secure vault',
        reasoning: 'Database credentials must be managed via secrets managers and connection pooling.',
        impact: 'Direct lateral network access to production relational database.'
      }
    ]
  }
};

export const INITIAL_PULL_REQUESTS: PullRequest[] = [
  {
    id: 'pr-104',
    number: 104,
    title: 'Fix: SQL Injection & Hardcoded Database Credentials in Analytics Service',
    description: `### Autonomous Remediation by Looprix
This pull request addresses **2 Critical Vulnerabilities** identified by the Antigravity Multi-Agent Pipeline.

#### Summary of Changes:
- **Security**: Replaced vulnerable f-string SQL query with parameterized SQLAlchemy \`text()\` execution.
- **Secrets**: Removed hardcoded production PostgreSQL credentials in favor of managed dependency injection.
- **Testing**: Generated 100% covered pytest test suite validating injection neutralization.
- **Validation**: Passed all AST static analysis and automated unit test assertions.

#### Verification Loop:
- Iterations: 1 loop (0 retries required)
- Final Coverage: **94.2%**
- Critical Issues Remaining: **0**`,
    repository: 'cloud-scale/data-ingestion-fastapi',
    branch: 'looprix/fix-sql-injection-sec-104',
    targetBranch: 'master',
    author: 'Looprix Autonomous Agent [bot]',
    createdAt: '18 mins ago',
    status: 'open',
    language: 'python',
    riskReport: {
      level: 'Low Risk',
      breakingChanges: false,
      regressionRisk: 'Zero breaking signature changes. Backwards compatible API responses.'
    },
    securitySummary: {
      resolvedIssues: 2,
      criticalFixed: 2,
      highFixed: 0,
      owaspCovered: ['A03:2021 - Injection', 'A07:2021 - Identification & Auth']
    },
    coverageReport: {
      beforeCoverage: 58.4,
      afterCoverage: 94.2,
      testsGenerated: 4,
      framework: 'pytest'
    },
    filesChanged: [
      {
        filename: 'app/api/v1/endpoints/analytics.py',
        additions: 38,
        deletions: 16,
        originalCode: CODE_SAMPLES.python.vulnerableCode,
        remediatedCode: CODE_SAMPLES.python.remediatedCode,
        generatedTestCode: CODE_SAMPLES.python.generatedTests
      }
    ],
    agentLoops: 1
  },
  {
    id: 'pr-103',
    number: 103,
    title: 'Fix: S/4HANA Clean Core Direct Table Update & CDS Query Optimization',
    description: `### Autonomous Remediation by Looprix
Remediated SAP Clean Core violations and obsolete function module dependencies.

#### Key Enhancements:
- **Clean Core Compliance**: Migrated direct \`UPDATE vbak\` table mutations to ABAP RESTful Application Programming (RAP) EML.
- **Cloud Readiness**: Replaced unreleased \`CONVERT_TO_LOCAL_CURRENCY\` with released CDS view \`i_currencyconversion\`.
- **Performance**: Consolidated nested SELECT in loop into a single high-performance CDS joined query.
- **Quality**: Generated comprehensive \`ltcl_sales_order_test\` ABAP Unit test class.`,
    repository: 'sap-enterprise-core/s4-order-fulfillment',
    branch: 'looprix/clean-core-remediation-abap-103',
    targetBranch: 'main',
    author: 'Looprix Autonomous Agent [bot]',
    createdAt: '1 hour ago',
    status: 'open',
    language: 'abap',
    riskReport: {
      level: 'Low Risk',
      breakingChanges: false,
      regressionRisk: 'Transactional integrity maintained via RAP execution engine.'
    },
    securitySummary: {
      resolvedIssues: 3,
      criticalFixed: 1,
      highFixed: 1,
      owaspCovered: ['SAP Clean Core Tier-1 Standard']
    },
    cleanCoreScore: {
      before: 62,
      after: 96
    },
    coverageReport: {
      beforeCoverage: 44.0,
      afterCoverage: 88.5,
      testsGenerated: 3,
      framework: 'ABAP Unit'
    },
    filesChanged: [
      {
        filename: 'zcl_sales_order_processor.clas.abap',
        additions: 44,
        deletions: 28,
        originalCode: CODE_SAMPLES.abap.vulnerableCode,
        remediatedCode: CODE_SAMPLES.abap.remediatedCode,
        generatedTestCode: CODE_SAMPLES.abap.generatedTests
      }
    ],
    agentLoops: 2
  },
  {
    id: 'pr-102',
    number: 102,
    title: 'Fix: DOM XSS Vulnerability & Hardcoded Stripe Secret in Checkout Service',
    description: `### Autonomous Remediation by Looprix
Neutralized Cross-Site Scripting attack vector and safely externalized production Stripe credentials.

#### Fix Details:
- Enforced \`DOMPurify\` sanitization on user-supplied receipt notes.
- Extracted hardcoded \`sk_live\` token to runtime \`process.env\` with startup assertions.
- Added comprehensive Vitest suite verifying anti-XSS boundary defense.`,
    repository: 'fintech-global/checkout-web-service',
    branch: 'looprix/sec-patch-dompurify-ts-102',
    targetBranch: 'release/v3.2',
    author: 'Looprix Autonomous Agent [bot]',
    createdAt: '3 hours ago',
    status: 'merged',
    language: 'typescript',
    riskReport: {
      level: 'Low Risk',
      breakingChanges: false,
      regressionRisk: 'No frontend layout regressions detected.'
    },
    securitySummary: {
      resolvedIssues: 2,
      criticalFixed: 1,
      highFixed: 1,
      owaspCovered: ['A03:2021 - Injection (XSS)', 'A07:2021 - Identification & Auth']
    },
    coverageReport: {
      beforeCoverage: 65.0,
      afterCoverage: 91.8,
      testsGenerated: 3,
      framework: 'Vitest / Jest'
    },
    filesChanged: [
      {
        filename: 'src/services/checkoutService.ts',
        additions: 29,
        deletions: 14,
        originalCode: CODE_SAMPLES.typescript.vulnerableCode,
        remediatedCode: CODE_SAMPLES.typescript.remediatedCode,
        generatedTestCode: CODE_SAMPLES.typescript.generatedTests
      }
    ],
    agentLoops: 1
  }
];

export const AGENT_MODULES: AgentModule[] = [
  {
    id: 'agent-repo',
    moduleNumber: 1,
    name: 'Repository Onboarding',
    role: 'Repo Ingestion & Graph Indexer',
    description: 'Clones repos, indexes branch topology, parses dependency manifests and builds AST project graphs.',
    status: 'completed',
    icon: 'GitBranch',
    supportedLangs: ['abap', 'typescript', 'python'],
    outputType: 'Project Graph & AST Stream'
  },
  {
    id: 'agent-ast',
    moduleNumber: 2,
    name: 'AST Parsing Engine',
    role: 'Syntax Tree & Semantic Extractor',
    description: 'Converts SAP ABAP, TypeScript, and Python source code into machine-analyzable syntax structures.',
    status: 'completed',
    icon: 'Binary',
    supportedLangs: ['abap', 'typescript', 'python'],
    outputType: 'Functions, Classes, Imports & Symbols'
  },
  {
    id: 'agent-orchestrator',
    moduleNumber: 3,
    name: 'Agent Orchestrator',
    role: 'Antigravity Dynamic Scheduler',
    description: 'Coordinates agent state machines, handles context routing, retry limits (<= 5 loops) and shared memory.',
    status: 'running',
    icon: 'Cpu',
    supportedLangs: ['abap', 'typescript', 'python'],
    outputType: 'Task Execution Graph & Memory Traces'
  },
  {
    id: 'agent-security',
    moduleNumber: 4,
    name: 'Security Agent',
    role: 'OWASP & Secret Guardian',
    description: 'Detects Injection, SSRF, XSS, CSRF, broken authentication, and exposed tokens/API keys.',
    status: 'completed',
    icon: 'ShieldAlert',
    supportedLangs: ['abap', 'typescript', 'python'],
    outputType: 'Vulnerability Findings & CWEs'
  },
  {
    id: 'agent-clean-core',
    moduleNumber: 5,
    name: 'Clean Core Agent',
    role: 'SAP Cloud Governance Specialist',
    description: 'Analyzes direct table updates, obsolete APIs, enhancement abuse, and computes Clean Core Score (0-100).',
    status: 'completed',
    icon: 'Sparkles',
    supportedLangs: ['abap'],
    outputType: 'Clean Core Score & Violation Tree'
  },
  {
    id: 'agent-perf',
    moduleNumber: 6,
    name: 'Performance Agent',
    role: 'Runtime & Query Optimizer',
    description: 'Spots N+1 queries, nested SELECTs, memory leaks, unmemoized React trees, and expensive loops.',
    status: 'completed',
    icon: 'Zap',
    supportedLangs: ['abap', 'typescript', 'python'],
    outputType: 'Latency Bottlenecks & Query Plans'
  },
  {
    id: 'agent-refactor',
    moduleNumber: 7,
    name: 'Refactoring Agent',
    role: 'Clean Code Architect',
    description: 'Reduces cyclomatic complexity, enforces SOLID design principles, and modernizes legacy syntax.',
    status: 'completed',
    icon: 'Wrench',
    supportedLangs: ['abap', 'typescript', 'python'],
    outputType: 'Refactoring Blueprints'
  },
  {
    id: 'agent-self-heal',
    moduleNumber: 8,
    name: 'Self-Healing Agent',
    role: 'Autonomous Code Remediation',
    description: 'Consumes findings from Security, Compliance & Performance agents to generate verified code patches.',
    status: 'completed',
    icon: 'Activity',
    supportedLangs: ['abap', 'typescript', 'python'],
    outputType: 'Unified Patch & Before/After Code Diffs'
  },
  {
    id: 'agent-test',
    moduleNumber: 9,
    name: 'Unit Test Agent',
    role: 'Test Generator (Target 80%+)',
    description: 'Synthesizes high-coverage tests in pytest, Jest/Vitest, and ABAP Unit to validate behavior and edge cases.',
    status: 'completed',
    icon: 'CheckSquare',
    supportedLangs: ['abap', 'typescript', 'python'],
    outputType: 'Test Suites with 80%+ Target Coverage'
  },
  {
    id: 'agent-validation',
    moduleNumber: 10,
    name: 'Validation Agent',
    role: 'Gatekeeper & Self-Correction Evaluator',
    description: 'Executes static analysis, linter runs, test execution, and checks: Coverage >= 80% and Critical Issues = 0.',
    status: 'completed',
    icon: 'CheckCircle2',
    supportedLangs: ['abap', 'typescript', 'python'],
    outputType: 'PASS / FAIL Loop Trigger'
  },
  {
    id: 'agent-pr',
    moduleNumber: 11,
    name: 'Pull Request Agent',
    role: 'Git Automation & PR Publisher',
    description: 'Creates branches, writes comprehensive risk & security reports, diff summaries, and opens Git PRs.',
    status: 'completed',
    icon: 'GitPullRequest',
    supportedLangs: ['abap', 'typescript', 'python'],
    outputType: 'Production-Ready Pull Request'
  }
];
