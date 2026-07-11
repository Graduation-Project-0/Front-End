---
name: Vanguard Design System
description: Tactical Cyber Cockpit design system for high-precision real-time threat defense and telemetry.
colors:
  primary: "#1e7d04"
  primary-deep: "#0a3301"
  primary-bright: "#22c55e"
  neutral-bg: "#000000"
  neutral-surface: "#0c0c0c"
  neutral-border: "#1e7d04"
  neutral-text: "rgba(255, 255, 255, 0.87)"
  neutral-muted: "#9ca3af"
  status-secure: "#4ade80"
  status-good: "#facc15"
  status-risk: "#fb923c"
  status-warning: "#f87171"
typography:
  display:
    fontFamily: "Gargoyles, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Gargoyles, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "8px"
  md: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "14px 40px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "14px 40px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "12px 40px"
  card:
    backgroundColor: "rgba(0, 0, 0, 0.4)"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.md}"
    padding: "24px"
---

# Design System: Vanguard

## 1. Overview

**Creative North Star: "The Tactical Cyber Cockpit"**

Vanguard is designed as an engineered, high-precision defense console where every indicator serves immediate situational awareness and rapid threat response. Built on pure cyber black (`#000000`) with vibrant emerald and tactical green gradients (`#1E7D04` to `#0A3301`), the interface conveys calm superiority and technical authority without sensory fatigue. Every layout is structured to prioritize cognitive clarity, allowing security analysts and everyday citizens alike to inspect files, URLs, and emails in seconds.

The visual system explicitly rejects both the generic corporate/startup SaaS monoculture (bubbly pastel gradients, same-sized card grids, and repetitive uppercase AI section eyebrows) and clunky legacy antivirus dashboards (overwhelming raw log dumps, cryptic error codes, and pop-up fatigue). Instead, Vanguard combines custom typographic identity via the `Gargoyles` font for wordmarks and section anchors with ultra-legible system sans-serif typography for high-density telemetry and diagnostic reports.

**Key Characteristics:**

- **Committed Dark Identity**: Pure black canvas (`#000000`) paired with translucent surface layering (`#0c0c0c` and `bg-black/40`) to create depth without muddiness.
- **Tactical Emerald Focus**: Controlled, purposeful use of green gradients and border glows to draw immediate focus to interactive dropzones, CTAs, and active defense states.
- **Engineered Legibility**: High contrast (`≥4.5:1` body text) and non-color-only status indicators (explicit badges pairing icon + text) ensuring uncompromising WCAG AA compliance.
- **Responsive & Motion-Aware**: Smooth micro-interactions and ambient particle glows that instantly adapt and respect `@media (prefers-reduced-motion: reduce)`.

## 2. Colors

The Vanguard color palette is dark, authoritative, and tactical, anchored by deep cyber greens against pure black.

### Primary

- **Vanguard Emerald** (`#1E7D04` / `oklch(51% 0.17 142)`): The signature interactive brand accent. Used for primary call-to-action button gradients, active nav borders, and scanner dropzone highlights.
- **Deep Cyber Green** (`#0A3301` / `oklch(28% 0.11 142)`): Used as the secondary stop in rich CTA button gradients and dark hero background blends.
- **Neon Alert Green** (`#22c55e` / `oklch(73% 0.19 142)`): High-chroma interactive highlight for hover states and positive status indicators.

### Neutral

- **Pure Cyber Black** (`#000000` / `oklch(0% 0 0)`): The foundational background (`body`, main containers) ensuring maximum OLED contrast and visual focus.
- **Elevated Surface Black** (`#0c0c0c` / `oklch(12% 0 0)`): Solid dark surface for dropdown menus, modals, and elevated navigation bars.
- **Primary Pure White** (`rgba(255, 255, 255, 0.87)` / `#dedede`): Primary body text and high-emphasis labels.
- **Tactical Muted Gray** (`#9ca3af` / `oklch(70% 0.02 260)`): Secondary descriptions, helper text, and inactive telemetry metrics.
- **Emerald Border Glow** (`#1E7D04` / `rgba(30, 125, 4, 0.6)`): Subdued green borders used to frame cards, dropzones, and the navigation bar.

### Status & Severity

- **Status Secure** (`#4ade80`): Clean, safe scan verdicts and verified defense indicators.
- **Status Good** (`#facc15`): Low-risk warnings or informational security notices.
- **Status Risk** (`#fb923c`): Suspicious file anomalies or moderate threat probabilities.
- **Status Warning** (`#f87171`): Confirmed malware, phishing links, or critical security alerts.

### Named Rules

**The Tactical Restraint Rule.** Primary emerald gradients (`#1E7D04` to `#0A3301`) are reserved strictly for primary actions, scanner dropzones, and brand wordmarks. Never use green backgrounds as generic container fills or decorative padding; its presence must always signal defensive capability or interaction.

## 3. Typography

**Display & Section Font:** `Gargoyles` (with `system-ui, sans-serif` fallback)
**Body & Telemetry Font:** `system-ui, Avenir, Helvetica, Arial, sans-serif`

**Character:** The pairing creates an unmistakable cybersecurity identity: `Gargoyles` brings distinct tactical sharpness and architectural weight to brand headers and section titles, while the clean system sans-serif guarantees effortless readability across dense scan metrics, charts, and diagnostic forms.

### Hierarchy

- **Display** (`800`, `clamp(1.8rem, 5vw, 4.5rem)`, `1.1`): Hero headlines and major marketing titles. Uses optional subtle green-to-white gradient masking (`from-white to-[#025714]`).
- **Headline** (`700`, `2.25rem`, `1.2`): Page titles inside authenticated tools (`Dashboard`, `File Page`, `URL Scanner`).
- **Title** (`600`, `1.25rem`, `1.4`): Component headers, card titles, and section anchors (using `landing-section-title` / `Gargoyles`).
- **Body** (`400`, `1rem`, `1.5`): Standard prose, instructions, and descriptions. Max line length capped at `65–75ch` for comfortable scanning.
- **Label** (`500`, `0.875rem`, `1.4`): Form inputs, status badges, and table headers. Cased normally or uppercase with `0.05em` tracking for technical badges.

### Named Rules

**The Purposeful Display Rule.** The `Gargoyles` display typeface is restricted to brand wordmarks (`.nav-logo-text`) and major section anchors (`.landing-section-title`). All interactive forms, diagnostic tables, and telemetry charts must use the system sans-serif to maintain data legibility.

## 4. Elevation

Vanguard uses a **Flat-by-Default with Tonal & Emerald Glow Layering** philosophy. Surfaces rest flat on pure black (`#000000`). Depth is created through subtle translucent surface steps (`bg-black/40`, `bg-black/80`) and tactical green border or box-shadow glows on active and elevated states.

### Shadow Vocabulary

- **Nav Glow** (`box-shadow: 0 3px 6px rgba(30, 125, 4, 0.4)`): Subtle bottom glow anchoring the fixed navigation bar (`.after:shadow-[...]`).
- **Hero Title Glow** (`drop-shadow: 0 0 10px rgba(30, 125, 4, 0.3)`): Text glow behind main hero display headings.
- **Dropdown Surface Shadow** (`box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.8)`): Deep black shadow separating floating menus (`#0c0c0c`) from underlying content.

### Named Rules

**The Flat Canvas Rule.** Cards and containers never use heavy white or gray box-shadows. Elevation is expressed exclusively through border luminosity (`border-[#1E7D04]/50`) and subtle green glow diffusion on hover.

## 5. Components

Components are engineered, tactile, and unambiguous—designed to command immediate action or deliver instant clarity.

### Buttons

- **Shape:** Full pill radius (`rounded-full` / `9999px`).
- **Primary:** Gradient fill (`bg-gradient-to-r from-[#1E7D04] to-[#0A3301]`) with white text (`#ffffff`), `font-semibold`, and `14px 40px` padding (`px-10 py-3.5`).
- **Primary Hover / Focus:** `opacity-70` transition over `300ms`, with crisp focus-visible ring (`ring-2 ring-green-500/40`).
- **Ghost / Secondary:** Transparent background with `border border-[#1E7D04]`, `#1E7D04` text (`text-xl sm:text-2xl font-semibold px-10 py-3`).
- **Ghost Hover:** Fills with solid green (`hover:bg-[#025714] hover:text-white`).

### Scanner Dropzones (`FilePage`, `UrlPage`, `EmailPage`)

- **Shape:** `16px` radius (`rounded-2xl`).
- **Background & Border:** Semi-transparent dark glass (`bg-black/40`) bounded by `border border-green-800/50`.
- **Hover & Drag Active:** Smoothly shifts to `bg-black/50` with intensified border luminosity (`border-green-500/80`).
- **Internal Padding:** Generous `24px` to `40px` (`p-6 sm:p-10`) to provide an inviting, spacious target for file drops.

### Cards & Telemetry Containers (`DashboardScansChart`)

- **Corner Style:** `16px` radius (`rounded-2xl`).
- **Background:** Tonal black step (`bg-black/40` or `#0c0c0c`).
- **Border:** `1px solid rgba(30, 125, 4, 0.25)` (`border-[#1E7D04]/25`).
- **Internal Padding:** `24px` standard padding across all chart containers.

### Inputs & Fields

- **Style:** Dark background (`bg-white/5` or `bg-black/60`) with `8px` to `16px` corner radius and `border border-green-800/40`.
- **Focus:** `focus:outline-none focus:ring-2 focus:ring-[#1E7D04]` providing immediate tactical feedback.
- **Error State:** Distinct `border-red-500 text-red-400` with descriptive helper message.

### Navigation (`Navbar`)

- **Style:** Fixed top pill bar (`rounded-2xl border-b border-[#1E7D04]/60 bg-black/80 backdrop-blur-md`).
- **Links:** `text-gray-300 font-medium text-sm lg:text-base` transitioning to `hover:text-[#1E7D04]`.
- **Wordmark:** `Gargoyles` font (`.nav-logo-text`) paired with the icon mark (`/Logo.png`).

## 6. Do's and Don'ts

### Do:

- **Do** maintain `≥4.5:1` contrast for all primary and secondary text against `#000000` or `#0c0c0c` backgrounds (`#dedede` or `#9ca3af`).
- **Do** pair icon + text badges (`Status Secure`, `Status Warning`) alongside color when communicating scan results.
- **Do** use `rounded-full` (`9999px`) for CTA buttons and `rounded-2xl` (`16px`) for cards and scanner dropzones.
- **Do** wrap animated background effects (`ParticleBackground.jsx`) in `@media (prefers-reduced-motion: reduce)` fallbacks.
- **Do** enforce `Gargoyles` strictly on brand headings and section anchors while preserving system sans-serif for high-density telemetry.

### Don't:

- **Don't** use generic corporate blue or purple gradients; Vanguard is strictly anchored in cyber black and tactical emerald.
- **Don't** use `border-radius: 32px+` on rectangular cards or containers; over-rounding destroys technical authority.
- **Don't** pair `border: 1px solid` with wide, soft drop shadows (`box-shadow: 0 16px ...`); pick crisp border glows or flat layering.
- **Don't** add repetitive all-caps small tracked eyebrows (`01 · ABOUT`, `02 · PROCESS`) above every section heading.
- **Don't** display raw, unstructured terminal log dumps on user-facing scan output pages without clear visual summaries and actionable next steps.
