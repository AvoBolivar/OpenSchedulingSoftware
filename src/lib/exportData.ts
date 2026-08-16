import type { BackupData } from "../definitions/backupData"
import { useAppointmentStore } from "../stores/useAppointmentStore"
import { useClientStore } from "../stores/useClientStore"
import { usePaymentStore } from "../stores/usePaymentStore"

// Shared by local-file export and Google Drive backup — both need the same snapshot.
export function buildBackupData(): BackupData {
  return {
    appointments: useAppointmentStore.getState().appointments,
    clients: useClientStore.getState().clients,
    payments: usePaymentStore.getState().payments,
    exportedAt: new Date().toISOString(),
  }
}

export function exportData(): void {
  const data = buildBackupData()

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()

  URL.revokeObjectURL(url)
}