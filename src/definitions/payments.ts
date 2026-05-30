export interface Payment {
  id: string
  date: string // date payment was recieved
  method: string
  paymentReceived: boolean
  expensesPaid: boolean
  appointmentID: string
}