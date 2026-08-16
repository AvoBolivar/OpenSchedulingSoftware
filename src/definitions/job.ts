export interface Job {
  id: string
  clientID: string
  name: string
  description: string
  status: 'active' | 'completed'
  createdDate: string
}
