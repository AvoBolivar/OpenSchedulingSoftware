# src/definitions

TypeScript type definitions (interfaces) for the app's core domain models. No logic, just shared shapes used across components, pages, hooks, and stores.

## Files

- **client.ts** — `Client` interface: a cleaning client's profile (id, name, address, phone, price, employee payment, notes, active status).
- **appointments.ts** — `Appointment` interface: a scheduled cleaning job (id, clientID, date, start/end time, charge, expense, show flag).
- **payments.ts** — `Payment` interface: payment record tied to an appointment (id, date received, method, paymentReceived/expensesPaid flags, appointmentID).
- **backupData.ts** — `BackupData` interface: the shape of a full data export/backup, aggregating `Appointment[]`, `Client[]`, and `Payment[]` with an `exportedAt` timestamp.
