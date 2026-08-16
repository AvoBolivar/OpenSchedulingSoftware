import type { BackupData } from "../../definitions/backupData"
import type { Result } from "../result"

export interface AccountInfo {
  email: string
  name: string
  pictureUrl?: string
}

// A cloud destination an account can be connected to for backup/restore.
// Google Drive is the only implementation today; this interface exists so a
// second provider (Dropbox, OneDrive, ...) can be added without reshaping the
// store/UI layer that consumes it. iCloud has no equivalent file-storage API
// for web apps (CloudKit JS is a different, record-based integration) so it's
// not a fit for this interface as-is.
export interface BackupProvider {
  id: string
  isConnected(): boolean
  connect(): Promise<Result<AccountInfo>>
  disconnect(): void
  backup(data: BackupData): Promise<Result<void>>
  restore(): Promise<Result<BackupData>>
}
