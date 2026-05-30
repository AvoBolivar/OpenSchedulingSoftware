import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Client } from '../definitions/client'

type NewClient = Omit<Client, 'id'>

interface ClientState {
  clients: Client[]
  selectedClientID: string | null

  setClients: (clients: Client[]) => void
  setSelectedClientID: (id: string | null) => void

  createClient: (data: NewClient) => void
  getClient: (id: string) => Client | undefined
  updateClient: (id: string, patch: Partial<NewClient>) => void
  deleteClient: (id: string) => void
}

export const useClientStore = create<ClientState>()(
  persist(
    (set, get) => ({
      clients: [],
      selectedClientID: null,

      setClients: (clients) => set({ clients }),
      setSelectedClientID: (id) => set({ selectedClientID: id }),

      createClient: (data) =>
        set((state) => ({
          clients: [...state.clients, { ...data, id: crypto.randomUUID() }],
        })),

      getClient: (id) => get().clients.find((c) => c.id === id),
      

      updateClient: (id, patch) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
          selectedClientID:
            state.selectedClientID === id ? null : state.selectedClientID,
        })),
    }),
    { name: 'clients' }
  )
)