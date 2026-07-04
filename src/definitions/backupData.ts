import type { Appointment } from "./appointments"
import type { Client } from "./client"
import type { Payment } from "./payments"

export interface BackupData {
  appointments: Appointment[]
  clients: Client[]
  payments: Payment[]
  exportedAt: string
}