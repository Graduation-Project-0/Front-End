# Vanguard Workspace Agent Rules & Context

## Product & Design System Reference (`PRODUCT.md` & `DESIGN.md`)

When modifying, generating, or refactoring UI components and application workflows in this repository, ALL AI agents MUST adhere strictly to the foundational specifications defined in:

- `PRODUCT.md` (Project Root): Defines the strategic vision, target users ("Everyday citizens & businesses needing rapid threat inspection"), brand personality ("Vigilant, High-tech, Authoritative"), and non-negotiable anti-references.
- `DESIGN.md` (Project Root): Defines the "Tactical Cyber Cockpit" visual specification, normative design tokens (colors, typography hierarchy, border radiuses, spacing), and strict Do's/Don'ts.

### Key Summary Guardrails for Agents:

1. **Palette & Atmosphere**: Pure cyber black (`#000000`) paired with translucent surface steps (`bg-black/40`, `#0c0c0c`) and tactical emerald/neon highlights (`#1E7D04`, `#0A3301`, `#22c55e`). Avoid generic corporate blue/purple SaaS templates.
2. **Typography Separation**: Use `Gargoyles` font exclusively for brand wordmarks and major marketing section anchors (`.landing-section-title`). Use clean system sans-serif (`system-ui, Avenir, Helvetica, Arial, sans-serif`) for all interactive scanners, telemetry charts, tables, and diagnostic reports to ensure maximum legibility.
3. **Elevation & Layout**: Flat-by-default on pure black; depth is conveyed through subtle border luminosity (`border-[#1E7D04]/50`) and emerald glow effects (`shadow-[0_3px_6px_rgba(30,125,4,0.4)]`).
4. **Interactive Shapes**: Full pill (`rounded-full`) for CTA buttons; `16px` (`rounded-2xl`) for dropzones and cards.
5. **Accessibility & Status**: Always maintain `≥4.5:1` contrast and pair explicit text/icons with color when displaying security statuses (`Status Secure`, `Status Warning`).
