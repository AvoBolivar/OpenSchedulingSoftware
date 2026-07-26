export interface Client {
  id: string
  name: string,
  address: string,
  phoneNumber: string,
  price: number,
  employeePayment: number,
  defaultStartTime: string,
  defaultEndTime: string,
  notes: string[],
  active: boolean
}