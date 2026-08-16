import { create } from "zustand"
import { persist } from "zustand/middleware"

export type BackupProviderId = "google"

export interface Account {
  provider: BackupProviderId
  email: string
  name: string
  pictureUrl?: string
}

interface AccountState {
  account: Account | null

  setAccount: (account: Account) => void
  clearAccount: () => void
}

// Only the connected identity is persisted here — never an OAuth token.
// Tokens are requested fresh per backup/restore action (see lib/backupProviders).
export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      account: null,

      setAccount: (account) => set({ account }),
      clearAccount: () => set({ account: null }),
    }),
    { name: "account" }
  )
)
