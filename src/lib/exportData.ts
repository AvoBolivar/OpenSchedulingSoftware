import type { BackupData } from "../definitions/backupData"

const KEYS = {
  appointments: 'appointments',
  clients: 'clients',
  payments: 'payments',
} as const

export function exportData(): void {
  const data: BackupData = {
    appointments: JSON.parse(localStorage.getItem(KEYS.appointments) ?? '[]'),
    clients: JSON.parse(localStorage.getItem(KEYS.clients) ?? '[]'),
    payments: JSON.parse(localStorage.getItem(KEYS.payments) ?? '[]'),
    exportedAt: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()

  URL.revokeObjectURL(url)
}