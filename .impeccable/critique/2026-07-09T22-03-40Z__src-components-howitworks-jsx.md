---
target: HowItWorks.jsx
total_score: 27
p0_count: 0
p1_count: 3
timestamp: 2026-07-09T22-03-40Z
slug: src-components-howitworks-jsx
---
Method: ⚠️ DEGRADED: single-context (spawn_agent unavailable in this session)

#### Design Health Score

| #         | Heuristic                       | Score     | Key Issue                                                                                                                                                    |
| --------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1         | Visibility of System Status     | 2         | 500ms `ease-in-out` accordion animation is sluggish; missing `aria-expanded` and active open-card border/surface elevation                                   |
| 2         | Match System / Real World       | 2         | Section labeled "How It Works" presents an FAQ accoSrdion instead of a tactical process pipeline; intro copy is generic corporate marketing fluff            |
| 3         | User Control and Freedom        | 3         | Users can toggle individual items, but lack multi-expand, expand-all controls, or keyboard escape/accelerators                                               |
| 4         | Consistency and Standards       | 2         | Uses `bg-zinc-950` instead of `#0c0c0c`; uses banned `bg-gradient-to-r ... bg-clip-text` (`gradient-text`); uses `<h1>` inside a sub-section                 |
| 5         | Error Prevention                | 4         | Read-only informational surface; no destructive actions                                                                                                      |
| 6         | Recognition Rather Than Recall  | 3         | Single-open accordion (`openIndex`) forces users to recall details across Q&As when comparing static vs. zero-day capabilities                               |
| 7         | Flexibility and Efficiency      | 2         | Lacks explicit `focus-visible` ring styling for keyboard operators and power-user multi-panel inspection                                                     |
| 8         | Aesthetic and Minimalist Design | 2         | `lg:w-[60%]` awkwardly shrinks the primary laptop visual inside a 50% grid column (`~300px`); large `blur-[120px]` glow and gradient heading read as AI slop |
| 9         | Error Recovery                  | 4         | N/A (read-only informational section)                                                                                                                        |
| 10        | Help and Documentation          | 3         | Clear technical answers, but formatted as unstyled text walls without visual bullet markers or deep navigation links (`/file`, `/url`, `/email`)             |
| **Total** |                                 | **27/40** | **Acceptable (Significant improvements needed)**                                                                                                             |

#### Anti-Patterns Verdict

**LLM assessment**: The `HowItWorks.jsx` component exhibits two prominent AI training-data reflexes. First, the `bg-gradient-to-r from-green-400 to-white bg-clip-text` heading paired with a wide `drop-shadow-[0_0_12px_rgba(74,222,128,0.3)]` is classic decorative AI gradient typography (`gradient-text`). Second, the section relies on generic, non-authoritative SaaS introductory copy ("Security is a process, not a product. Learn everything you need to know about taking the right steps to reach your destination") and stages "How It Works" as an FAQ accordion rather than a concrete, authoritative step-by-step threat interception pipeline (`Tactical Cyber Cockpit`). Additionally, `lg:w-[60%]` applied to `laptop.png` inside `lg:grid-cols-2` severely shrinks the visual asset on desktop, leaving it floating awkwardly inside an oversized column opposite a massive vertical accordion block.

**Deterministic scan**: The `detect.mjs` CLI tool scanned `src/components/HowItWorks.jsx` and flagged **1 warning**:

- **`gradient-text`** at `Line 40`: `bg-clip-text + bg-gradient` (`<h1 className="... bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent ...">`).
  _Agreement Note_: The deterministic scan confirms our visual assessment regarding decorative gradient typography, which violates both `SKILL.md` absolute bans and `DESIGN.md` Section 3 rules restricting display styling to brand wordmarks and specific section anchors (`.landing-section-title` in `#ffffff` without rainbow text gradients).

**Visual overlays**: No reliable user-visible browser overlay was injected (`[Human]` tab mutation bypassed due to lack of native browser automation tools in this session). CLI deterministic detection and rigorous code inspection served as the exact verification signal.

#### Overall Impression

The section delivers substantive, technically accurate answers about Vanguard's static-first heuristic analysis (`DEEPSCAN`) and zero-day AI architecture. However, its visual execution (`gradient-text`, `bg-zinc-950`, unstyled `<h1>`, sluggish `500ms` accordion transitions, missing `aria-expanded` accessibility, and awkwardly shrunken desktop laptop asset) undermines Vanguard's "Vigilant, High-tech, Authoritative" brand identity (`PRODUCT.md`). Replacing the accordion with an explicit 3-step threat interception pipeline or tightening the accordion into a high-density, accessible tactical readout will immediately elevate this section to production-grade excellence.

#### What's Working

- **High-Value Technical Content**: The answers clearly distinguish Vanguard from legacy antivirus tools by emphasizing static-first, non-execution inspection of binaries, URLs, emails, and Python supply-chain dependencies.
- **Clean Component Encapsulation**: Clean separation of state (`openIndex`) and clean usage of `lucide-react` icons (`ChevronDown`) with crisp border containers (`border-green-900/70`).

#### Priority Issues

- **[P1] What: Banned `gradient-text` display heading and invalid semantic `<h1>` tag inside component**
  - **Why it matters**: `bg-gradient-to-r from-green-400 to-white bg-clip-text` is explicitly flagged by `detect.mjs` as AI slop (`gradient-text`). Furthermore, using an `<h1>` inside an embedded section (`#work`) breaks page-level HTML document outline hierarchy and SEO standards, as `HeroSection.jsx` or `Services.jsx` already anchor the primary page title.
  - **Fix**: Convert `<h1 className="...">` to `<h2 className="landing-section-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">How It Works</h2>`. Remove `bg-gradient-to-r`, `bg-clip-text`, `text-transparent`, and the blurry text drop-shadow (`drop-shadow-[...]`).
  - **Suggested command**: `$impeccable typeset`

- **[P1] What: Severe accessibility (`a11y`) gaps (`aria-expanded`, `aria-controls`, and `focus-visible` missing on accordion buttons)**
  - **Why it matters**: Screen reader operators (`Persona Sam`) pressing Tab across accordion trigger buttons receive no announcement of whether a question's answer panel is currently expanded or collapsed (`aria-expanded`), nor what panel element it controls (`aria-controls`). Furthermore, keyboard operators navigating via Tab see no explicit focus indicator because `focus-visible:ring-2 focus-visible:ring-[#1E7D04]` is missing on the trigger button.
  - **Fix**: Add `aria-expanded={openIndex === index}` and `aria-controls={`faq-panel-${index}`}` to the `<button>`. Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E7D04] focus-visible:ring-inset` to the button classes, and give the collapsible panel `id={`faq-panel-${index}`}` and `role="region"`.
  - **Suggested command**: `$impeccable harden`

- **[P1] What: Layout imbalance from `lg:w-[60%]` on `laptop.png` and off-brand `bg-zinc-950/80` container color**
  - **Why it matters**: Inside a 50/50 two-column layout (`grid-cols-1 lg:grid-cols-2`), setting `lg:w-[60%]` on `laptop.png` shrinks the laptop visual to only ~60% of the half-screen column (`~300px wide on a 1024px screen`), leaving immense empty dark space on desktop opposite a tall 5-item accordion. Additionally, `bg-zinc-950/80` (`#09090b`) violates `DESIGN.md` color tokens, which mandate `#0c0c0c` (`Elevated Surface Black`) or `bg-black/40` for cards.
  - **Fix**: Change `lg:w-[60%]` to `lg:w-[85%] xl:w-[90%]` on `laptop.png` to restore visual weight and balance. Replace `bg-zinc-950/80` with `bg-[#0c0c0c] border border-white/15 hover:border-[#1E7D04]`. When `openIndex === index`, apply `border-[#1E7D04] bg-[#101010] shadow-[0_4px_24px_rgba(30,125,4,0.15)]` so the active item clearly elevates above closed items.
  - **Suggested command**: `$impeccable layout`

- **[P2] What: Sluggish `500ms ease-in-out` transition physics and dangerous `max-h-[600px]` truncation risk**
  - **Why it matters**: A `500ms` `ease-in-out` height transition (`max-h-[600px]`) creates a noticeable rubber-band lag (`transition-all`) when expanding and collapsing short text panels, as `ease-in-out` spends time accelerating across hundreds of empty pixels. If user text wrapping or mobile scaling pushes content height beyond `600px`, `overflow-hidden` clips the bottom of the answer without warning.
  - **Fix**: Change duration to `duration-250 ease-out` (`SKILL.md`: "150–250 ms on most transitions. Users are in flow; don't make them wait for choreography"). Use `grid grid-rows-[0fr] transition-[grid-template-rows] duration-250 ease-out` with an inner `min-h-0 overflow-hidden` wrapper (`openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'`), which animates perfectly to natural content height without hardcoded `max-h-[600px]` truncation risks or `prefers-reduced-motion` violations.
  - **Suggested command**: `$impeccable animate`

- **[P2] What: Generic corporate marketing copy in header intro and unstyled bullet lists in Q&A #4**
  - **Why it matters**: The intro copy ("Security is a process, not a product. Learn everything you need to know about taking the right steps to reach your destination") is a generic motivational cliché that dilutes Vanguard's high-tech, vigilant brand tone (`PRODUCT.md`). Inside Q&A #4, `• Malware and...` bullet items are rendered inside plain `whitespace-pre-line text-gray-400` blocks without typographic indentation, leading to low data density and scannability.
  - **Fix**: Rewrite the intro to: "Vanguard replaces legacy signature-matching with static-first heuristic analysis and zero-day neural inspection—intercepting payloads before execution." Format multi-item answers with crisp `<ul className="mt-3 space-y-1.5 pl-4 border-l-2 border-[#1E7D04]/60 text-gray-300 font-mono text-xs sm:text-sm">` lists.
  - **Suggested command**: `$impeccable clarify`

#### Persona Red Flags

**Alex (Power User / Tactical Operator)**:

- Frustrated by single-item accordion constraint (`openIndex === index ? null : index`); cannot expand all items simultaneously to inspect Vanguard's technical specifications across file, URL, and email engines.
- `500ms` `ease-in-out` accordion animation feels sluggish and patronizing during rapid technical evaluation.
- No keyboard shortcuts or escape mechanisms (`Esc` to collapse all).

**Sam (Accessibility-Dependent User)**:

- `aria-expanded` attribute is missing from all accordion trigger buttons. When tabbing through questions, screen reader announces only the question string, giving zero indication whether the content panel is open or closed.
- `aria-controls` linking the button to the answer panel `id` is entirely missing (`role="region"` absent).
- No explicit `focus-visible:ring-2 focus-visible:ring-[#1E7D04]` styles on the button, leaving keyboard operators with default browser blue or invisible focus rings against dark backgrounds.

**Casey (Distracted Mobile User / Tablet)**:

- On desktop, `lg:w-[60%]` makes `laptop.png` look oddly shrunken (`~300px wide`) inside a 50% grid column, while on mobile/tablet `scale-110` pushes the image too close to viewport edges without comfortable padding.
- If Casey increases system font size or views on a narrow mobile display, `max-h-[600px]` with `overflow-hidden` clips the bottom of long multi-point answers like FAQ #4 (`What types of threats can Vanguard detect?`).

#### Minor Observations

- `lucide-react`'s `ChevronDown` rotates `duration-500` without a `motion-reduce:transition-none` class.
- The `faqs` array is defined inside the component render body (`const faqs = [...]` inside `HowItWorks()`), causing unnecessary object re-creation on every re-render. Move `faqs` outside the component scope or wrap in `useMemo`.
- The green background blur blob (`bg-green-500/10 blur-[120px]`) is decorative `glassmorphism/blur` default that adds unnecessary GPU composite load without tactical utility.

#### Questions to Consider

- "What if we replaced the FAQ accordion structure entirely with a 3-step interactive 'Inspection Pipeline' visual (`01. Static Intake -> 02. Neural Heuristic Scan -> 03. Tactical Verdict`) to match the authoritative cockpit aesthetic of `Services.jsx` and `HeroSection.jsx`?"
- "Should we allow multiple accordion panels to remain open simultaneously (`Multi-Expand mode`) so operators can cross-reference technical capabilities without losing prior reading context?"
- "Could we integrate live latency indicators (`< 12ms`) or link badges directly inside the accordion header titles so each item reinforces Vanguard's real-time performance metrics?"
