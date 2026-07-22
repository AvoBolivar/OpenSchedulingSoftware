# add.md — task intake

## How to process this file (read this first, every time)
1. Read the global context file (`aiNotes/global.md`). Then load topic files per
   the triggers in `prompts/addContext.md` §1 — the TASK's `Where` section states
   which apply.
2. Identify the target module from the TASK. Read its local CLAUDE.md if one
   exists; otherwise rely on the Follow-this-example. Do not load unrelated
   modules.
3. Restate the task + your plan in 3–5 bullets, surfacing any judgment call the
   task leaves open, then STOP and wait for "go" before writing any code.
4. Implement, matching the shape of the referenced example.
5. Run verification until green: npx tsc -b → npm run lint → npm run test.
6. Report: files touched, what you added, any test you updated and why, anything
   you could NOT verify.

---

## TASK  (one task per run — clear this section before the next)

### What
Expand the Finance page so the user can review and manage payments after the fact, not
just see what's currently outstanding. Right now `usePaymentStore` and
`collectionsList/readCollections.tsx` only ever show *unpaid* payments (money owed by
clients, money owed to the helper) — once a payment is marked received it disappears
with no way to see or edit it again. Add:

1. **A payment history list** on the Finance page showing every payment that has been
   received (`payment.paymentReceived === true`), most recent first, each row showing
   the **client's name**, the **payment method** (`payment.method` — venmo/check/zelle,
   per `collectionsList/updateCollection.tsx`'s `PAYMENT_METHODS`), and the **date the
   payment was received** (`payment.date`).
2. **Editing from that list**: clicking a row must let the user edit the same fields
   they can already edit from the outstanding-collections flow (rate, method,
   received/not-received, delete) — reuse the existing edit UI rather than building a
   second one.
3. **Two new summary figures** on the Finance page, alongside the existing "This Week
   / This Month / Total Owed / Owed to Ines" cards: the total the user has collected
   **before** paying the helper (gross — sum of `appointment.charge` across all
   received payments), and what's left **after** the helper/expenses have actually been
   paid out (net — gross minus `appointment.expense` summed across payments where
   `expensesPaid === true`). These are running totals, not week/month-scoped like the
   existing two — the ask is "how much have I made overall," not "this week."

### Where
- `src/stores/usePaymentStore.ts` — new selectors (see Acceptance criteria). Local
  context: `src/stores/CLAUDE.md` exists — read it.
- `src/components/collectionsList/` — new list component for payment history; this
  folder already owns all Payment-entity UI (`readCollections.tsx`,
  `updateCollection.tsx`), so the history view belongs here too, not in a new folder.
  No local `CLAUDE.md` for this component folder — rely on Follow-this-example instead.
- `src/components/basic/cards/` — new presentational card for a history row (see
  Follow-this-example for why it belongs here, not in `collectionsList/`). No local
  `CLAUDE.md` for this folder either — rely on `aiNotes/design.md` §1's table and
  Follow-this-example.
- `src/pages/financePage.tsx` — wire in the new list + two new `FinanceCard`s. Local
  context: `src/pages/CLAUDE.md` exists — read it.

**Topic files that apply, per `prompts/addContext.md` §1's trigger table:**
- `aiNotes/directoryLogic.md` — yes, this creates new files (§2's card-placement
  algorithm and feature-folder conventions, §3's naming rules).
- `aiNotes/testing.md` — yes, this adds/changes tests (almost the whole task).
- `aiNotes/design.md` — yes, this adds user-visible UI (§0's palette, §1's card
  table, §3's themed-variant pattern for the two new `FinanceCard`s).
- `aiNotes/errorHandling.md` — **not triggered.** No new fallible/IO/validation code is
  introduced; this reuses existing store actions (`updatePayment`, `deletePayment`)
  that already don't return `Result`. Don't load it, and don't introduce `Result` types
  here — see Out of scope.

### Follow this example
**List logic — deviates from `readCollections.tsx`, and here's why:**
`collectionsList/readCollections.tsx` reads raw `payments` from `usePaymentStore` and
does its join (`getAppointment` → `getClient`) and dangling-reference guard
(`if (!appointment) return null` / `if (!client) return null`) **inline in the
component** — it does not call the store's existing `getPaymentsOwed`/
`getPaymentsToPayout` selectors, even though those selectors already do the same
join-and-filter and would make the component thinner. Do not copy that inline-join
shape for the new list. Instead, push the join/filter/sort into a new store selector
(matching what `getPaymentsOwed`/`getPaymentsToPayout` already do, just carried all the
way through instead of duplicated in the component) — see `getReceivedPayments()`
below. The payoff: the join/guard/sort logic becomes unit-testable per `testing.md`
§1.1, and `readPaymentHistory.tsx` becomes a thin render with no guard of its own,
since dangling entries never reach it.

**Card — belongs in `basic/cards/`, not `collectionsList/`:** follow
`directoryLogic.md` §2's card-placement algorithm: start presentational (props in,
`onClick` out), and only move a card into a feature folder once it needs to import that
feature's own `update`/`delete` component. The new card just displays a name, method,
and date and reports clicks via `onClick` — exactly like `collectionCard.tsx` and
`payoutCard.tsx` already do — so it stays in `basic/cards/`. Its props should be
`{ client: Client; payment: Payment; onClick: () => void }` (separate `client`/
`payment` props, not a combined object — matching `collectionCard.tsx`'s
`{ client, appointment, onClick }` shape). `readPaymentHistory.tsx` owns opening
`updateCollection.tsx` in a `Modal` on click, exactly like `readCollections.tsx` does
today (store the clicked `payment` in local state, render `<UpdateCollection payment={selected} .../>`
when set).

**The two total selectors — reuse existing helpers directly, don't re-derive:**
`usePaymentStore.ts` already has a module-local `totalReceivedSince(payments, appointments, since)`
helper (used by `getTotalMadeThisWeek`/`getTotalMadeThisMonth`) that sums
`appointment.charge` for received payments on/after a given date. `getTotalCollected()`
is the same helper called with `since = new Date(0)` — an all-time total is just an
unbounded date range, not new logic. For the net figure, mirror
`getTotalNeededToPayOut()`'s shape (`payments.filter(...).reduce((sum, p) => sum + (appt?.expense ?? 0), 0)`)
but flip its filter from `!p.expensesPaid` to `p.expensesPaid` (expenses *already* paid,
not still owed), then subtract that from `getTotalCollected()`.

### Acceptance criteria
- New selectors on `usePaymentStore` (naming reads as a question the UI asks, per
  existing convention):
  - `getReceivedPayments()` → `{ client: Client; payment: Payment }[]`. **Not** the
    existing `Collection` type (`{ client, appointment }`) — that shape has no room for
    `payment.method`/`payment.date`, which the list needs to render. Internally: filter
    `payments` to `paymentReceived === true`, resolve each payment's `Appointment` (for
    `appointment.clientID`) then `Client` the same way `getPaymentsOwed` does, drop any
    entry where either lookup fails, then sort by **parsed** date, descending:
    `new Date(a.payment.date).getTime()` vs `new Date(b.payment.date).getTime()` —
    **not** `.localeCompare()` on the raw strings. `payment.date` is written via
    `new Date().toDateString()` in `updateCollection.tsx` (e.g. `"Wed Jul 16 2025"`),
    which does **not** sort correctly as a plain string; it must be parsed back into a
    `Date` first.
  - `getTotalCollected()` → `number`, all-time gross, via `totalReceivedSince` as
    described in Follow-this-example.
  - `getTotalNetAfterPayouts()` → `getTotalCollected()` minus the sum of
    `appointment.expense` across payments where `expensesPaid === true`.
- New `basic/cards/paymentHistoryCard.tsx` (name per `directoryLogic.md` §3): renders
  `client.name`, `payment.method`, and `payment.date`; calls `onClick` on click, no
  internal state, no store access — pure presentational, matching the family it joins.
- New `collectionsList/readPaymentHistory.tsx`: renders `getReceivedPayments()` as
  `paymentHistoryCard`s; empty state **"No payments received yet"** when the array is
  empty, matching the tone of `readClients.tsx`'s "No clients yet" /
  `readCollections.tsx`'s "All payments have been received."; clicking a card opens
  `updateCollection.tsx` in a `Modal`, passing the clicked row's `payment`.
- Unmarking a payment as received inside that modal must make it vanish from the
  history list and reappear in the existing outstanding "Collections" list — this must
  fall out naturally from `getReceivedPayments()`'s existing `paymentReceived` filter
  and `readCollections.tsx`'s existing `!p.paymentReceived` filter; do not add any
  extra state to make this happen.
- Two new cards on the Finance page's overview grid, currency-formatted the same way
  `financePage.tsx`/`clientCard.tsx` already do
  (`Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })`). Suggested
  labels: **"Total Collected"** and **"Net After Payouts"** — adjust at the plan-gate
  if different wording reads better next to the existing four.
  - **Open call, surface at the plan gate, don't guess:** `FinanceColorScheme` only
    defines four roles (`rose`, `deep`, `blush`, `plum`, in `basic/cards/financeCard.tsx`)
    and **all four are already used** by the existing four cards (This Week=`rose`,
    This Month=`blush`, Total Owed=`deep`, Owed to Ines=`plum`) — there is no unused
    scheme to fall back on. Either reuse an existing scheme for one or both new cards
    (visual duplication, zero new code), or extend `FinanceColorScheme` +
    `financeCard.css` with 1–2 new semantic-role names per `design.md` §3's naming
    convention (a role word, not a hex-describing name). This is a real design
    decision — state the chosen approach in the plan-gate restatement rather than
    picking silently.

### Out of scope / don't touch
- Appointment and Client CRUD — don't touch `clientsList/`, `appointmentsList/`, or
  their stores beyond reading from them.
- The existing "Collections"/"PayOut" tabs in `readCollections.tsx` — their filtering,
  behavior, and the fact that they duplicate the join inline instead of calling
  `getPaymentsOwed`/`getPaymentsToPayout` must not change. That inline duplication is a
  pre-existing inconsistency; fixing it is a separate task, not a side effect of this
  one.
- The `Payment.date` storage format (`toDateString()`, not the ISO-ish `toDateKey`
  format `Appointment.date` uses) — a real inconsistency, out of scope to fix here.
  Work around it in the sort (see Acceptance criteria), don't change how it's written.
- No new dependencies (no date/schema library) — this is derived arithmetic over data
  already in the stores, and `Date` parsing is sufficient for the sort.
- No `Result` types (`aiNotes/errorHandling.md` §1) — no new failure mode exists here;
  don't add error handling for something that can't fail.

### Verification
Per `aiNotes/testing.md` §1's priority order:
1. **Store tests** (`usePaymentStore.test.ts`) for all three new selectors, using
   `resetStores()` + `buildClient`/`buildAppointment`/`buildPayment` from `testUtils/`:
   - `getReceivedPayments()`: empty when no payments are received; returns a mix
     correctly filtered to `paymentReceived === true`; **sorted descending by actual
     date** (assert with dates spanning a month/year boundary — e.g. one payment dated
     in December, one in January — to prove the sort parses dates rather than
     string-comparing them, which would order those two wrong); excludes an entry whose
     appointment or client no longer exists.
   - `getTotalCollected()`: `0` with no received payments; sums correctly across
     several.
   - `getTotalNetAfterPayouts()`: equals gross when all received payments' expenses are
     paid; is lower than gross when some are still unpaid; matches gross minus the
     expected expense sum for a mixed case.
2. **Component test** for `readPaymentHistory.tsx` (Testing Library, per `testing.md`
   §2): empty state renders its text; a received payment renders with client name,
   method, and date visible; clicking a row opens the edit modal (assert on the modal's
   title/content appearing, not on internal state). No guard-logic test needed here —
   that's covered by the store test above, per `testing.md` §1's rule against testing
   the same behavior twice.
3. **No test** for `paymentHistoryCard.tsx` itself or the two `FinanceCard` additions —
   purely presentational, per `testing.md` §1.4.
4. Full gate before reporting done: `npx tsc -b` → `npm run lint` → `npm run test`.
