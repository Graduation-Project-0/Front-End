---
target: src/pages/Dashboard.jsx
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-07-11T18-42-32Z
slug: src-pages-dashboard-jsx
---
Method: ⚠️ DEGRADED: single-context (no sub-agent tool exposed in this session)

#### Design Health Score
> *Consulting the Heuristics Scoring Guide.*

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading state and error banners are clear; no real-time refresh indicator or timestamp for recent history. |
| 2 | Match System / Real World | 3 | Technical status language fits cybersecurity defense well, though micro-labels (`9px`) and raw `No scans` feel clinical. |
| 3 | User Control and Freedom | 3 | Chart time range selector (`Full year`, `6m`, `3m`), recent scans toggle, and profile photo toggle give users solid control. |
| 4 | Consistency and Standards | 2 | Tooltip renders a bright `#ffffff` box inside a `#0d0d0d` cockpit; `#7CFF8A` chart green diverges from `DESIGN.md` `#22c55e`; `text-[9px]` & `text-[10px]` fall off the design system type ramp. |
| 5 | Error Prevention | 3 | `LogoutConfirmDialog` prevents accidental session end; graceful fallback handling for missing avatars and API timeouts. |
| 6 | Recognition Rather Than Recall | 2 | Recent scans table hides the item name (`scan.item`) whenever `scan.type` exists, forcing users to recall which filename or URL corresponds to `File | Clean`. |
| 7 | Flexibility and Efficiency | 3 | Quick chart export button (`Reports / PNG`) and clean time-window filtering. |
| 8 | Aesthetic and Minimalist Design | 3 | Strong black canvas (`#000000` / `#0d0d0d`) with subtle green border glows. Weakened by illegible `9px` footer metrics inside cards and chart palette drift. |
| 9 | Error Recovery | 3 | Clear `Retry` action inside the amber alert banner on API timeout or network failure. |
| 10 | Help and Documentation | 3 | Navigation includes quick links to `/terms`/Help, but empty states like `No scans` lack actionable onboarding guidance. |
| **Total** | | **28/40** | **Good (Address weak areas, solid foundation)** |

#### Anti-Patterns Verdict

**LLM assessment**:
- **Tactical Cyber Cockpit alignment**: The page captures the pure black `#000000` / `#0d0d0d` foundation, `16px` (`rounded-2xl`) card containers, and emerald highlights (`#009e28`, `#1E7D04`) required by `DESIGN.md`.
- **Micro-type Slop / Clutter**: Hardcoding `text-[9px]` (`0.56rem`) for `THREAT/CLEAN` stat card footers and `text-[10px]` for card titles/chart labels violates both basic accessibility standards and `DESIGN.md`'s typography scale (whose floor is `14px` (`0.875rem`)).
- **Tone & Surface Mismatch**: The Recharts tooltip in `DashboardScansChart.jsx` renders a stark, bright white box (`bg-white border border-neutral-200 color: #000000`), completely shattering the dark tactical cockpit aesthetic during user interaction.

**Deterministic scan**:
- **Detector CLI Results**: `detect.mjs` identified **11 findings**:
  - `3 warning`: `gray-on-color` reported on lines 596 and 616 (`text-gray-400 on bg-green-500`, `text-gray-200 on bg-green-500`, `text-gray-500 on bg-green-500`). **Note on False Positives**: These 3 warnings are deterministic static regex matches inside ternary template strings (`isActive ? "bg-green-500/15 text-green-400" : "text-gray-400 hover:bg-white/5..."`). When `isActive` is false, `text-gray-400` rests on `bg-white/5` or `bg-gray-800` (`#1f2937`), not `bg-green-500`.
  - `8 advisory`: `design-system-font-size` on lines 347, 392, 440, 461, 488, 595, 626, 628 (`text-[9px]` and `text-[10px]`). These accurately flag off-ramp typography violations across stat cards and mobile nav links.
  - `5 advisory` in `DashboardScansChart.jsx`: Undocumented colors `#7CFF8A`, `#e8ffe8`, and `#6b7280` outside the `DESIGN.md` palette.

**Visual overlays**:
- Browser automation (`spawn_agent` / Playwright visual canvas) was not invoked in this single-context run; deterministic CLI results were verified via direct AST and source inspection.

#### Overall Impression
`Dashboard.jsx` provides a solid, responsive, and functional overview of scan telemetry. It handles API data cleanly and adheres well to the flat black / emerald glow layout rules. However, its visual polish is compromised by illegible micro-typography (`9px`/`10px`), an jarring bright-white chart tooltip, and an uninformative recent scans table when `scan.type` overrides `scan.item`.

#### What's Working
1. **Engineered Dark Cockpit Foundation**: The pure black (`#000000`) body paired with `#0d0d0d` containers and translucent border steps (`border-gray-900`, `border-[#1E7D04]/50`) creates an authoritative, OLED-friendly cybersecurity dashboard.
2. **Resilient Data Normalization & Error Recovery**: `normalizeRecentScans` and `resolveDashboardUserName` handle varied backend payload formats seamlessly, while the top-level error banner provides an immediate, non-destructive `Retry` button.
3. **Adaptive Mobile & Desktop Shell**: The layout smoothly switches between a fixed 64px sidebar (`aside`) on desktop and a sticky pill top bar on mobile without introducing layout shift or vertical overflow clipping (`safe-area-inset-bottom`).

#### Priority Issues

- **[P1] Micro-Typography Below Legibility Threshold (`text-[9px]` & `text-[10px]`)**
  - **Why it matters**: `DESIGN.md` establishes a label minimum floor of `14px` (`0.875rem`). Hardcoded `9px` and `10px` text inside stat card footers (`THREAT: 0 | CLEAN: 0`), chart axes, and mobile nav labels fails WCAG contrast/legibility guidelines and creates cramped visual noise (`extraneous cognitive load`).
  - **Fix**: Elevate all `text-[9px]` and `text-[10px]` elements to `text-xs` (`12px font-semibold uppercase tracking-wider`) or `text-sm font-medium` (`14px`) to align with the documented type ramp.
  - **Suggested command**: `$impeccable typeset`

- **[P1] Chart Palette & Tooltip Token Drift (`#7CFF8A` vs `#22c55e` & Hardcoded White Tooltip Box)**
  - **Why it matters**: The `MonthScansTooltipBody` component hardcodes a bright `#ffffff` white box with `#000000` text (`style={{ backgroundColor: "#ffffff" }}`), creating a jarring visual flash when hovering over data points in a `#0d0d0d` dark dashboard. Furthermore, `#7CFF8A` pastel green conflicts with `DESIGN.md`'s normative `#22c55e` / `#4ade80` emerald spectrum (`consistency heuristic #4`).
  - **Fix**: Replace `#7CFF8A` with `#22c55e` or `#4ade80` across `AreaChart` stops and strokes. Refactor `MonthScansTooltipBody` to use an elevated dark surface (`bg-[#0c0c0c] border border-[#1E7D04]/50 text-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8)]`).
  - **Suggested command**: `$impeccable colorize`

- **[P2] Ambiguous "No scans" Empty State & Omitted Scan Target Names in Table Rows**
  - **Why it matters**: When `recentScans` is empty, displaying only `"No scans"` violates `reference/product.md` ("Empty states that teach the interface, not 'nothing here'"). In populated rows, rendering only `scan.type` ("File") and `scan.result` ("clean") while omitting the actual filename or URL (`scan.item`) forces users to guess or remember which file or domain corresponds to each entry (`recognition over recall`).
  - **Fix**: When `recentScans.length === 0`, render an educational empty state with quick action links to `/file`, `/url`, and `/email`. In populated table rows, display `scan.item` (`domain.com` or `report.pdf`) as the primary truncated cell, with `scan.type` (`URL`, `File`) shown as a secondary badge or subtitle.
  - **Suggested command**: `$impeccable clarify`

- **[P2] Profile Photo Uploader & Interactive Table Lack Explicit Keyboard Focus Indicators**
  - **Why it matters**: Keyboard-only users (`Sam`) and fast navigators (`Alex`) cannot clearly discern when the custom profile photo uploader `<label>` receives focus, because the hidden file input (`opacity-0`) swallows standard focus styling unless `focus-within:ring-2 focus-within:ring-[#1E7D04]` is verified on the visible container border.
  - **Fix**: Add explicit `focus-within:ring-2 focus-within:ring-[#1E7D04] focus-within:border-green-500` to the outer `<label className="relative block h-10 w-10...">` wrapper.
  - **Suggested command**: `$impeccable harden`

#### Persona Red Flags

**Alex (Power User)**:
- Recent scans table hides the exact target (`scan.item`), preventing Alex from quickly verifying whether `File | Clean` refers to `malware.exe` or `invoice.pdf` without navigating away.
- No keyboard shortcut (`/?` command or quick keys) to jump immediately into a new File, URL, or Email scan right from the Dashboard.

**Jordan (First-Timer)**:
- Upon logging into a brand new account, the `Recent Scan` panel simply shows `"No scans"` with no button or helpful prompt explaining how to initiate their first security inspection.
- Tiny `9px` footer text inside stat cards (`THREAT: 0 | CLEAN: 0`) is difficult to read and interpret at a glance.

**Sam (Accessibility-Dependent User)**:
- `text-[9px]` (`0.56rem`) and `text-[10px]` (`0.625rem`) typography severely fails minimum font scaling and legibility requirements for low-vision users.
- The custom profile photo uploader hides `<input type="file" opacity-0 />`; without strong high-contrast visible focus styling on the outer avatar ring when tabbed to, keyboard navigation loses focus tracking.

#### Minor Observations
- The `Free Account` label (`text-[10px] uppercase text-gray-500`) could be rendered as a crisp `rounded-full border border-gray-800 bg-gray-900/60 px-2 py-0.5 text-xs font-semibold text-gray-400` pill badge for higher polish.
- In `Dashboard.jsx:484`, `custom-scrollbar` is applied along with `pr-2`. Ensuring `custom-scrollbar` uses a subtle emerald thumb on `#0d0d0d` (`&::-webkit-scrollbar-thumb`) prevents bright OS scrollbars from appearing in Windows/Linux browsers.

#### Questions to Consider
- "What if the `Recent Scan` table showed the exact filename or domain (`scan.item`) right beside the status badge so users never have to second-guess what was tested?"
- "Could the `No scans` table row become an inviting dropzone or three-column quick launcher for File, URL, and Email inspections?"
- "Does the chart tooltip need a bright white background, or would a sleek `#0c0c0c` elevated dark card with emerald border luminosity feel much more cohesive?"
