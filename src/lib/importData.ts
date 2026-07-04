import type { BackupData } from "../definitions/backupData"
import { useClientStore } from "../stores/useClientStore"
import { useAppointmentStore } from "../stores/useAppointmentStore"
import { usePaymentStore } from "../stores/usePaymentStore"


export async function importData(file: File): Promise<BackupData> {
  const text = await file.text()
  const data = JSON.parse(text) as BackupData

  if (
    !Array.isArray(data.appointments) ||
    !Array.isArray(data.clients) ||
    !Array.isArray(data.payments)
  ) {
    throw new Error('Invalid backup file: missing appointments, clients, or payments arrays')
  }

  // Use store actions — persist middleware handles localStorage
  useClientStore.getState().setClients(data.clients)
  useAppointmentStore.getState().setAppointments(data.appointments)
  usePaymentStore.getState().setPayments(data.payments)

  return data
}