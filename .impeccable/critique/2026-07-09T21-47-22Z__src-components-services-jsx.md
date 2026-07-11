---
target: Services section (Services.jsx)
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-07-09T21-47-22Z
slug: src-components-services-jsx
---
Method: dual-agent (A: design-director-analysis · B: detect.mjs + code-inspection)
*Note: Run sequentially inside primary agent context as sub-agent/Task spawning tool (`spawn_agent` / `invoke_subagent`) is not exposed in this session.*

#### Design Health Score
> *Consult the Heuristics Scoring Guide.*

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Cards expand shadow on hover (`hover:shadow-[..._0.3]`), but lack explicit interactive action cues (e.g. `Launch Scanner →` badge or arrow). |
| 2 | Match System / Real World | 2/4 | Tactical security tools (`PRODUCT.md`: Vigilant, Authoritative) rely on crisp, left-aligned telemetry (`system-ui`). Centered paragraphs with 96px icons floating at the card bottom feel like an informal marketing layout. |
| 3 | User Control and Freedom | 3/4 | Navigation destinations (`/file`, `/url`, `/email`) are clear when clicked. |
| 4 | Consistency and Standards | 2/4 | Violates `DESIGN.md` (`Tactical Restraint` & `Flat Canvas` rules). Three `blur-[80px]` pulsing green auras (`pulseGlow_4s`) + `duration-700` transitions contradict Vanguard's crisp `#000000` flat hierarchy and `150-250ms` product UI timing (`reference/product.md`). |
| 5 | Error Prevention | 4/4 | n/a for navigation cards. |
| 6 | Recognition Rather Than Recall | 3/4 | Service titles and descriptions are distinct, though missing action labels ("Scan files ->") require users to hover to confirm interactivity. |
| 7 | Flexibility and Efficiency | 2/4 | Keyboard users navigating via `Tab` receive no visible focus indication (`focus-visible:ring-2 focus-visible:ring-[#1E7D04]`) on `<Link>`. |
| 8 | Aesthetic and Minimalist Design | 1/4 | Heavily over-decorated with `gradient-text` (`bg-gradient-to-r from-green-400 to-white bg-clip-text`), neon heading drop-shadow (`drop-shadow-[0_0_12px_...]`), three `blur-[80px]` pulsing background glows, and three `w-24 h-24` (`96px`) floating icons (`floatIcon_2s`). |
| 9 | Error Recovery | 4/4 | n/a |
| 10 | Help and Documentation | 3/4 | Concise descriptions clarify each scanning service's purpose. |
| **Total** | | **27/40** | **Acceptable (Needs significant visual hierarchy & restraint cleanup)** |

#### Anti-Patterns Verdict

Does this look AI-generated? **Yes.**

**LLM assessment**: The component exhibits classic high-chroma AI aesthetic creep: pairing `bg-clip-text` gradient headings (`from-green-400 to-white`) with neon glow drop-shadows, stacking continuous `blur-[80px]` pulsing background auras behind every card, and placing oversized (`96px`) floating/bobbing icons (`floatIcon_2s`) at the very bottom of centered cards. Instead of looking like a **Tactical Cyber Cockpit** (`DESIGN.md`), the section reads as "neon sci-fi soup."

**Deterministic scan**: The `detect.mjs` CLI scanner flagged **1 warning**:
- `gradient-text` (`Services.jsx:32`): `bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent`. Impeccable bans `background-clip: text` combined with gradient backgrounds as decorative and hard to read.

**Visual overlays**: No reliable user-visible browser overlay is available (`browser automation/visual inspection unavailable in this session`); code structure and exact CSS rules were inspected directly against `DESIGN.md` normative design tokens.

#### Overall Impression
The core 3-column layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) and copy ("File Analyzer", "Secure Link", "Email Check") are solid, but the section's visual hierarchy is upside-down and overstimulated. The 96px icons at the bottom of the cards drag the user's eye down into empty space, while the triple `blur-[80px]` pulsing glows and `duration-700` transitions make the UI feel laggy and loud rather than high-tech and authoritative.

#### What's Working
1. **Responsive Grid Foundation**: The 3-column responsive breakdown (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7`) creates clean structural alignment across viewports without nested or awkward wrapping.
2. **Concise, Action-Oriented Copy**: Each service description clearly specifies what Vanguard does ("detect malware, hidden risks, and malicious content before it reaches your system") without fluffy jargon.

#### Priority Issues

- **[P1] Inverted Card Hierarchy & Centered Alignment (`SingleCard`)**
  - **Why it matters**: Placing a massive `w-24 h-24` (`96px`) floating icon at the *bottom* (`mt-auto`) below centered paragraph text (`text-center`) forces the user's eye away from the service title (`<h3>`) and clickable destination. It creates a bottom-heavy visual imbalance and ragged text edges that slow down reading.
  - **Fix**: Move the icon to the **top** of the card (or top-left header row with `w-12 h-12` or `w-14 h-14` sizing), change text alignment to `text-left` (`DESIGN.md`: "All interactive forms... must use system sans-serif to maintain data legibility"), and add a distinct top or bottom interactive affordance like `Launch Scanner →`.
  - **Suggested command**: `$impeccable layout src/components/Services.jsx`

- **[P1] Overstacked Glow Auras & Excessive Decorative Motion**
  - **Why it matters**: Each card renders an `absolute -inset-6 rounded-3xl bg-green-900 blur-[80px] opacity-25 animate-[pulseGlow_4s_...]` background. In a 3-column grid, three overlapping `80px` blur fields pulsing continuously alongside 3 icons bobbing every `2s` (`floatIcon`) causes high visual fatigue, GPU overdraw, and directly violates `DESIGN.md` (`The Flat Canvas Rule` & `Tactical Restraint Rule`).
  - **Fix**: Remove the per-card `-inset-6 blur-[80px]` pulsing background div entirely. Let the cards rest flat on `#000000` (`bg-[#0c0c0c] border border-[#1E7D04]/25`). On hover, apply `border-[#1E7D04]/60` and `shadow-[0_4px_20px_rgba(30,125,4,0.2)]` over a crisp `200ms ease-out` transition instead of `duration-700`. Wrap any residual icon motion in `motion-safe` (`prefers-reduced-motion: reduce`).
  - **Suggested command**: `$impeccable quieter src/components/Services.jsx`

- **[P2] Anti-Pattern: Gradient Display Title & Missing Focus Ring**
  - **Why it matters**: Line 32's `bg-gradient-to-r from-green-400 to-white bg-clip-text` with `drop-shadow-[0_0_12px_...]` triggers the `gradient-text` slop detector and blurs character definition on `Gargoyles`. Furthermore, keyboard users tabbing through `<Link>` receive no visual focus indicator (`focus-visible:ring-2`).
  - **Fix**: Replace the gradient title text with crisp `#ffffff` (`DESIGN.md`: `from-white to-[#025714]` if masking, or pure high-contrast `#ffffff` / `#dedede`). On `<Link to={...}>`, add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04] rounded-2xl` for full accessibility compliance.
  - **Suggested command**: `$impeccable typeset src/components/Services.jsx`

#### Persona Red Flags
> *Consult the Personas reference.*

**Alex (Power User)**:
- Card transitions (`duration-700`) feel sluggish when hovering across the grid.
- No direct keyboard accelerator or `focus-visible` outline when tabbing through the services to quickly launch `/file` or `/url`.

**Sam (Accessibility-Dependent User)**:
- `animate-[floatIcon_2s_...]` and `animate-[pulseGlow_4s_...]` run infinitely without `@media (prefers-reduced-motion: reduce)` / `motion-safe:` checks.
- Cards lack explicit `aria-label` or focus outline on `<Link>` when navigating via `Tab` with VoiceOver/NVDA.

#### Minor Observations
- `minHeight: "360px", maxWidth: "620px", margin: "0 auto"` in inline styles (lines 93-95) can be cleaned up cleanly into standard Tailwind classes (`min-h-[340px] max-w-xl mx-auto`).
- `IntersectionObserver` threshold at `0.4` (line 75) can delay entrance transitions on shorter mobile screens; a threshold of `0.15` or `0.2` is more responsive.

#### Questions to Consider
- "What if the cards led with the icon at top-left next to a crisp title (`File Analyzer`), instantly signaling what tool is being opened?"
- "How much crisper and more authoritative would this section feel if the background rested on pure black (`#000000`) with precise emerald border glows on hover instead of 3 overlapping 80px blur clouds?"
