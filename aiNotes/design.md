# Design

This is the placement system for UI/visual decisions: what the app's theme is, where a
UI need gets met before new CSS gets written, and which icon set is available. When
building a screen, find the primitive here first; only write new component-level CSS
for something no existing primitive covers.

Core decision, stated once: **the app has one hand-authored visual theme — a warm
rose/blush/burgundy palette on a Georgia serif typeface — expressed as hardcoded hex
values directly in each component's CSS file. It is not the CSS custom properties in
`src/index.css`.** Those variables (`--text`, `--bg`, `--accent`, etc., purple-accented)
are unmodified Vite/React template scaffolding, unused by any real screen. Do not read
them as the theme, and do not "fix" them to match without being asked — see §4.

## 0. Palette and typography

Typeface: `'Georgia', serif` (occasionally written `Georgia, "Times New Roman", serif`)
everywhere — every component CSS file that sets a font declares this same stack. No
other typeface appears anywhere in the app.

Colors are hardcoded hex, reused by convention rather than a token file:

| Hex | Role |
|---|---|
| `#fdf2ea` | Page background (cream) |
| `#fff8f5` | Panel/card surface (near-white) |
| `#da627d` | Primary brand/action color — default button fill, primary accent |
| `#a53860` | Secondary accent — headings, section labels, hover states |
| `#450920` | Darkest — body text, pressed/active states |
| `#ffa5ab` | Light pink — almost always used as a low-opacity tint (`#ffa5ab30`, `#ffa5ab50`, …) for hover backgrounds and borders, rarely at full opacity |

Opacity is layered onto these same six hexes via 2-digit hex-alpha suffixes
(`#45092040`, `#a53860aa`) rather than `rgba()` in most places, though `rgba()` appears
for shadows (e.g. `rgba(69, 9, 32, 0.06)` — always shadow-colored from `#450920`). When
adding a new tint, reuse one of the six hexes above with a hex-alpha suffix; don't
introduce a new base color.

**Gotcha:** `index.css` defines a second, unrelated set of theme variables
(`--accent: #aa3bff`, light/dark `@media (prefers-color-scheme: dark)` block, etc.).
These are leftover from the Vite template this project was bootstrapped from and are
not wired into any page, card, or `basic/` component. Do not extend them, and do not
assume the app supports dark mode — it doesn't; every hex above is a light-theme value
with no dark counterpart.

## 1. Where basic UI components live

Every generic, reusable primitive lives under `components/basic/`, one folder per
primitive (see [directoryLogic.md](directoryLogic.md) §2 for the placement/layering
rule for `basic/` itself — this file only covers what's already there and how to use
it):

| Primitive | Path | Notes |
|---|---|---|
| Button | `basic/button/button.tsx` | `variant: "primary" \| "secondary" \| "danger"` (default `primary`), optional `icon` (a lucide element, see §2), optional `disabled`. This is the **only** button implementation — never write a raw `<button>` styled ad hoc; add a variant here if a new visual treatment is needed. |
| Input | `basic/input/input.tsx` | Labeled text input, `inputMode` for numeric/tel/email keyboards on mobile. |
| Checkbox | `basic/checkbox/checkbox.tsx` | Custom-styled checkbox using the `Check` icon (§2) over a hidden native `<input type="checkbox">`, so it stays keyboard/screen-reader accessible. |
| Autocomplete | `basic/autocomplete/autocomplete.tsx` | Generic `<T>`-typed searchable select (used for both client picking and payment-method picking). |
| TimePicker | `basic/time/timePicker.tsx` | Labeled time input, string-valued (`"9:00 AM"` style, not a `Date`). |
| NavBar | `basic/navbar/navbar.tsx` | The one top-level tab bar; `PageId` union lives here and is the source of truth for nav-bar tabs. |
| Cards | `basic/cards/*Card.tsx` | Family of presentational, entity-shaped display cards (`appointmentCard`, `collectionCard`, `financeCard`, `payoutCard`). `clientCard` is **not** here — it moved to `clientsList/` because it needs feature-specific update/delete components; see directoryLogic.md §2 for why that split exists. |
| Modal | `components/modal/modal.tsx` | Portal-based dialog primitive (Esc-to-close, backdrop click, scroll lock). Not under `basic/` since it's a singleton pattern rather than a family, but is imported by feature folders the same way `basic/` components are. |

**Before writing new markup for a form field, button, toggle, or card, check this table
first.** A new screen should be composable almost entirely from these plus feature-level
CRUD components — see directoryLogic.md §2 for the feature-folder shape.

## 2. Icons

Package: **`lucide-react`**. Always a named import directly from the package:

```tsx
import { Clock, MapPin, Trash2 } from "lucide-react"
```

No icon wrapper component exists — lucide components are used inline. Conventions
observed everywhere they're used:
- Explicit `width`/`height` props, not CSS sizing — typically `14`–`18` for inline
  detail-row icons, `24` inside a `basic/cards/financeCard` icon badge.
- `aria-hidden="true"` on every icon, since the icon is always paired with adjacent
  text (a label, a detail string) that already carries the meaning.
- `strokeWidth` is only overridden when an icon needs to read at very small size (e.g.
  `Checkbox`'s embedded `Check` uses `strokeWidth={3.5}`).

Icons currently in use, as a reference set (not an allow-list — pull any other
`lucide-react` icon as needed, matching the conventions above):
`Check`, `ChevronDown`, `ChevronLeft`, `ChevronRight`, `Clock`, `Calendar`, `MapPin`,
`Phone`, `FileText`, `Trash2`, `ChartLine`, `UserCheck`, `SquareCheckBig`, `CreditCard`.

## 3. Themed-variant component pattern

When a `basic/` component needs multiple visual treatments, the established pattern is
a string-literal-union prop mapped to a CSS class suffix — not inline styles, not a
separate component per variant. Two canonical examples:
- `Button`'s `variant` prop → `btn-${variant}` class (`basic/button/button.tsx` +
  `button.css`).
- `FinanceCard`'s `colorScheme` prop (`"rose" | "deep" | "blush" | "plum"`, default
  `"rose"`) → `finance-${colorScheme}` class (`basic/cards/financeCard.tsx` +
  `financeCard.css`). Each scheme is a named role (`rose` = primary, `deep` = strong
  rose, `blush` = soft peach, `plum` = darkest/emphasis), not a raw color name — follow
  this naming style (semantic role, not hex-describing) if another themed-variant
  component is added.

## 4. Verification status

Per [aiNotes.md](../humanNotes/aiNotes.md): enforced beats specified.

Enforced mechanically today: nothing. There is no design-token file, no Stylelint rule,
no shared constants module for the palette — every hex value in §0 is duplicated by
hand across CSS files, and nothing stops a new file from introducing a seventh base
color or a second typeface.

Not yet enforced (caught only by re-reading this file):
- a new component using `rgba()`/a raw hex outside the six-color palette in §0
- a new component reading `index.css`'s dead `--accent`/`--text`/`--bg` variables
- a raw `<button>`/`<input>` styled ad hoc instead of reusing `basic/`
- an icon from a different package, or an icon missing `aria-hidden`

Next step: extract §0's palette into CSS custom properties in `index.css` (replacing
the current unused Vite-template variables), then point component CSS at `var(--...)`
instead of hardcoded hex, so a future rebrand or dark-mode pass is a one-file change and
Stylelint can flag a stray hex value. This is a real refactor, not a doc change — don't
do it as a side effect of an unrelated task; do it as its own reviewed change.

## Canonical examples

- Variant-driven `basic/` component: [basic/button/button.tsx](../src/components/basic/button/button.tsx)
- ColorScheme-driven `basic/` component: [basic/cards/financeCard.tsx](../src/components/basic/cards/financeCard.tsx)
- Full palette + typography in context: [components/basic/button/button.css](../src/components/basic/button/button.css)
