# Design

This is the placement system for UI/visual decisions: what the app's theme is, where a
UI need gets met before new CSS gets written, and which icon set is available. When
building a screen, find the primitive here first; only write new component-level CSS
for something no existing primitive covers — and even then, prefer Tailwind utility
classes over a new `.css` file (see §0).

Core decision, stated once: **the app is built on shadcn/ui (Radix primitives + Tailwind
v4 + `class-variance-authority`), styled via CSS custom properties that switch per
`data-theme` attribute on `<html>`, with a modern sans-serif typeface (Geist).** There is
no more hand-authored component CSS and no more hardcoded hex — every color is a
semantic token (`bg-primary`, `text-muted-foreground`, etc.) that resolves differently
per theme, and every component's markup is styled with Tailwind utility classes directly
in the `.tsx` file. This replaced the app's original single hand-authored rose/burgundy
palette on Georgia serif; see §0 for how that identity was preserved as one of four
selectable themes.

One documented exception: `components/calendar/calendar.tsx` (a `react-calendar` wrapper)
renders fixed vendor BEM class names (`.react-calendar__tile`, etc.) that can't take a
per-element Tailwind `className`. Tailwind's arbitrary-variant `_`→space conversion
collides with the literal double underscores in those class names (confirmed: even
`\_`-escaping still collapses to a space when Tailwind builds the descendant selector),
so that one component is themed via a `@layer components` block in `src/index.css` using
`@apply` with the same tokens/utilities instead of arbitrary-variant selectors in the
component. It's still 100% token-driven, no raw hex — just not inline-in-JSX. See the
"react-calendar" comment block in `index.css` before adding a similar vendor-component
override elsewhere.

## 0. Theming: tokens, presets, and the toggle

All theme tokens live in `src/index.css`, following shadcn's v4 convention: a `@theme
inline` block maps Tailwind color utilities (`--color-primary`, `--color-background`,
etc.) to CSS custom properties (`--primary`, `--background`, etc.), and those custom
properties are redefined per preset under `[data-theme="<name>"]` selectors. `:root`
doubles as the `slate` block (the default, applied before any theme is chosen).

Four light-only presets, defined in `src/definitions/theme.ts` (`ThemeName` union) and
`src/lib/theme.ts` (`THEMES` — the display data backing the toggle):

| Theme | Feel | Notes |
|---|---|---|
| `slate` (default) | Neutral gray-blue, professional | The baseline; no accent narrative |
| `rose` | Warm rose/blush/burgundy | Preserves the app's original hand-authored identity as a token-based preset |
| `ocean` | Blue/teal | |
| `forest` | Green | |

No dark mode — every preset is light-only. If dark mode is added later, follow shadcn's
`.dark` class convention and update this section.

**How switching works:** `components/themeProvider/themeContext.ts` defines the
`ThemeContext` (a plain `createContext`, kept in its own file so neither the provider nor
the hook file mixes component and non-component exports — Vite Fast Refresh requires
that separation, enforced by `eslint-plugin-react-refresh`).
`components/themeProvider/themeProvider.tsx` is the `ThemeProvider` component — persists
the selection via the existing generic `hooks/useLocalStorage.ts` hook (key `"theme"`,
default `"slate"`) and sets `document.documentElement.dataset.theme` in a `useEffect`.
Mounted once, wrapping `<Home />` in `App.tsx`. `hooks/useTheme.ts` is the consumer hook.
`basic/themeToggle/themeToggle.tsx` is the visible control (a `ui/select`), mounted in
`pages/home.tsx`'s sticky header.

Typeface: **Geist Variable** (`@fontsource-variable/geist`, self-hosted via npm — not a
runtime webfont fetch), set as `--font-sans` in the `@theme inline` block. No other
typeface appears anywhere in the app.

**Gotcha carried forward from before this migration:** don't add a second base color or
a raw hex anywhere in `src/components/` — every color should be a token
(`bg-primary`, `text-muted-foreground`, `border-border`, …) so it stays theme-aware
across all four presets. A literal hex in a `className` or inline style is a smell.

## 1. Where basic UI components live

Every generic, reusable primitive lives under `components/basic/`, one folder per
primitive (see [directoryLogic.md](directoryLogic.md) §2 for the placement/layering
rule for `basic/` itself — this file only covers what's already there and how to use
it). Since this migration, **every one of these is a thin, prop-API-preserving wrapper
around one or more `components/ui/*` primitives** (shadcn's CLI-managed output — see
directoryLogic.md §1) plus Tailwind utility classes; none hand-roll their own CSS file
anymore.

| Primitive | Path | Built from | Notes |
|---|---|---|---|
| Button | `basic/button/button.tsx` | `ui/button` | `variant: "primary" \| "secondary" \| "danger"` (default `primary`) maps internally to shadcn's `default`/`secondary`/`destructive`. Accepts an optional `className` (forwarded to `ui/button`) for one-off layout needs like `w-full`/`flex-1` — still the **only** button implementation, never write a raw `<button>` styled ad hoc. |
| Input | `basic/input/input.tsx` | `ui/input` + `ui/label`, or `ui/input-group` when `prefix` is set | Labeled text input, `inputMode` for numeric/tel/email keyboards on mobile. Optional `prefix` (e.g. `"$"`) switches internally to `ui/input-group` for a leading glyph — only opt in when a field genuinely needs one (currency, etc). |
| Checkbox | `basic/checkbox/checkbox.tsx` | `ui/checkbox` + `ui/label` | Radix-backed, keyboard/screen-reader accessible natively (no more hand-rolled focus-ring CSS). |
| Switch | `basic/switch/switch.tsx` | `ui/switch` + `ui/label` | Labeled toggle row (`label` + optional `description` + `checked`/`onChange`), renders its own row layout unlike `Checkbox`. Use for a single on/off setting with explanatory text (e.g. client active/inactive); use `Checkbox` for a plain list-item toggle. |
| Autocomplete | `basic/autocomplete/autocomplete.tsx` | `ui/popover` + `ui/command` | Generic `<T>`-typed searchable select (used for both client picking and payment-method picking). Click-to-open trigger button showing the current selection, per shadcn's combobox pattern — no longer a live-typing-always-visible field (was `downshift`-based before). |
| TimePicker | `basic/time/timePicker.tsx` | `ui/popover` + `ui/select` ×3 | Labeled time input, string-valued (`"9:00 AM"` style, not a `Date`). Hour/minute/AM-PM as three `Select`s plus a "Now" button, replacing the old hand-rolled scroll-column dropdown. |
| NavBar | `basic/navbar/navbar.tsx` | `ui/tabs` | The one top-level tab bar; `PageId` union lives here and is the source of truth for nav-bar tabs. |
| ThemeToggle | `basic/themeToggle/themeToggle.tsx` | `ui/select` | See §0. |
| Toast | `basic/toast/toast.tsx` | — (plain Tailwind) | Fixed-position stack of auto-dismissing (5s) error/status messages, rendered once in `App.tsx`. No `ui/toast`/`sonner` primitive exists yet, so this is styled directly with token classes (`bg-foreground`/`text-background` for a high-contrast inverted chip) rather than a `ui/*` wrapper — if a shadcn toast primitive is added later, migrate this onto it. The only surface `notify()` (see [errorHandling.md](errorHandling.md) §6) renders through — never a per-feature ad-hoc banner. |
| Cards | `basic/cards/*Card.tsx` | `ui/card` | Family of presentational, entity-shaped display cards (`appointmentCard`, `collectionCard`, `financeCard`, `payoutCard`, `paymentHistoryCard`). Still hand-manage `role="button"` + keyboard handling for clickable cards — Radix has no interactive-card primitive. `clientCard` is **not** here — it moved to `clientsList/` because it needs feature-specific update/delete components; see directoryLogic.md §2 for why that split exists. |
| Modal | `components/modal/modal.tsx` | `ui/dialog` (desktop) + `ui/drawer` (mobile) | Responsive: switches on `hooks/useMediaQuery.ts` at the existing 560px breakpoint — Radix `Dialog` centered on desktop, Vaul `Drawer` bottom-sheet on mobile, matching the pre-migration behavior. Esc-close, backdrop-click, focus trap, and scroll lock are now handled natively instead of hand-rolled. Not under `basic/` since it's a singleton pattern rather than a family. |

**Before writing new markup for a form field, button, toggle, or card, check this table
first.** A new screen should be composable almost entirely from these plus feature-level
CRUD components — see directoryLogic.md §2 for the feature-folder shape.

## 2. Icons

Package: **`lucide-react`**. Always a named import directly from the package:

```tsx
import { Clock, MapPin, Trash2 } from "lucide-react"
```

No icon wrapper component exists — lucide components are used inline, both directly and
inside `ui/*` primitives (shadcn's generated components also default to lucide).
Conventions observed everywhere they're used:
- Explicit `width`/`height` props, not CSS sizing — typically `14`–`18` for inline
  detail-row icons, `24` inside a `basic/cards/financeCard` icon badge.
- `aria-hidden="true"` on every icon, since the icon is always paired with adjacent
  text (a label, a detail string) that already carries the meaning.
- `strokeWidth` is only overridden when an icon needs to read at very small size.

Icons currently in use, as a reference set (not an allow-list — pull any other
`lucide-react` icon as needed, matching the conventions above):
`Check`, `CheckCircle2`, `ChevronDown`, `ChevronsUpDown`, `ChevronLeft`, `ChevronRight`,
`Clock`, `Calendar`, `ChartLine`, `Users`, `MapPin`, `Phone`, `FileText`, `Trash2`,
`UserCheck`, `SquareCheckBig`, `CreditCard`, `Palette`, `Plus`, `X`.

## 3. Themed-variant component pattern

When a `basic/` component needs multiple visual treatments, the established pattern is
a string-literal-union prop mapped to Tailwind classes (via a lookup object or, inside
`ui/*` primitives, `class-variance-authority`) — not inline styles. Two canonical
examples:
- `Button`'s `variant` prop → mapped to a shadcn `ui/button` `variant` (`basic/button/button.tsx`).
- `FinanceCard`'s `colorScheme` prop (`"rose" | "deep" | "blush" | "plum" | "berry" |
  "coral"`, default `"rose"`) → a `COLOR_SCHEME_CLASSES` lookup onto the theme's
  `chart-1`..`chart-5` + `primary` tokens (`basic/cards/financeCard.tsx`). Each scheme is
  a named role, not a raw color name, and each is theme-aware by construction since it
  reads chart tokens rather than fixed hexes — follow this naming style (semantic role,
  token-backed) if another themed-variant component is added.

## 4. Verification status

Per [aiNotes.md](../humanNotes/aiNotes.md): enforced beats specified.

Enforced mechanically today: nothing new — Tailwind/shadcn make a stray hex or a second
typeface easy to avoid (the token system is the path of least resistance), but nothing
in CI actually blocks one.

Not yet enforced (caught only by re-reading this file):
- a new component using a raw hex or `rgba()` instead of a token/Tailwind color utility
- a raw `<button>`/`<input>` styled ad hoc instead of reusing `basic/` or `ui/`
- an icon from a different package, or an icon missing `aria-hidden`
- a `.dark` block or a fifth theme preset added without updating §0's table
- a new `@layer components` override added to `index.css` for something that isn't a
  vendor component with fixed class names (the react-calendar exception above is meant
  to stay singular — check the primitives table in §1 first)

Previous next-step ("extract the palette into CSS custom properties so a rebrand or
theme pass is a one-file change") is **done** — that's exactly what this migration did.
Next step now: a Stylelint (or `eslint-plugin-tailwindcss`) rule flagging a raw hex
literal inside `src/components/**/*.{ts,tsx}`, so a regression back to hand-rolled colors
fails `npm run lint` instead of waiting for review.

## Canonical examples

- Variant-driven `basic/` component: [basic/button/button.tsx](../src/components/basic/button/button.tsx)
- ColorScheme-driven `basic/` component: [basic/cards/financeCard.tsx](../src/components/basic/cards/financeCard.tsx)
- Responsive Dialog/Drawer composition: [components/modal/modal.tsx](../src/components/modal/modal.tsx)
- Theme system end to end: [components/themeProvider/](../src/components/themeProvider/), [hooks/useTheme.ts](../src/hooks/useTheme.ts), [basic/themeToggle/themeToggle.tsx](../src/components/basic/themeToggle/themeToggle.tsx), token definitions in [../src/index.css](../src/index.css)
- Vendor-component theming exception (`@apply` in `index.css` instead of inline Tailwind): [components/calendar/calendar.tsx](../src/components/calendar/calendar.tsx) + the "react-calendar" `@layer components` block in [../src/index.css](../src/index.css)
