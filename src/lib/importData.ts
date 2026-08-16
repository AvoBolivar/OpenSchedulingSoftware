import type { BackupData } from "../definitions/backupData"
import { useClientStore } from "../stores/useClientStore"
import { useAppointmentStore } from "../stores/useAppointmentStore"
import { usePaymentStore } from "../stores/usePaymentStore"
import { type Result, ok, err } from "./result"

// Shared by local-file import and Google Drive restore — both hand this raw JSON text.
export function parseBackupData(raw: string): Result<BackupData> {
  let data: BackupData
  try {
    data = JSON.parse(raw) as BackupData
  } catch (e) {
    return err({ kind: "parse", message: "That backup isn't valid JSON.", cause: e })
  }

  if (
    !Array.isArray(data.appointments) ||
    !Array.isArray(data.clients) ||
    !Array.isArray(data.payments)
  ) {
    return err({
      kind: "validation",
      message: "That backup is missing appointments, clients, or payments.",
    })
  }

  return ok(data)
}

// Use store actions — persist middleware handles localStorage
export function applyBackupData(data: BackupData): void {
  useClientStore.getState().setClients(data.clients)
  useAppointmentStore.getState().setAppointments(data.appointments)
  usePaymentStore.getState().setPayments(data.payments)
}

export async function importData(file: File): Promise<Result<BackupData>> {
  let text: string
  try {
    text = await file.text()
  } catch (e) {
    return err({ kind: "storage", message: "Couldn't read the selected file.", cause: e })
  }

  const result = parseBackupData(text)
  if (!result.ok) return result

  applyBackupData(result.value)
  return result
}
