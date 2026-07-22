# src/pages

Top-level route/page components, one per tab in the app's nav bar, plus the shared page shell that hosts them.

## Files

- **home.tsx**
  - Functional Purpose: Root page component. Owns the current `PageId` state, renders the sticky `NavBar`, and conditionally mounts `AppointmentsPage`, `FinancePage`, or `ClientsPage` based on the selected tab.
  - Contextual Purpose: Just a container that loads the different pages.
- **appointmentsPage.tsx** 
  - Functional Purpose: Contains Calendar with event dates, appointment creation form, lists of the selected day's and all appointments, plus data-management actions (delete all data, import backup).
  - Contextual Purpose: This is the default landing page the user will see. Contains appointment information as well asany other information the use should see when the open the app for the first time.
- **clientsPage.tsx** 
  - Functional Purpose: Renders the `ClientsList` and a `CreateClient` form.
  - Contextual Purpose: This page will show any client related information the user needs to see.
- **financePage.tsx** 
  - Functional Purpose: Summary cards (this week/month totals, total owed, payout owed) sourced from `usePaymentStore`, plus a `CollectionsList` of people who owe money.
  - Contextual Purpose: Contains any financial information the user needs to see. 
- **pages.css** 
  - Functional Purpose: Shared layout/styling for all three page views (`.page`, `.page__header`, `.section`, `.panel`, `.finance-grid`, `.button-section`, responsive breakpoints).
  - Contextual Purpose: This contains the styling for each page.
