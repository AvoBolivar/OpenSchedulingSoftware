import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { googleDriveProvider } from './googleDriveProvider'
import { useAccountStore } from '../../stores/useAccountStore'
import { resetStores } from '../../testUtils/resetStores'
import type { BackupData } from '../../definitions/backupData'

const BACKUP: BackupData = { appointments: [], clients: [], payments: [], exportedAt: '2026-01-01' }

function mockGoogleIdentity(
  tokenResponse: { access_token?: string; error?: string } = { access_token: 'test-token' }
) {
  const revoke = vi.fn()
  const initTokenClient = vi.fn((config: { callback: (r: typeof tokenResponse) => void }) => ({
    requestAccessToken: () => config.callback(tokenResponse),
  }))
  window.google = { accounts: { oauth2: { initTokenClient, revoke } } }
  return { initTokenClient, revoke }
}

describe('googleDriveProvider', () => {
  beforeEach(() => {
    resetStores()
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'test-client-id')
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    delete window.google
  })

  describe('connect', () => {
    it('returns ok with the account and stores it when Google grants a token', async () => {
      mockGoogleIdentity()
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ email: 'jane@example.com', name: 'Jane Doe', picture: 'pic.png' }))
      )

      const result = await googleDriveProvider.connect()

      expect(result).toEqual({
        ok: true,
        value: { email: 'jane@example.com', name: 'Jane Doe', pictureUrl: 'pic.png' },
      })
      expect(useAccountStore.getState().account).toEqual({
        provider: 'google',
        email: 'jane@example.com',
        name: 'Jane Doe',
        pictureUrl: 'pic.png',
      })
    })

    it('returns an auth error when the user denies or cancels consent', async () => {
      mockGoogleIdentity({ error: 'access_denied' })

      const result = await googleDriveProvider.connect()

      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error.kind).toBe('auth')
      expect(useAccountStore.getState().account).toBeNull()
    })

    it('returns an unknown error when no client id is configured', async () => {
      // Explicit empty string, not vi.unstubAllEnvs() — unstubbing reverts to whatever
      // VITE_GOOGLE_CLIENT_ID a real .env on this machine actually has configured.
      vi.stubEnv('VITE_GOOGLE_CLIENT_ID', '')
      mockGoogleIdentity()

      const result = await googleDriveProvider.connect()

      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error.kind).toBe('unknown')
    })
  })

  describe('backup', () => {
    it('creates a new backup file when none exists yet and returns ok', async () => {
      mockGoogleIdentity()
      vi.mocked(fetch)
        .mockResolvedValueOnce(new Response(JSON.stringify({ files: [] }))) // findBackupFileId
        .mockResolvedValueOnce(new Response(null, { status: 200 })) // upload

      const result = await googleDriveProvider.backup(BACKUP)

      expect(result).toEqual({ ok: true, value: undefined })
    })

    it('returns a storage error when the Drive upload fails', async () => {
      mockGoogleIdentity()
      vi.mocked(fetch)
        .mockResolvedValueOnce(new Response(JSON.stringify({ files: [] })))
        .mockResolvedValueOnce(new Response(null, { status: 500 }))

      const result = await googleDriveProvider.backup(BACKUP)

      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error.kind).toBe('storage')
    })
  })

  describe('restore', () => {
    it('returns a not_found error when no backup exists in Drive', async () => {
      mockGoogleIdentity()
      vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ files: [] })))

      const result = await googleDriveProvider.restore()

      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error.kind).toBe('not_found')
    })

    it('returns ok with the parsed backup when a file exists in Drive', async () => {
      mockGoogleIdentity()
      vi.mocked(fetch)
        .mockResolvedValueOnce(new Response(JSON.stringify({ files: [{ id: 'file-1' }] })))
        .mockResolvedValueOnce(new Response(JSON.stringify(BACKUP)))

      const result = await googleDriveProvider.restore()

      expect(result).toEqual({ ok: true, value: BACKUP })
    })
  })

  describe('isConnected / disconnect', () => {
    it('reflects the account store and clears it on disconnect', async () => {
      mockGoogleIdentity()
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ email: 'jane@example.com', name: 'Jane Doe' }))
      )
      await googleDriveProvider.connect()
      expect(googleDriveProvider.isConnected()).toBe(true)

      googleDriveProvider.disconnect()

      expect(googleDriveProvider.isConnected()).toBe(false)
      expect(useAccountStore.getState().account).toBeNull()
    })
  })
})
