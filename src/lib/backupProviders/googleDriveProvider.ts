import type { BackupData } from "../../definitions/backupData"
import { type Result, ok, err } from "../result"
import { parseBackupData } from "../importData"
import { useAccountStore } from "../../stores/useAccountStore"
import type { AccountInfo, BackupProvider } from "./types"

const SCOPES = [
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ")

const BACKUP_FILE_NAME = "backup.json"
const DRIVE_FILES_URL = "https://www.googleapis.com/drive/v3/files"
const DRIVE_UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files"
const USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

// Kept in memory only — never persisted. Lets disconnect() revoke the token
// the user most recently granted, and lets a returning session skip the full
// consent screen (GIS still requires a user gesture per request either way).
let cachedToken: string | null = null

function getAccessToken(): Promise<Result<string>> {
  return new Promise((resolve) => {
    if (!window.google?.accounts?.oauth2) {
      resolve(
        err({
          kind: "unknown",
          message: "Google sign-in failed to load. Check your connection and try again.",
        })
      )
      return
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      resolve(
        err({
          kind: "unknown",
          message: "Google Drive backup isn't configured for this app yet.",
        })
      )
      return
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (response) => {
        if (response.error || !response.access_token) {
          resolve(err({ kind: "auth", message: "Google sign-in was cancelled or failed." }))
          return
        }
        cachedToken = response.access_token
        resolve(ok(response.access_token))
      },
      error_callback: () => {
        resolve(err({ kind: "auth", message: "Google sign-in was cancelled or failed." }))
      },
    })

    tokenClient.requestAccessToken({ prompt: cachedToken ? "" : "consent" })
  })
}

async function fetchAccountInfo(accessToken: string): Promise<Result<AccountInfo>> {
  try {
    const response = await fetch(USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
      return err({ kind: "auth", message: "Couldn't read your Google account details." })
    }
    const data = (await response.json()) as { email: string; name: string; picture?: string }
    return ok({ email: data.email, name: data.name, pictureUrl: data.picture })
  } catch (e) {
    return err({ kind: "auth", message: "Couldn't read your Google account details.", cause: e })
  }
}

async function findBackupFileId(accessToken: string): Promise<Result<string | null>> {
  try {
    const url = `${DRIVE_FILES_URL}?spaces=appDataFolder&q=${encodeURIComponent(
      `name='${BACKUP_FILE_NAME}'`
    )}&fields=${encodeURIComponent("files(id)")}`
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
      return err({ kind: "storage", message: "Couldn't reach Google Drive." })
    }
    const data = (await response.json()) as { files: { id: string }[] }
    return ok(data.files[0]?.id ?? null)
  } catch (e) {
    return err({ kind: "storage", message: "Couldn't reach Google Drive.", cause: e })
  }
}

async function downloadBackup(accessToken: string, fileId: string): Promise<Result<string>> {
  try {
    const response = await fetch(`${DRIVE_FILES_URL}/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
      return err({ kind: "storage", message: "Couldn't download your backup from Google Drive." })
    }
    return ok(await response.text())
  } catch (e) {
    return err({
      kind: "storage",
      message: "Couldn't download your backup from Google Drive.",
      cause: e,
    })
  }
}

async function uploadBackup(
  accessToken: string,
  json: string,
  existingFileId: string | null
): Promise<Result<void>> {
  try {
    let response: Response

    if (existingFileId) {
      // Content-only update — keeps the file's existing name/parents metadata.
      response = await fetch(`${DRIVE_UPLOAD_URL}/${existingFileId}?uploadType=media`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: json,
      })
    } else {
      const boundary = "backup-boundary"
      const metadata = { name: BACKUP_FILE_NAME, parents: ["appDataFolder"] }
      const body =
        `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${JSON.stringify(metadata)}\r\n` +
        `--${boundary}\r\n` +
        `Content-Type: application/json\r\n\r\n` +
        `${json}\r\n` +
        `--${boundary}--`

      response = await fetch(`${DRIVE_UPLOAD_URL}?uploadType=multipart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      })
    }

    if (!response.ok) {
      return err({ kind: "storage", message: "Couldn't save your backup to Google Drive." })
    }
    return ok(undefined)
  } catch (e) {
    return err({ kind: "storage", message: "Couldn't save your backup to Google Drive.", cause: e })
  }
}

export const googleDriveProvider: BackupProvider = {
  id: "google",

  isConnected() {
    return useAccountStore.getState().account?.provider === "google"
  },

  async connect() {
    const tokenResult = await getAccessToken()
    if (!tokenResult.ok) return tokenResult

    const infoResult = await fetchAccountInfo(tokenResult.value)
    if (!infoResult.ok) return infoResult

    useAccountStore.getState().setAccount({ provider: "google", ...infoResult.value })
    return infoResult
  },

  disconnect() {
    if (cachedToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(cachedToken)
    }
    cachedToken = null
    useAccountStore.getState().clearAccount()
  },

  async backup(data: BackupData) {
    const tokenResult = await getAccessToken()
    if (!tokenResult.ok) return tokenResult

    const fileResult = await findBackupFileId(tokenResult.value)
    if (!fileResult.ok) return fileResult

    return uploadBackup(tokenResult.value, JSON.stringify(data, null, 2), fileResult.value)
  },

  async restore() {
    const tokenResult = await getAccessToken()
    if (!tokenResult.ok) return tokenResult

    const fileResult = await findBackupFileId(tokenResult.value)
    if (!fileResult.ok) return fileResult
    if (fileResult.value === null) {
      return err({ kind: "not_found", message: "No backup was found in Google Drive yet." })
    }

    const downloadResult = await downloadBackup(tokenResult.value, fileResult.value)
    if (!downloadResult.ok) return downloadResult

    return parseBackupData(downloadResult.value)
  },
}
