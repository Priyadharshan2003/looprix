# Looprix Component & Visual Hierarchy Audit

## Executive Summary
This audit inspects every component in the codebase for structural inconsistencies, hardcoded spacing, font family mismatches, arbitrary border radius values, and layout hierarchy weaknesses.

---

## Component-by-Component Analysis

### 1. `Header.tsx`
- **Location**: `src/components/layout/Header.tsx`
- **Structural Issues**: High density command bar structure established, but repository selector dropdown lacks click-outside listener to dismiss menu cleanly.
- **Hardcoded Spacing**: L28 `h-8 px-2`, L73 `h-8 px-3`, L82 `h-8 px-3.5`, L93 `w-8 h-8`. Handcrafted button heights instead of a standardized size token scale (`h-9`, `h-10`).
- **Typography Inconsistencies**: Uses `text-[11px]`, `text-[12px]`, `text-[13px]` interchangeably with `font-display` and `font-sans`.
- **Token Compliance**: Contrast failure on `bg-brand-yellow text-primary-foreground` (L82).

---

### 2. `Sidebar.tsx`
- **Location**: `src/components/layout/Sidebar.tsx`
- **Structural Issues**: Clean minimal navigation layout, collapse transition works well, but collapsed state badges overflow icon bounds if count is 2+ digits.
- **Hardcoded Spacing**: L51 `w-7 h-7`, L94 `w-4 h-4 text-[9px]`, L129 `text-[10px]`.
- **Typography Inconsistencies**: `text-[14px]` (L56), `text-[12px]` (L90), `text-[9px]` (L94).
- **Token Compliance**: Badges on L98-L99 use `text-foreground` on accent background, causing contrast failure in dark mode.

---

### 3. `OverviewView.tsx` (Mission Control Dashboard)
- **Location**: `src/components/dashboard/OverviewView.tsx`
- **Structural Issues**: Excellent 12-column Bento Grid layout structure. Hero masthead section contains hardcoded dark styling invariants.
- **Hardcoded Colors**: L89 `bg-[#0D0D0D] text-white`, L92-L93 inline gradients `rgba(255,216,106,0.08)`, L101 `rgba(255,255,255,0.06)`, L148 `text-black border-black`.
- **Hardcoded Spacing**: L89 `p-6 lg:p-8 rounded-[24px]`, L148 `px-5 py-3 rounded-[14px]`.
- **Typography Inconsistencies**: Hero title uses `text-[26px] lg:text-[32px]` with `font-display leading-[1.1]`. Subtitles mix `text-[13px]`, `text-[11px]`, `text-[14px]`.

---

### 4. `SecurityDashboard.tsx`
- **Location**: `src/components/dashboard/SecurityDashboard.tsx`
- **Structural Issues**: Left column (findings list) and right column (finding detail & remediation code) have asymmetric heights when findings list is long.
- **Hardcoded Spacing**: L55 `px-3 py-1.5 rounded-pill text-[11px]`, L128 `p-4 rounded-[14px]`.
- **Typography Inconsistencies**: L157 uses `font-mono text-[10px]`, L145 uses `font-display text-[13px]`.
- **Token Compliance**: Critical contrast failure on L66 (`bg-brand-yellow text-primary-foreground`) and L134 selected finding card header.

---

### 5. `PullRequestsView.tsx`
- **Location**: `src/components/dashboard/PullRequestsView.tsx`
- **Structural Issues**: High-density PR list and detail view. Excellent before/after coverage delta visualization.
- **Hardcoded Spacing**: L67 `p-4 rounded-[16px]`, L145 `px-5 py-2.5`.
- **Typography Inconsistencies**: PR title uses `text-[13px] font-bold`, coverage delta uses `text-[10px] font-bold`.
- **Token Compliance**: P0 contrast failure on L48 CTA button and L72 selected card.

---

### 6. `ComplianceDashboard.tsx` (Clean Core Governance)
- **Location**: `src/components/dashboard/ComplianceDashboard.tsx`
- **Structural Issues**: Clean layout, clear status cards for S/4HANA readiness.
- **Hardcoded Spacing**: L62 `px-3 py-1.5 rounded-pill text-[11px]`, L135 `p-3.5 rounded-[12px]`.
- **Typography Inconsistencies**: Mix of `font-display` and `font-sans` across card titles.
- **Token Compliance**: Status badge tokens on L26, L35, L53 fail dark mode contrast requirements.

---

### 7. `SelfHealingRunnerView.tsx`
- **Location**: `src/components/dashboard/SelfHealingRunnerView.tsx`
- **Structural Issues**: Multi-agent loop flow visualization present at top. Code diff viewer integrated below.
- **Hardcoded Spacing**: L142 `px-3 py-1.5`, L227 `p-4`, L229 `w-9 h-9 rounded-[10px]`.
- **Typography Inconsistencies**: Language tags use `text-[12px] font-bold`, subtext uses `text-[11px]`.
- **Token Compliance**: Trigger button (L200) suffers P0 white-on-yellow contrast failure in light mode.

---

### 8. `AgentStudioView.tsx`
- **Location**: `src/components/dashboard/AgentStudioView.tsx`
- **Structural Issues**: Horizontal agent module selector grid.
- **Hardcoded Spacing**: L49 `px-3 py-1.5 rounded-pill`, L85 `p-3.5`, L93 `w-8 h-8 rounded-[10px]`.
- **Typography Inconsistencies**: Agent role uses `text-[10px] line-clamp-2`, status uses `text-[9px] font-semibold`.
- **Token Compliance**: Selected agent chip (L91) suffers P0 contrast failure in light mode.

---

### 9. `RepositoryOnboardingView.tsx`
- **Location**: `src/components/dashboard/RepositoryOnboardingView.tsx`
- **Structural Issues**: Grid of onboarded repositories. Connect Repository modal dialog present.
- **Hardcoded Colors / Tokens**: L44 `bg-accent-blue text-white`, L181 `bg-background/80`.
- **Hardcoded Spacing**: L125 `py-2.5 rounded-btn text-[12px]`.
- **Accessibility Violations**: Modal overlay (L181) lacks trap focus and `role="dialog"`.

---

### 10. `SettingsView.tsx`
- **Location**: `src/components/dashboard/SettingsView.tsx`
- **Structural Issues**: Tabbed settings sections (LLM Provider, Auto-Healing Thresholds, System Info).
- **Hardcoded Colors**: L118 `accent-[#FFAE61]`, L142 `accent-[#77DD99]`.
- **Typography Inconsistencies**: Model descriptions use `text-[11px] leading-relaxed`.
- **Token Compliance**: Selected model card (L72) suffers P0 white-on-yellow contrast failure in light mode.

---

### 11. `Common Components` (`Badge.tsx`, `AgentLoopFlow.tsx`, `CleanCoreGauge.tsx`, `CodeDiffViewer.tsx`, `ThemeToggle.tsx`)
- `Badge.tsx`: Uses `text-foreground` on accent background variants (L34-L40), failing dark mode contrast.
- `AgentLoopFlow.tsx`: Hardcoded step icon containers `w-10 h-10 rounded-[12px]`.
- `CleanCoreGauge.tsx`: Radial SVG colors use raw CSS variables without adaptive contrast tokens.
- `ThemeToggle.tsx`: Hardcoded Tailwind colors `dark:bg-gunmetal-700`, `dark:text-cream-50`, `shadow-[3px_3px_0px_#000000]`.
