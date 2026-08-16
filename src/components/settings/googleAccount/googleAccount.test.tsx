import { describe, it, expect, beforeEach, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../../testUtils/render'
import GoogleAccount from './googleAccount'
import { resetStores } from '../../../testUtils/resetStores'
import { useAccountStore } from '../../../stores/useAccountStore'
import { useNotificationStore } from '../../../stores/useNotificationStore'
import { googleDriveProvider } from '../../../lib/backupProviders/googleDriveProvider'
import { ok, err } from '../../../lib/result'

vi.mock('../../../lib/backupProviders/googleDriveProvider', () => ({
  googleDriveProvider: {
    id: 'google',
    isConnected: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    backup: vi.fn(),
    restore: vi.fn(),
  },
}))

describe('GoogleAccount', () => {
  beforeEach(() => {
    resetStores()
    vi.mocked(googleDriveProvider.connect).mockReset()
    vi.mocked(googleDriveProvider.backup).mockReset()
    vi.mocked(googleDriveProvider.restore).mockReset()
    vi.mocked(googleDriveProvider.disconnect).mockReset()
  })

  it('shows a Connect button when no account is linked', () => {
    render(<GoogleAccount />)

    expect(screen.getByRole('button', { name: /connect google drive/i })).toBeInTheDocument()
  })

  it('surfaces an error toast when Google sign-in fails, without linking an account', async () => {
    vi.mocked(googleDriveProvider.connect).mockResolvedValue(
      err({ kind: 'auth', message: 'Google sign-in was cancelled or failed.' })
    )

    render(<GoogleAccount />)
    await userEvent.click(screen.getByRole('button', { name: /connect google drive/i }))

    expect(googleDriveProvider.connect).toHaveBeenCalled()
    expect(useNotificationStore.getState().notifications[0]?.message).toBe(
      'Google sign-in was cancelled or failed.'
    )
    expect(useAccountStore.getState().account).toBeNull()
  })

  it('shows account details and backup/restore/disconnect actions once connected', () => {
    useAccountStore
      .getState()
      .setAccount({ provider: 'google', email: 'jane@example.com', name: 'Jane Doe' })

    render(<GoogleAccount />)

    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /backup to drive/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /restore from drive/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument()
  })

  it('asks for confirmation before restoring, then applies the restored data', async () => {
    useAccountStore
      .getState()
      .setAccount({ provider: 'google', email: 'jane@example.com', name: 'Jane Doe' })
    vi.mocked(googleDriveProvider.restore).mockResolvedValue(
      ok({ appointments: [], clients: [], payments: [], exportedAt: '2026-01-01' })
    )

    render(<GoogleAccount />)
    await userEvent.click(screen.getByRole('button', { name: /restore from drive/i }))

    expect(screen.getByRole('dialog', { name: /restore from google drive/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /^restore$/i }))

    expect(googleDriveProvider.restore).toHaveBeenCalled()
    expect(useNotificationStore.getState().notifications.at(-1)?.message).toBe(
      'Restored from Google Drive.'
    )
  })

  it('disconnects and clears the linked account', async () => {
    useAccountStore
      .getState()
      .setAccount({ provider: 'google', email: 'jane@example.com', name: 'Jane Doe' })

    render(<GoogleAccount />)
    await userEvent.click(screen.getByRole('button', { name: /disconnect/i }))

    expect(googleDriveProvider.disconnect).toHaveBeenCalled()
  })
})
