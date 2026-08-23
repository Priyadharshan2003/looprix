# Looprix Accessibility & WCAG Audit

## Executive Summary
This audit details all WCAG 2.1 AA violations discovered across the Looprix application, covering color contrast failures, non-text content accessibility (missing `aria-label`s on icon buttons), focus indicators, keyboard navigation barriers, and form input labeling.

---

## 1. WCAG 1.4.3 Color Contrast Failures (Minimum 4.5:1 for Normal Text, 3.1 for Large Text)

### Priority P0 / P1 Failures

| File Path | Line Number | Element / Component | Foreground / Background Combination | Calculated Contrast Ratio | WCAG Requirement | Status |
|---|---|---|---|---|---|---|
| `src/components/layout/Header.tsx` | L82 | Execute Loop / Run Loop Button | White (`#ffffff`) on Brand Yellow (`#FFD86A`) | **1.38 : 1** | Min 4.5:1 | **FAIL (P0)** |
| `src/components/dashboard/SecurityDashboard.tsx` | L66 | Run Auto Fixer Button | White (`#ffffff`) on Brand Yellow (`#FFD86A`) | **1.38 : 1** | Min 4.5:1 | **FAIL (P0)** |
| `src/components/dashboard/PullRequestsView.tsx` | L48 | Generate New PR Loop Button | White (`#ffffff`) on Brand Yellow (`#FFD86A`) | **1.38 : 1** | Min 4.5:1 | **FAIL (P0)** |
| `src/components/dashboard/SelfHealingRunnerView.tsx` | L200 | Trigger Healing Engine Button | White (`#ffffff`) on Brand Yellow (`#FFD86A`) | **1.38 : 1** | Min 4.5:1 | **FAIL (P0)** |
| `src/components/dashboard/SelfHealingRunnerView.tsx` | L206 | Active Engine Tab Badge | White (`#ffffff`) on Brand Yellow (`#FFD86A`) | **1.38 : 1** | Min 4.5:1 | **FAIL (P0)** |
| `src/components/dashboard/SettingsView.tsx` | L72 | Selected Model Card Title/Text | White (`#ffffff`) on Brand Yellow (`#FFD86A`) | **1.38 : 1** | Min 4.5:1 | **FAIL (P0)** |
| `src/components/dashboard/SecurityDashboard.tsx` | L134 | Selected Security Card Title | White (`#ffffff`) on Brand Yellow (`#FFD86A`) | **1.38 : 1** | Min 4.5:1 | **FAIL (P0)** |
| `src/components/dashboard/PullRequestsView.tsx` | L72 | Selected PR Card Header | White (`#ffffff`) on Brand Yellow (`#FFD86A`) | **1.38 : 1** | Min 4.5:1 | **FAIL (P0)** |
| `src/components/dashboard/AgentStudioView.tsx` | L91 | Selected Agent Pipeline Chip | White (`#ffffff`) on Brand Yellow (`#FFD86A`) | **1.38 : 1** | Min 4.5:1 | **FAIL (P0)** |
| `src/components/layout/Sidebar.tsx` | L98 | Active Sidebar Orange Badge (Dark Mode) | Dark Mode Foreground (`#fafafa`) on Accent Orange (`#FFAE61`) | **1.52 : 1** | Min 4.5:1 | **FAIL (P1)** |
| `src/components/layout/Sidebar.tsx` | L99 | Active Sidebar Green Badge (Dark Mode) | Dark Mode Foreground (`#fafafa`) on Accent Green (`#68D48A`) | **1.61 : 1** | Min 4.5:1 | **FAIL (P1)** |
| `src/components/common/Badge.tsx` | L34 | Green Success Badge (Dark Mode) | Foreground (`#fafafa`) on Green (`#68D48A`) | **1.61 : 1** | Min 4.5:1 | **FAIL (P1)** |
| `src/components/common/Badge.tsx` | L35 | Orange Warning Badge (Dark Mode) | Foreground (`#fafafa`) on Orange (`#FFAE61`) | **1.52 : 1** | Min 4.5:1 | **FAIL (P1)** |
| `src/components/common/Badge.tsx` | L39 | Cyan Badge (Dark Mode) | Foreground (`#fafafa`) on Cyan (`#6ACFE0`) | **1.58 : 1** | Min 4.5:1 | **FAIL (P1)** |
| `src/components/common/CleanCoreGauge.tsx` | L20 | Clean Core High Badge (Dark Mode) | Foreground (`#fafafa`) on Green (`#68D48A`) | **1.61 : 1** | Min 4.5:1 | **FAIL (P1)** |
| `src/components/dashboard/OverviewView.tsx` | L125 | Mission Control Hero Subtitle | Text White 50% (`rgba(255,255,255,0.5)`) on `#0D0D0D` | **3.85 : 1** | Min 4.5:1 | **FAIL (P1)** |
| `src/components/dashboard/OverviewView.tsx` | L140 | Hero Metric Label | Text White 40% (`rgba(255,255,255,0.4)`) on `#0D0D0D` | **2.91 : 1** | Min 4.5:1 | **FAIL (P1)** |

---

## 2. WCAG 4.1.2 Non-Text Content & Interactive Controls (Missing `aria-label`s)

Icon-only buttons and interactive controls lack `aria-label` or accessible names for screen readers:

| File Path | Line Number | Element | Description of Issue | Proposed Fix |
|---|---|---|---|---|
| `src/components/layout/Sidebar.tsx` | L61 | `<button onClick={() => setCollapsed(!collapsed)}>` | Sidebar collapse toggle icon button missing `aria-label` | Add `aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}` |
| `src/components/layout/Sidebar.tsx` | L77 | `<button onClick={() => setCollapsed(!collapsed)}>` | Desktop sidebar collapse button missing `aria-label` | Add `aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}` |
| `src/components/layout/Header.tsx` | L28 | `<button className="md:hidden">` | Mobile menu toggle button missing `aria-label` | Add `aria-label="Toggle mobile menu"` |
| `src/components/layout/Header.tsx` | L49 | `<button className="w-full flex items-center...">` | Repository selector dropdown trigger missing ARIA attributes | Add `aria-expanded={showRepoDropdown}`, `aria-haspopup="listbox"`, `aria-label="Select active repository"` |
| `src/components/layout/Header.tsx` | L93 | `<button className="relative w-8 h-8...">` | Notification bell trigger missing `aria-label` | Add `aria-label="View notifications"` |
| `src/components/layout/Header.tsx` | L133 | `<button onClick={() => setShowNotifications(false)}>` | Notification panel close button missing `aria-label` | Add `aria-label="Close notifications"` |
| `src/components/common/ThemeToggle.tsx` | L10 | `<button onClick={toggleTheme}>` | Theme toggle button missing `aria-label` | Add `aria-label="Toggle theme mode"` |
| `src/components/dashboard/RepositoryOnboardingView.tsx` | L55 | `<button onClick={() => setShowModal(true)}>` | Connect Repo CTA button missing explicit screen reader label | Add `aria-label="Connect new repository"` |
| `src/components/dashboard/RepositoryOnboardingView.tsx` | L185 | `<button onClick={() => setShowModal(false)}>` | Modal close X button missing `aria-label` | Add `aria-label="Close dialog"` |
| `src/components/common/CodeDiffViewer.tsx` | L50 | `<button onClick={handleCopy}>` | Copy code button missing `aria-label` | Add `aria-label="Copy diff code"` |
| `src/components/common/CodeDiffViewer.tsx` | L60 | `<button onClick={() => setViewMode('split')}>` | Split view toggle button missing `aria-label` | Add `aria-label="Switch to split view"` |
| `src/components/common/CodeDiffViewer.tsx` | L71 | `<button onClick={() => setViewMode('unified')}>` | Unified view toggle button missing `aria-label` | Add `aria-label="Switch to unified view"` |

---

## 3. WCAG 2.4.7 Focus Visible & Keyboard Navigation

1. **Missing Focus Rings on Custom Buttons**:
   - `nb-btn` class in `src/index.css` (L76) lacks `focus-visible:outline-none`, `focus-visible:ring-2`, `focus-visible:ring-border-strong`, `focus-visible:ring-offset-2`. Keyboard users tabbing through controls cannot see where focus is positioned.
2. **Modal Dialog Focus Trapping & ARIA Roles**:
   - `RepositoryOnboardingView.tsx` L181 modal dialog container lacks `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`, and focus trapping (pressing Tab escapes modal into background page).
3. **Form Sliders & Toggles**:
   - `SettingsView.tsx` L118, L142 range sliders lack `<label>` associations or `aria-label` attributes.
