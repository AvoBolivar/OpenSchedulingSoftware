import { describe, it, expect, beforeEach } from 'vitest'
import { parseBackupData, applyBackupData, importData } from './importData'
import { useClientStore } from '../stores/useClientStore'
import { useAppointmentStore } from '../stores/useAppointmentStore'
import { usePaymentStore } from '../stores/usePaymentStore'
import { resetStores } from '../testUtils/resetStores'
import { buildClient, buildAppointment, buildPayment } from '../testUtils/builders'

function backupFile(data: unknown): File {
  return new File([JSON.stringify(data)], 'backup.json', { type: 'application/json' })
}

describe('parseBackupData', () => {
  it('returns ok with the parsed data for a well-formed backup', () => {
    const client = buildClient()
    const result = parseBackupData(
      JSON.stringify({ appointments: [], clients: [client], payments: [], exportedAt: '2026-01-01' })
    )

    expect(result).toEqual({
      ok: true,
      value: { appointments: [], clients: [client], payments: [], exportedAt: '2026-01-01' },
    })
  })

  it('returns a parse error for invalid JSON', () => {
    const result = parseBackupData('not json')

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.kind).toBe('parse')
  })

  it('returns a validation error when appointments/clients/payments are missing', () => {
    const result = parseBackupData(JSON.stringify({ exportedAt: '2026-01-01' }))

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.kind).toBe('validation')
  })
})

describe('applyBackupData', () => {
  beforeEach(() => resetStores())

  it('replaces store state with the backup contents', () => {
    const client = buildClient()
    const appointment = buildAppointment()
    const payment = buildPayment()

    applyBackupData({
      clients: [client],
      appointments: [appointment],
      payments: [payment],
      exportedAt: '2026-01-01',
    })

    expect(useClientStore.getState().clients).toEqual([client])
    expect(useAppointmentStore.getState().appointments).toEqual([appointment])
    expect(usePaymentStore.getState().payments).toEqual([payment])
  })
})

describe('importData', () => {
  beforeEach(() => resetStores())

  it('applies a well-formed backup file and returns ok', async () => {
    const client = buildClient()
    const file = backupFile({ appointments: [], clients: [client], payments: [], exportedAt: '2026-01-01' })

    const result = await importData(file)

    expect(result.ok).toBe(true)
    expect(useClientStore.getState().clients).toEqual([client])
  })

  it('returns a parse error and leaves stores untouched for invalid JSON', async () => {
    const file = new File(['not json'], 'backup.json', { type: 'application/json' })

    const result = await importData(file)

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.kind).toBe('parse')
    expect(useClientStore.getState().clients).toHaveLength(0)
  })
})
