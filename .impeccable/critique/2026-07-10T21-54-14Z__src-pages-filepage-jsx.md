---
target: src/pages/FilePage.jsx
total_score: 19
p0_count: 1
p1_count: 3
timestamp: 2026-07-10T21-54-14Z
slug: src-pages-filepage-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No visual drag-over (`isDragging`) feedback when hovering files; no loading state during `?target=` auto-fetch from URL. |
| 2 | Match System / Real World | 2 | Floating instructions toggle uses the company logo (`/logo.svg`) instead of a `?` help icon; trailing typo (`complete''`) on step 7. |
| 3 | User Control and Freedom | 2 | No "Remove / Clear" button to unstage a dropped file before scanning; no "Cancel Scan" button during active scanning. |
| 4 | Consistency and Standards | 1 | Severe violations of `DESIGN.md`: uses `rounded-xl` and off-spec gradient (`from-green-600 to-green-800`) with arbitrary `shadow-[0_0_20px]` on button; AI-slop gradient text (`italic bg-gradient-to-r from-green-400 to-white bg-clip-text`) on `h1` instead of clean system sans-serif `Headline` token. |
| 5 | Error Prevention | 2 | Dropzone accepts any file type/size without frontend validation despite 100MB instruction limit; failed URL file fetches (`fetch(targetUrl)`) fail silently without user-facing error (`apiError`). |
| 6 | Recognition Rather Than Recall | 2 | Staged file state only displays `File ready: ${file.name}` in plain gray text without file size, extension badge, hash preview, or readiness check indicator. |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcut (`Enter` to scan, `Esc` to clear staged file or close modal); instructions modal lacks backdrop click or `Esc` dismiss. |
| 8 | Aesthetic and Minimalist Design | 2 | Gradient text and arbitrary green neon drop shadows (`shadow-[0_0_20px]`) create AI-slop visual clutter; drop container looks empty and un-engineered when a file is staged. |
| 9 | Error Recovery | 2 | Error messages (`Scan failed. Please try again.`) are generic without diagnostic specifics or concrete next steps for remediation. |
| 10 | Help and Documentation | 2 | Critical 7-step pre-scan safety guide is hidden behind an unlabelled bottom-right company logo button where first-time users won't find it before opening downloaded `.exe` files. |
| **Total** | | **19/40** | **Poor (Major UX overhaul required; core experience broken)** |

#### Anti-Patterns Verdict

**LLM assessment**: `FilePage.jsx` exhibits clear AI-slop and cross-register anti-patterns that directly contradict `PRODUCT.md` ("Tactical Precision", "Anti-references: generic SaaS templates") and `DESIGN.md` ("The Flat Canvas Rule", "The Purposeful Display Rule"). Specifically, the hero `h1` applies decorative `gradient-text` with `italic` (`bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent italic`), which is explicitly banned in both the global `SKILL.md` and `DESIGN.md`. The primary CTA button abandons the normative `button-primary` token (`rounded-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301]`) in favor of an arbitrary `rounded-xl from-green-600 to-green-800` fill paired with a neon cyberpunk drop shadow (`shadow-[0_0_20px_rgba(0,255,0,0.3)]`). Furthermore, the dropzone container lacks active drag states (`isDragging`) and metadata scaffolding when a file is staged, making the UI feel like a superficial prototype rather than a high-tech, authoritative cyber cockpit.

**Deterministic scan**: The `detect.mjs` CLI scanner confirmed **2 warnings** inside `src/pages/FilePage.jsx`:
- `gradient-text` (Line 87): `bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent` on the `h1` heading. Decorative gradient clipping on text violates readability and brand authority.
- `border-accent-on-rounded` (Line 110): `border-b-2 border-green-500` applied to a `rounded-full` spinning div (`animate-spin`), creating a spinning border-bottom crescent artifact that reads as an un-engineered default spinner rather than a tactical scan state.

**Visual overlays**: Live browser script injection and user-visible overlays (`[Human]` tab) were skipped (`fallback: CLI detector used because browser automation tools are not exposed in this session`).

#### Overall Impression

The page establishes a strong dark atmosphere with its `#000000` canvas and `/service.png` backdrop, but it falls short of Vanguard's "Tactical Cyber Cockpit" standard (`DESIGN.md`). The core dropzone interaction feels under-engineered: there is no drag-over visual feedback, staged files look indistinguishable from an empty dropzone aside from text, critical safety instructions are buried behind an unlabelled logo icon in the bottom-right corner, and the primary typography/CTA buttons violate core design system tokens. Transforming this into an authoritative defense tool requires stripping out the AI-slop gradient text/shadows, engineering a rich staged-file metadata card (`Staged Asset Card`), and surfacing the safety checklist directly in the primary visual hierarchy.

#### What's Working

- **Committed Dark Foundation**: The use of pure black (`#000000`) paired with translucent surface steps (`bg-black/40`) successfully avoids generic cream/light SaaS defaults and preserves OLED contrast (`DESIGN.md` Section 1).
- **URL Query Auto-Staging Workflow**: The `useEffect` hook listening to `?target=` in `location.search` (`lines 15-29`) provides an excellent technical foundation for seamless cross-app file scanning from external Vanguard tools or browser extensions.
- **Controlled Dropzone Glass Framing**: The dropzone container's base border luminosity (`border-green-800/50`) and responsive padding (`p-6 sm:p-10`) adhere well to flat-by-default tonal layering (`DESIGN.md` Section 5).

#### Priority Issues

- **[P0] What**: Hidden critical pre-scan safety instructions (`showInstructions`).
  - **Why it matters**: Vanguard's primary users (`Everyday users evaluating suspicious file downloads`) must be instructed NOT to run or open `.exe` files before scanning. Hiding the 7-step instructions inside a floating popover triggered by an unlabelled bottom-right company logo (`/logo.svg`) ensures users (especially first-timers like Jordan) will miss critical safety warnings and potentially infect their system before uploading.
  - **Fix**: Move the safety guidance out of the unlabelled bottom-right logo button and integrate it as a clear, scannable "Pre-Scan Safety Checklist" card or inline accordion directly above or alongside the dropzone container. Replace the clickable `<img>` with standard semantic `<button>` elements if retained as a toggle.
  - **Suggested command**: `$impeccable onboard`

- **[P1] What**: Un-engineered dropzone interactive states and bare file-staged representation.
  - **Why it matters**: When a user drags a file over the container (`handleDragOver`), there is zero visual change because `isDragging` state is not tracked. Once dropped, the UI only renders plain text `File ready: ${file.name}`. Users receive no confirmation of file size, file extension badge, hash, or validation readiness (`Heuristic 1` & `Heuristic 6`).
  - **Fix**: Implement an `isDragging` state that shifts the dropzone to `bg-black/50 border-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.2)]`. When `file != null`, replace the drop prompt with an engineered `Staged Asset Card` showing the file icon, name, formatted file size (e.g. `24.5 MB`), extension badge (`EXE`), and a clear `[X Remove]` button to clear or replace the selection without re-opening the file browser.
  - **Suggested command**: `$impeccable shape`

- **[P1] What**: Non-compliant CTA button styling (`rounded-xl` and `from-green-600 to-green-800`).
  - **Why it matters**: `DESIGN.md` Section 5 mandates exact button tokens (`rounded-full`, `bg-gradient-to-r from-[#1E7D04] to-[#0A3301]`). Using `rounded-xl` (`12px`), arbitrary green gradient stops (`from-green-600 to-green-800`), and `shadow-[0_0_20px_rgba(0,255,0,0.3)]` creates inconsistency across Vanguard surfaces (`Heuristic 4`) and degrades technical authority into AI-slop aesthetics (`SKILL.md` Absolute bans).
  - **Fix**: Update the button to use `rounded-full` (`9999px`), exact `bg-gradient-to-r from-[#1E7D04] to-[#0A3301] hover:opacity-90`, and remove `shadow-[0_0_20px_...]` in favor of a clean, crisp `focus-visible:ring-2 focus-visible:ring-green-500/40` outline (`DESIGN.md` Section 5).
  - **Suggested command**: `$impeccable polish`

- **[P1] What**: AI-slop gradient and italic display heading on `h1`.
  - **Why it matters**: `DESIGN.md` Section 3 ("The Purposeful Display Rule") specifies that page titles inside authenticated tools (`File Page`) must use clean system sans-serif (`Headline: 700, 2.25rem, -0.02em`). Applying `bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent italic` makes the primary heading harder to read (`SKILL.md` gradient text ban) and feels like a generic marketing template rather than a tactical defense console (`Heuristic 8`).
  - **Fix**: Replace the `gradient-text` and `italic` classes on the `h1` (`line 87`) with solid `text-white font-bold tracking-tight text-3xl md:text-4xl` (`system-ui` clean sans-serif) to ensure maximum legibility and tactical authority.
  - **Suggested command**: `$impeccable typeset`

- **[P2] What**: Missing frontend file size validation and silent `targetUrl` error handling.
  - **Why it matters**: Step 5 of the instructions warns `Ensure file size is under 100MB (larger files not supported)`, but `handleFileChange` and `handleDrop` accept any file regardless of size (`Heuristic 5: Error Prevention`). If a user drops a 500MB file, it fails only after starting the network upload. Additionally, if background fetching of `?target=` fails in `useEffect`, the error is swallowed into `console.error` without alerting the user (`Heuristic 9`).
  - **Fix**: Add immediate frontend validation in `handleFileChange`/`handleDrop` (`if (selectedFile.size > 100 * 1024 * 1024) setApiError("File exceeds 100MB limit.")`). In `useEffect`, set `apiError("Could not retrieve file from URL parameter.")` if `fetch(targetUrl)` fails, and add a loading spinner while `isFetchingTarget` is true.
  - **Suggested command**: `$impeccable harden`

#### Persona Red Flags

- **Alex (Power User)**:
  - No `Enter` keyboard shortcut to immediately trigger `handleScan()` once a file is staged.
  - No `Esc` keyboard handler to unstage/clear a dropped file or close the floating instructions modal.
  - No SHA-256/MD5 hash calculation preview shown for the staged asset prior to scan submission to verify file integrity.

- **Jordan (First-Timer)**:
  - Critical safety instructions ("Do NOT run or open the file yet, scan it first") are hidden behind an unlabelled bottom-right company logo icon (`/logo.svg`). Jordan will not realize clicking the brand mark opens safety procedures.
  - No visual drag-over feedback (`isDragging` border/background glow) when dragging an `.exe` file across the window, leaving Jordan anxious about whether dropping will accidentally execute or download the file.
  - Generic error feedback (`Scan failed. Please try again.`) provides zero guidance on why the scan failed or what to check next.

- **Sam (Accessibility-Dependent User)**:
  - The dropzone container (`<div onDrop={...} onDragOver={...}>`) is not keyboard focusable (`tabIndex={0}`) and lacks `role="button"` or `aria-label="Upload file dropzone"`, preventing screen reader users from discovering drag-and-drop mechanics or triggering file selection via spacebar/enter on the container.
  - The instructions floating trigger (`<img src="/logo.svg" onClick={...} />`) is a non-semantic `<img>` with `onClick` rather than a `<button>` tag. It cannot be focused with `Tab` and lacks `aria-expanded` and `aria-controls`.
  - During `isScanning = true`, there is no `role="status"` or `aria-live="polite"` announcement informing screen readers of ongoing scan progress or completion.

#### Minor Observations

- Line 198 (`Wait 10-30 seconds for multi-engine scanning to complete'`) contains an erroneous trailing single quotation mark (`complete'`).
- Line 208 (`w-15 h-15`) uses an invalid default Tailwind spacing scale (`15` is not a standard utility class in Tailwind v3 unless customized; should be `w-16 h-16` or `w-[60px] h-[60px]`).
- Line 50 (`localStorage.getItem("token")`) could gracefully check if `token` exists before sending `headers: { Authorization: ... }`, or show an authentication warning if expired.

#### Questions to Consider

- "What if the pre-scan safety instructions were integrated directly as a persistent, tactical checklist above the dropzone so every user sees them before dropping a file?"
- "What would a confident, engineered 'Staged Asset Card' look like when a file is dropped—could displaying its calculated SHA-256 hash and extension badge elevate user trust?"
- "Does the page need floating modal popovers at all, or should all primary guidance and error diagnostics live inline within the clean `#000000` canvas?"
