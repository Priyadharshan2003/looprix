import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Cloud,
  CheckCircle2,
  Layers,
  RefreshCw,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CleanCoreGauge } from '../common/CleanCoreGauge';
import { Badge } from '../common/Badge';

export const ComplianceDashboard: React.FC = () => {
  const { setActiveTab } = useApp();

  const violations = [
    {
      title: 'Direct Database Table Mutation (VBAK)',
      type: 'DIRECT_TABLE_WRITE',
      severity: 'critical' as const,
      object: 'zcl_sales_order_processor.clas.abap',
      remediation: 'Migrate to ABAP RAP EML (MODIFY ENTITIES OF i_salesordertp)',
      status: 'Auto-Healed in PR #103',
      statusColor: 'bg-accent-green text-accent-green-fg',
    },
    {
      title: 'Unreleased Legacy Function Module',
      type: 'OBSOLETE_API',
      severity: 'high' as const,
      object: 'CONVERT_TO_LOCAL_CURRENCY',
      remediation: 'Use released CDS View i_currencyconversion',
      status: 'Auto-Healed in PR #103',
      statusColor: 'bg-accent-green text-accent-green-fg',
    },
    {
      title: 'Database Access in Loop (N+1 Query)',
      type: 'HANA_PERFORMANCE',
      severity: 'medium' as const,
      object: 'SELECT SINGLE maktx inside LOOP AT lt_items',
      remediation: 'Batch query with CDS View JOIN (i_salesorderitemtp)',
      status: 'Optimized',
      statusColor: 'bg-accent-blue text-accent-blue-fg',
    },
    {
      title: 'Implicit Enhancement on SAP Standard Code',
      type: 'MODIFICATION_RISK',
      severity: 'high' as const,
      object: 'ENHANCEMENT 1 ZSD_ORDER_CHECK',
      remediation: 'Refactor to Developer Extensibility (BAdI BADI_SD_SALES_BASIC)',
      status: 'Queued in Agent Memory',
      statusColor: 'bg-accent-orange text-accent-orange-fg',
    },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* ══ Header ════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-accent-orange text-accent-orange-fg border-2 border-border-strong text-[11px] font-semibold shadow-brutal-sm mb-2 font-display">
            <FileCheck2 className="w-3.5 h-3.5" />
            SAP Clean Core Governance
          </div>
          <h2 className="text-2xl font-bold text-foreground font-display tracking-tight leading-tight">
            SAP S/4HANA Clean Core Compliance
          </h2>
          <p className="text-sm text-muted-foreground">
            Automated enforcement of SAP Clean Core principles, cloud upgradeability, and RAP migration.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('self-healing')}
          className="nb-btn px-4 py-2.5 bg-accent-green text-accent-green-fg text-sm flex items-center gap-2 self-start shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          Run Clean Core Remediator
        </button>
      </div>

      {/* ══ Top 3 Metric Cards ════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Clean Core Score Gauge */}
        <div className="nb-card-static p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-[13px] font-bold text-foreground font-display mb-1">Clean Core Score</h3>
          <p className="text-[11px] text-muted-foreground mb-4">S/4HANA cloud compliance meter</p>
          <CleanCoreGauge score={84} size="lg" />
          <p className="text-[10px] text-muted-foreground mt-4 font-medium">
            Target: Tier 1 ≥ 90%
          </p>
        </div>

        {/* Cloud Extensibility */}
        <div className="nb-card-static p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-foreground font-display">Cloud Extensibility</h3>
              <Cloud className="w-5 h-5 text-accent-cyan" />
            </div>
            <div className="text-4xl font-bold text-foreground font-display tracking-tight">92.4%</div>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Extensions using released C1 APIs and ABAP CDS contracts.
            </p>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t-2 border-border text-[12px]">
            {[
              { label: 'RAP / EML Adoption', value: '88%', color: 'text-accent-green' },
              { label: 'Released CDS Views', value: '96%', color: 'text-accent-cyan' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={`font-bold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modification Avoidance */}
        <div className="nb-card-static p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-foreground font-display">Modification Avoidance</h3>
              <ShieldCheck className="w-5 h-5 text-accent-green" />
            </div>
            <div className="text-3xl font-bold text-accent-green font-display tracking-tight">
              0 Violations
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Zero direct core SAP table updates or unreleased user exits active.
            </p>
          </div>

          <div className="mt-4 p-3.5 rounded-[12px] bg-accent-green text-accent-green-fg border-2 border-border-strong flex items-center gap-2.5 shadow-brutal-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-semibold font-display">Ready for S/4HANA 2026 Cloud Upgrades</span>
          </div>
        </div>
      </div>

      {/* ══ Policy Violation Table ════════════════════ */}
      <div className="nb-card-static p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-border">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent-orange" />
            <h3 className="text-[14px] font-bold text-foreground font-display">
              SAP Clean Core Policy Audit
            </h3>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-pill border border-border">
            {violations.length} active audits
          </span>
        </div>

        <div className="divide-y-2 divide-border">
          {violations.map((v, idx) => (
            <div
              key={idx}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-secondary -mx-2 px-2 rounded-[12px] transition-all"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge severity={v.severity} size="sm">
                    {v.type.replace('_', ' ')}
                  </Badge>
                  <h4 className="text-[13px] font-semibold text-foreground font-display truncate">
                    {v.title}
                  </h4>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono truncate">
                  Object: {v.object}
                </p>
                <p className="text-[11px] text-accent-blue font-medium">
                  Fix: {v.remediation}
                </p>
              </div>

              <div className="shrink-0">
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-pill border-2 border-border-strong shadow-brutal-sm ${v.statusColor}`}>
                  {v.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
