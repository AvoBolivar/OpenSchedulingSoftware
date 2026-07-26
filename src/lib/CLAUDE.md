# src/lib

Framework-agnostic utility functions: date formatting and backup import/export for app data.

## Files

- **date.ts** — `toDateKey(d)`: formats a `Date` as a zero-padded `YYYY-MM-DD` string, used as a lookup/grouping key for appointments by day. `fromDateKey(key)`: parses that string back into a local-midnight `Date` (use this instead of `new Date(key)`, which parses as UTC midnight and can render a day behind in timezones behind UTC). `generateRecurringDates(start, frequency, endDate)`: expands a weekly/monthly recurrence into one `Date` per occurrence from `start` through `endDate` inclusive (capped at 520 occurrences); used by `CreateAppointment` to generate one standalone `Appointment` per occurrence up front — there's no linking id between them, so each occurrence is edited/completed/deleted independently.
- **exportData.ts** — `exportData()`: reads appointments, clients, and payments straight from `localStorage`, bundles them into a `BackupData` object, and triggers a browser download of a timestamped `backup-<date>.json` file.
- **importData.ts** — `importData(file)`: reads an uploaded JSON backup file, validates it has `appointments`/`clients`/`payments` arrays, and loads it into the Zustand stores (`useClientStore`, `useAppointmentStore`, `usePaymentStore`), which persist to `localStorage` automatically.
- **formatters.ts** — Empty; no exports yet.
