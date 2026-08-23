# Looprix Design System — Theme System Audit

## Executive Summary
This audit provides a comprehensive code-level inspection of all theme tokens, color definitions, dark mode incompatibilities, missing semantic tokens, and hardcoded values across the entire Looprix codebase.

---

## 1. Hardcoded Hex, RGB, & Raw Color Values

| File Path | Line Number | Code Snippet | Issue Description | Proposed Token Replacement |
|---|---|---|---|---|
| `src/index.css` | L97 | `color: #101010;` | Hardcoded hex in `.nb-btn-primary` class | `color: var(--brand-yellow-foreground)` |
| `src/index.css` | L98 | `border: 2px solid #101010;` | Hardcoded border color in `.nb-btn-primary` | `border: 2px solid var(--border-strong)` |
| `src/index.css` | L147 | `0 0 10px rgba(104, 212, 138, 0.4)` | Hardcoded RGBA shadow in `.agent-chip.online` | `var(--shadow-glow-green)` |
| `src/index.css` | L168 | `color: #101010;` | Hardcoded text color in `.nb-nav-item.active` | `color: var(--brand-yellow-foreground)` |
| `src/index.css` | L169 | `border: 2px solid #101010;` | Hardcoded border color in `.nb-nav-item.active` | `border: 2px solid var(--border-strong)` |
| `src/index.css` | L186 | `color: #101010;` | Hardcoded text color in `.timeline-step.active` | `color: var(--brand-yellow-foreground)` |
| `src/index.css` | L193 | `color: #101010;` | Hardcoded text color in `.timeline-step.completed` | `color: var(--color-green-text)` |
| `src/index.css` | L194 | `box-shadow: 3px 3px 0px #101010;` | Hardcoded shadow hex in `.timeline-step.completed` | `box-shadow: var(--shadow-brutal-sm)` |
| `src/index.css` | L224 | `color: #101010;` | Hardcoded text color in `::selection` | `color: var(--brand-yellow-foreground)` |
| `src/styles/theme.css` | L74-L76 | `4px 4px 0px #101010` | Hardcoded `#101010` in light mode shadow tokens | `--shadow-color` token mapping |
| `src/components/dashboard/OverviewView.tsx` | L89 | `bg-[#0D0D0D] text-white` | Hardcoded dark hero container background & text | `bg-hero-background text-hero-foreground` |
| `src/components/dashboard/OverviewView.tsx` | L92-L93 | `rgba(255,216,106,0.08)`, `rgba(119,221,153,0.06)` | Inline hardcoded RGBA gradients | Defined utility / token gradient |
| `src/components/dashboard/OverviewView.tsx` | L101 | `rgba(255,255,255,0.06)` | Inline hardcoded grid dot pattern | CSS variable `--hero-dot-pattern` |
| `src/components/dashboard/OverviewView.tsx` | L148 | `bg-brand-yellow text-black border-2 border-black` | Hardcoded `text-black` & `border-black` | `bg-brand-yellow text-brand-yellow-foreground border-border-strong` |
| `src/components/dashboard/SettingsView.tsx` | L118 | `accent-[#FFAE61]` | Hardcoded hex in slider input accent | `accent-accent-orange` |
| `src/components/dashboard/SettingsView.tsx` | L142 | `accent-[#77DD99]` | Hardcoded hex in slider input accent | `accent-accent-green` |
| `src/components/common/ThemeToggle.tsx` | L13 | `dark:bg-gunmetal-700`, `dark:text-cream-50`, `shadow-[3px_3px_0px_#000000]` | Hardcoded theme-toggle classes | `bg-card text-foreground shadow-brutal-sm` |
| `src/components/common/ThemeToggle.tsx` | L19 | `text-[#3BA7B6]` | Hardcoded icon color hex | `text-accent-cyan` |
| `src/components/common/ThemeToggle.tsx` | L24 | `text-[#E2953B]` | Hardcoded icon color hex | `text-accent-orange` |
| `src/components/layout/Sidebar.tsx` | L97 | `bg-accent-red text-white` | Hardcoded `text-white` | `bg-accent-red text-accent-red-foreground` |
| `src/components/layout/Header.tsx` | L101 | `bg-accent-red text-white` | Hardcoded `text-white` | `bg-accent-red text-accent-red-foreground` |
| `src/components/dashboard/RepositoryOnboardingView.tsx` | L44 | `bg-accent-blue text-white` | Hardcoded `text-white` | `bg-accent-blue text-accent-blue-foreground` |

---

## 2. Missing Semantic Tokens

Current `theme.css` lacks dedicated high-contrast text pairing tokens for brand and accent colors:
1. **Brand Yellow Foreground**: `--brand-yellow` (`#FFD86A`) needs a fixed dark foreground token `--brand-yellow-foreground: #101010` in BOTH light and dark modes because yellow is always light. Using dynamic `--primary-foreground` (which becomes `#ffffff` in light mode) causes 1.4:1 contrast failure (invisible white text on yellow).
2. **Accent Green Foreground**: `--color-green` (`#77DD99` / `#68D48A`) is bright in both modes. `--color-green-text` in dark mode currently defaults to white text on green, causing contrast failure.
3. **Accent Blue / Purple / Red**: Light mode needs explicit white text (`#ffffff`), dark mode requires contrast-checked pairs.
4. **Hero Banner Semantic Tokens**: `--hero-bg`, `--hero-fg`, `--hero-muted`, `--hero-border` are missing, forcing inline `bg-[#0D0D0D]` and `text-white`.

---

## 3. Dark Mode Incompatibilities

1. **Light Mode `primary-foreground` Leaks**:
   In `theme.css`:
   - Light mode: `--primary: #111111`, `--primary-foreground: #ffffff`
   - Dark mode: `--primary: #ffd86a`, `--primary-foreground: #141414`
   When components apply `bg-brand-yellow text-primary-foreground` in light mode, `text-primary-foreground` resolves to `#ffffff` (white text on `#FFD86A` yellow background = INVISIBLE TEXT).
2. **Badge Background Incompatibilities**:
   - `Badge.tsx` L34-L40 applies `text-foreground` on accent backgrounds. In dark mode, `text-foreground` is `#fafafa` (white), rendering white text on light green/orange/cyan badges (WCAG failure: 1.5:1).
3. **Modal & Backdrop Inconsistencies**:
   - `RepositoryOnboardingView.tsx` L181 uses `bg-background/80 backdrop-blur-sm`, which in light mode makes the modal backdrop semi-opaque cream instead of a proper dark backdrop overlay (`var(--overlay-backdrop)`).

---

## 4. Hardcoded Shadows & Border Tokens

| File Path | Line Number | Item | Issue |
|---|---|---|---|
| `src/components/common/ThemeToggle.tsx` | L13 | `shadow-[3px_3px_0px_#000000]` | Hardcoded pixel shadow hex |
| `src/styles/theme.css` | L74-L76 | `4px 4px 0px #101010` | Hardcoded shadow color hex in light mode |
| `src/styles/theme.css` | L157-L160 | `4px 4px 0px #000000` | Inconsistent shadow color hex in dark mode |
| `src/index.css` | L147 | `box-shadow: var(--shadow-brutal-sm), 0 0 10px rgba(104, 212, 138, 0.4)` | Mixed token and hardcoded rgba shadow |
| `src/index.css` | L194 | `box-shadow: 3px 3px 0px #101010` | Hardcoded pixel shadow hex |
