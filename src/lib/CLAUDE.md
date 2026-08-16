# src/lib

Framework-agnostic utility functions: date formatting, backup import/export for app
data, and the `Result`/error-handling primitives ([errorHandling.md](../../aiNotes/errorHandling.md)).

## Files

- **date.ts** — `toDateKey(d)`: formats a `Date` as a zero-padded `YYYY-MM-DD` string, used as a lookup/grouping key for appointments by day. `fromDateKey(key)`: parses that string back into a local-midnight `Date` (use this instead of `new Date(key)`, which parses as UTC midnight and can render a day behind in timezones behind UTC). `generateRecurringDates(start, frequency, endDate)`: expands a weekly/monthly recurrence into one `Date` per occurrence from `start` through `endDate` inclusive (capped at 520 occurrences); used by `CreateAppointment` to generate one standalone `Appointment` per occurrence up front — there's no linking id between them, so each occurrence is edited/completed/deleted independently.
- **result.ts** — `Result<T, E = AppError>`, `ok`/`err` constructors, and the shared `AppError`/`AppErrorKind` shape. The one error primitive in the codebase; see errorHandling.md §0.
- **notify.ts** — `notify(error: AppError)`: the single entry point for surfacing an error as a toast (pushes to `stores/useNotificationStore.ts`, rendered by `components/basic/toast/toast.tsx`).
- **exportData.ts** — `buildBackupData()`: reads appointments, clients, and payments straight from `localStorage` into a `BackupData` object (shared by both export paths below). `exportData()`: calls it and triggers a browser download of a timestamped `backup-<date>.json` file.
- **importData.ts** — `parseBackupData(raw)`: parses+validates raw JSON text into a `Result<BackupData>` (shared by local-file import and `backupProviders/googleDriveProvider.ts`'s Drive restore). `applyBackupData(data)`: writes a validated `BackupData` into the three Zustand stores. `importData(file)`: reads an uploaded file, composes the two above, returns `Result<BackupData>`.
- **backupProviders/** — pluggable cloud-backup destinations behind the `BackupProvider` interface (`types.ts`). `googleDriveProvider.ts` is the only implementation: Google Identity Services (loaded via `<script>` in `index.html`) for sign-in, Drive API v3's `appDataFolder` (hidden, app-private) for the backup file itself. `googleIdentity.d.ts` types the `window.google` global GIS attaches. See `stores/useAccountStore.ts` for the persisted account identity (never the OAuth token, which stays in-memory only).
- **formatters.ts** — Empty; no exports yet.
