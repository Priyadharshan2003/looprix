# Looprix Systemic Repair & Refactoring Plan

## Executive Summary
This document defines the strict, phase-by-phase execution plan to resolve all P0 theme system failures, P1 accessibility/WCAG violations, and P2 visual inconsistencies identified across the audits.

**Rule**: Repair incrementally. Run validation (`npm run build`, token grep, contrast checks) after EVERY phase. DO NOT proceed to the next phase until the previous phase passes 100%.

---

## Priority Scale & Phasing Overview

```
Phase 1 (P0): Core Design Tokens & Contrast Fixes
  │── Fix theme.css token pairing architecture
  └── Fix white-on-yellow & dark-mode badge contrast failures (P0)

Phase 2 (P0): Hardcoded Colors & Legacy Theme Class Elimination
  │── Purge all remaining hardcoded hex, RGB, and Tailwind colors
  └── Standardize Hero section & ThemeToggle component design tokens

Phase 3 (P1): Accessibility & WCAG AA Compliance
  │── Add missing aria-labels to icon buttons & interactive controls
  ├── Add visible focus rings across button system (.nb-btn, .agent-chip)
  └── Implement ARIA attributes & accessibility semantics for dialogs/inputs

Phase 4 (P2): Spacing, Typography & Visual Standardization
  │── Standardize spacing classes & border radius variables
  └── Synchronize font size & weight hierarchies across all views

Phase 5: Automated & Visual Multi-Mode Validation
  ├── Run full TypeScript & Vite build checks
  ├── Run hardcoded color grep scan (Goal: 0 matches)
  └── Validate Light, Dark, and System modes with screenshot subagent
```

---

## Phase 1 (P0): Core Design Tokens & Contrast Architecture

### Objectives
1. Fix contrast failure on `#FFD86A` (Brand Yellow). Define a non-negotiable fixed dark foreground token:
   `--brand-yellow-foreground: #101010` in BOTH light and dark modes.
2. Define adaptive accent foreground tokens in `theme.css`:
   - `--accent-red-foreground: #ffffff` (Light) / `#101010` (Dark)
   - `--accent-green-foreground: #101010` (Light) / `#101010` (Dark)
   - `--accent-orange-foreground: #101010` (Light) / `#101010` (Dark)
   - `--accent-blue-foreground: #ffffff` (Light) / `#101010` (Dark)
   - `--accent-purple-foreground: #ffffff` (Light) / `#101010` (Dark)
   - `--accent-cyan-foreground: #101010` (Light) / `#101010` (Dark)
3. Update `tailwind.config.js` to map these exact contrast foreground tokens.
4. Refactor all buttons, badges, and selected card states using `bg-brand-yellow` to use `text-brand-yellow-foreground` (Fixes 1.38:1 contrast failure).

### Target Files
- `src/styles/theme.css`
- `tailwind.config.js`
- `src/components/common/Badge.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/dashboard/SecurityDashboard.tsx`
- `src/components/dashboard/PullRequestsView.tsx`
- `src/components/dashboard/SelfHealingRunnerView.tsx`
- `src/components/dashboard/SettingsView.tsx`
- `src/components/dashboard/AgentStudioView.tsx`

---

## Phase 2 (P0): Hardcoded Colors & Legacy Theme Class Elimination

### Objectives
1. Refactor `src/index.css`:
   - Replace `#101010` in `.nb-btn-primary`, `.nb-nav-item.active`, `.timeline-step.active`, `.timeline-step.completed`, `::selection` with CSS tokens (`var(--brand-yellow-foreground)` or `var(--border-strong)`).
   - Replace `0 0 10px rgba(104, 212, 138, 0.4)` with `var(--shadow-glow-green)`.
2. Refactor `OverviewView.tsx` Hero masthead:
   - Define semantic hero tokens (`--hero-bg: #0D0D0D`, `--hero-fg: #ffffff`, `--hero-muted: rgba(255,255,255,0.6)`).
   - Eliminate hardcoded `text-black border-black` on CTA button.
3. Refactor `ThemeToggle.tsx`:
   - Replace legacy Tailwind classes (`dark:bg-gunmetal-700`, `dark:text-cream-50`, `shadow-[3px_3px_0px_#000000]`, `text-[#3BA7B6]`, `text-[#E2953B]`) with standard design tokens (`bg-card`, `text-foreground`, `shadow-brutal-sm`, `text-accent-cyan`, `text-accent-orange`).
4. Refactor slider inputs in `SettingsView.tsx` L118, L142 (`accent-[#FFAE61]`, `accent-[#77DD99]`).

### Target Files
- `src/index.css`
- `src/styles/theme.css`
- `src/components/dashboard/OverviewView.tsx`
- `src/components/common/ThemeToggle.tsx`
- `src/components/dashboard/SettingsView.tsx`
- `src/components/dashboard/RepositoryOnboardingView.tsx`

---

## Phase 3 (P1): Accessibility & WCAG AA Compliance

### Objectives
1. Add explicit `aria-label` attributes to all icon buttons:
   - `Sidebar.tsx` (L61, L77 collapse buttons)
   - `Header.tsx` (L28 mobile menu, L93 bell, L133 close notification)
   - `ThemeToggle.tsx` (L10 theme button)
   - `RepositoryOnboardingView.tsx` (L55 connect, L185 close modal, L270, L277)
   - `CodeDiffViewer.tsx` (L50 copy, L60 split view, L71 unified view)
   - Views action buttons (`SecurityDashboard.tsx`, `PullRequestsView.tsx`, `SelfHealingRunnerView.tsx`, `OverviewView.tsx`, `ComplianceDashboard.tsx`, `AgentStudioView.tsx`)
2. Enhance Focus Ring Visibility in `index.css`:
   - Add focus ring rules to `.nb-btn`, `.nb-card`, `.agent-chip`, `.nb-nav-item`:
     `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
3. Add ARIA Semantics to Modals & Dropdowns:
   - `RepositoryOnboardingView.tsx` modal container: Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`.
   - `Header.tsx` repo dropdown: Add `aria-expanded` and `aria-haspopup="listbox"`.

### Target Files
- `src/index.css`
- `src/components/layout/Header.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/common/ThemeToggle.tsx`
- `src/components/dashboard/RepositoryOnboardingView.tsx`
- `src/components/common/CodeDiffViewer.tsx`

---

## Phase 4 (P2): Spacing, Typography & Visual Standardization

### Objectives
1. Standardize spacing and height tokens:
   - Convert arbitrary height utility classes (`h-8`, `h-7`, `w-7 h-7`) to standard button & icon sizes (`h-9 px-3.5` for small buttons, `h-10 px-4` for standard buttons).
   - Standardize card padding to `p-5` or `p-6` across views.
2. Typography System Alignment:
   - Ensure headers explicitly use `font-display` (`Space Grotesk`) and body text uses `font-sans` (`Inter`).
   - Eliminate arbitrary font sizes (`text-[9px]`, `text-[11px]`, `text-[13px]`, `text-[26px]`) where standard Tailwind classes (`text-2xs`, `text-xs`, `text-sm`, `text-base`, `text-2xl`, `text-3xl`) apply.

### Target Files
- `src/components/layout/Header.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/dashboard/OverviewView.tsx`
- `src/components/dashboard/SecurityDashboard.tsx`
- `src/components/dashboard/PullRequestsView.tsx`

---

## Phase 5: Multi-Mode Validation & Completion Criteria

### Verification Commands & Methods
1. **Build Check**:
   ```bash
   npm run build
   ```
2. **Hardcoded Color Scan**:
   ```bash
   grep_search: Query="#[0-9a-fA-F]{3,8}|rgba?\(|text-white|bg-white|text-black|bg-black"
   ```
   (Must return **0 matches** outside of explicit SVG fills or theme token definitions).
3. **Visual & Theme Verification**:
   - Capture Light Mode screenshots across Overview, Security, and Theme Inspector.
   - Capture Dark Mode screenshots across Overview, Security, and Theme Inspector.
   - Verify WCAG AA contrast ratio ≥ 4.5:1 for all text elements.

---

## Final Completion Checklist
- [ ] 0 Hardcoded hex/RGB colors in component files
- [ ] 0 Hardcoded Tailwind colors (`text-white`, `bg-black`, `text-gray-500`)
- [ ] 0 Contrast failures (Yellow buttons pass 4.5:1 ratio with dark text)
- [ ] All icon buttons contain `aria-label`
- [ ] Keyboard focus rings visible on all interactive elements
- [ ] Light mode pass
- [ ] Dark mode pass
- [ ] System mode pass
- [ ] TypeScript build passes clean (`tsc -b && vite build`)
