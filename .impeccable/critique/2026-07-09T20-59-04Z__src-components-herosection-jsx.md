---
target: HeroSection
total_score: 27
p0_count: 1
p1_count: 2
timestamp: 2026-07-09T20-59-04Z
slug: src-components-herosection-jsx
---
Method: ⚠️ DEGRADED: single-context (spawn_agent unavailable in this session)

#### Design Health Score
> *Consult the [Heuristics Scoring Guide](#heuristics-scoring-guide) section below.*

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Entrance animations trigger cleanly via `IntersectionObserver`, but hash navigation gives no visual scroll feedback. |
| 2 | Match System / Real World | 3 | Strong authoritative cyber copy ("predict threats, respond instantly"), but `animate-pulse` on the virus graphic feels like legacy antivirus software. |
| 3 | User Control and Freedom | 3 | Clear CTAs, but mobile users must scroll past the large illustration (`flex-col-reverse`) to reach navigation actions. |
| 4 | Consistency and Standards | 2 | Violates `DESIGN.md` / `AGENTS.md` by applying `.landing-section-title` (`Gargoyles` display font) to interactive pill buttons, and uses `hover:opacity-70` instead of emerald glow. |
| 5 | Error Prevention | 3 | `handleGetStarted` smartly routes authenticated users to `#services` and unauthenticated users to `/login`. |
| 6 | Recognition Rather Than Recall | 3 | Clear value proposition and distinct primary vs. secondary actions. |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcut hints or quick-jump accelerators for power users. |
| 8 | Aesthetic and Minimalist Design | 2 | `from-white to-[#025714]` text gradient fades the right half of the main headline into dark green (`#025714`) over black, causing poor contrast and visual muddiness. |
| 9 | Error Recovery | 4 | Clean conditional rendering with defensive null check (`if (!el) return;`). |
| 10 | Help and Documentation | 2 | Lacks a quick status indicator or security proof badge (`Status Secure` / `≥4.5:1` contrast pair) above the headline. |
| **Total** | | **27/40** | **Acceptable** |

#### Anti-Patterns Verdict

**Start here.** Does this look AI-generated?

**LLM assessment**: While the layout has clean structure, three distinct visual patterns give away boilerplate/AI generation:
1. **Headline Dark-Fade (`from-white to-[#025714]`)**: Fading text from white into a dark background shade (`#025714`) destroys readability on dark mode (`#000000`), leaving the last words dim and muddy.
2. **Display Font on Buttons (`landing-section-title` / `Gargoyles`)**: Using a stylized, decorative brand font inside interactive buttons breaks standard UI legibility.
3. **Continuous `animate-pulse` on Hero Illustration**: Pulsing the entire 700px virus image opacity (`0.5` to `1`) continuously every 2 seconds creates visual fatigue and feels like a generic template placeholder effect.

**Deterministic scan**: CLI scan (`node detect.mjs --json src/components/HeroSection.jsx`) returned `0` findings (`clean`). No hardcoded pixel/rem violations or structural syntax flaws detected by static rules.

**Visual overlays**: Browser automation and live script overlay injection were skipped because this session runs without a sub-agent browser tool (`browser_navigate` not exposed). Manual code review and design token audit applied directly to the JSX AST.

#### Overall Impression
A solid foundational hero layout with strong, vigilant copywriting that accurately captures Vanguard's authoritative brand personality. However, critical contrast degradation on the headline, decorative font usage on action buttons, and continuous opacity pulsing undermine the premium "Tactical Cyber Cockpit" feel mandated by `DESIGN.md`.

#### What's Working
- **Smart Auth-Aware Routing**: `handleGetStarted` seamlessly checks `isAuthenticated` from `useAuth()` to route existing users directly to `#services` while guiding newcomers to `/login`.
- **Clean IntersectionObserver Entrance**: The 0.2 threshold slide-in (`opacity-0 -translate-x-12` -> `opacity-100 translate-x-0`) adds intentional, non-blocking entrance polish without heavy external animation libraries.
- **Authoritative Copywriting**: "We protect your digital world before it’s attacked" directly fulfills the brand voice specified in `PRODUCT.md` (`Vigilant, High-tech, Authoritative`).

#### Priority Issues

- **[P0] What**: Headline text gradient fades into dark green (`#025714`) over a black background (`bg-gradient-to-r from-white to-[#025714]`).
- **Why it matters**: `#025714` is a very dark shade (`rgb(2, 87, 20)`). When applied via `bg-clip-text text-transparent` on a `#000000` / `#0c0c0c` surface, the right half of `<h1>` severely drops in contrast, violating WCAG `≥4.5:1` accessibility and making the brand message hard to read.
- **Fix**: Replace `#025714` in the headline text gradient with a luminous emerald/neon highlight (`#22c55e` or `#1E7D04`), or use crisp pure white text backed by a subtle emerald drop-shadow (`drop-shadow-[0_0_15px_rgba(30,125,4,0.5)]`).
- **Suggested command**: `$impeccable clarify`

- **[P1] What**: Typography separation violation — `landing-section-title` class applied to `Get Started` and `How It Works` buttons.
- **Why it matters**: `AGENTS.md` and `DESIGN.md` explicitly mandate: *"Use `Gargoyles` font exclusively for brand wordmarks and major marketing section anchors (`.landing-section-title`). Use clean system sans-serif (`system-ui, Avenir, Helvetica, Arial, sans-serif`) for all interactive scanners... and buttons to ensure maximum legibility."* Using `Gargoyles` inside action buttons looks distorted at small sizes and reduces perceived clickability.
- **Fix**: Remove `landing-section-title` from both CTA `<button>` and `<Link>` elements. Use standard bold/semibold system sans-serif with `shadow-[0_3px_12px_rgba(30,125,4,0.4)]` and `hover:shadow-[0_0_20px_rgba(30,125,4,0.8)]` (replacing `hover:opacity-70`).
- **Suggested command**: `$impeccable typeset`

- **[P1] What**: Continuous `animate-pulse` on the 700px hero illustration combined with `flex-col-reverse` mobile inversion.
- **Why it matters**: `animate-pulse` causes a continuous 50% opacity swing across a massive screen area, creating cognitive distraction. Furthermore, `flex-col-reverse` on mobile places this pulsing virus image above the headline and CTAs, forcing mobile users to scroll past a flashing graphic just to read what the product does.
- **Fix**: Remove `animate-pulse` (replace with a subtle `hover:scale-[1.02] transition-transform duration-500` or gentle CSS float animation). On mobile, change `flex-col-reverse` to standard `flex-col` so the headline and primary CTAs render at the top of the viewport (`touch-first` and `mobile-first`).
- **Suggested command**: `$impeccable polish`

#### Persona Red Flags

**Alex (Power User)**: No keyboard shortcut hints (`Press Enter to scan` or `[S] Services`). The secondary CTA (`How It Works`) uses `<Link to="/#work">`, which in standard React Router SPA setups without anchor scrolling middleware will just change the URL hash without smoothly scrolling down to `#work`.

**Sam (Accessibility-Dependent User)**: Severe text contrast failure on the right portion of the main `<h1>` due to the `to-[#025714]` gradient over black. When navigating via screen reader/keyboard, `hover:opacity-70` on the primary button lacks a distinct high-contrast `focus-visible:ring-2 focus-visible:ring-[#22c55e]` focus ring.

**Casey (Distracted Mobile User)**: On mobile screens, `flex-col-reverse` renders the large 360px illustration at the top of the screen. Casey has to scroll down past the illustration using thumb gestures just to see the `Get Started` CTA, risking immediate bounce.

#### Minor Observations
- The left column `div` uses inline string concatenation (`className={`flex-1 text-center ... ${visible ? ... : ...}`} `) which is fine, but formatting can be cleaner using standard `clsx` or template literals without multiline indentation gaps.
- `How It Works` link uses `hover:bg-[#025714] hover:text-white` on a `border-[#1E7D04] text-[#1E7D04]` button. Transitioning from `#1E7D04` text to white on `#025714` background is acceptable, but `#025714` is slightly too dark against `#000000`; `hover:bg-[#1E7D04]/20` (translucent emerald step) provides better tactical depth.

#### Questions to Consider
- "What if the hero included a live status badge (`[●] Status: Vigilant — 100% Core Systems Secure`) above the `<h1>` to immediately establish the high-tech, authoritative cyber cockpit tone?"
- "If we remove `animate-pulse` from the virus illustration, should we add subtle interactive particle tracking on mouse-move, or keep it ultra-clean and static?"
