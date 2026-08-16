export interface Appointment {
  id: string
  clientID: string
  date: string
  charge: number
  startTime: string
  endTime: string
  expense: number
  show: boolean
  name: string
  categoryIDs: string[]
  employeeIDs: string[]
  jobID: string | null
}