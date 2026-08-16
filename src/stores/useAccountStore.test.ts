import { describe, it, expect, beforeEach } from 'vitest'
import { useAccountStore } from './useAccountStore'
import { resetStores } from '../testUtils/resetStores'

describe('useAccountStore', () => {
  beforeEach(() => resetStores())

  it('has no account by default', () => {
    expect(useAccountStore.getState().account).toBeNull()
  })

  it('stores the connected account on setAccount', () => {
    useAccountStore.getState().setAccount({
      provider: 'google',
      email: 'jane@example.com',
      name: 'Jane Doe',
    })

    expect(useAccountStore.getState().account).toEqual({
      provider: 'google',
      email: 'jane@example.com',
      name: 'Jane Doe',
    })
  })

  it('clears the account on clearAccount', () => {
    useAccountStore.getState().setAccount({
      provider: 'google',
      email: 'jane@example.com',
      name: 'Jane Doe',
    })

    useAccountStore.getState().clearAccount()

    expect(useAccountStore.getState().account).toBeNull()
  })

  it('does not leak state between tests', () => {
    expect(useAccountStore.getState().account).toBeNull()
  })
})
