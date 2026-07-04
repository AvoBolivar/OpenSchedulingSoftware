export interface Client {
  id: string
  name: string,
  address: string,
  phoneNumber: string,
  price: number,
  employeePayment: number,
  notes: string[],
  active: boolean
}