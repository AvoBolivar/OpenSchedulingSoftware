import { describe, it, expect, beforeEach } from 'vitest'
import { useClientStore } from './useClientStore'
import { resetStores } from '../testUtils/resetStores'
import { buildClient } from '../testUtils/builders'

describe('useClientStore', () => {
  beforeEach(() => resetStores())

  it('adds a client with a generated id on createClient', () => {
    useClientStore.getState().createClient(buildClient({ name: 'Jane Doe' }))

    const clients = useClientStore.getState().clients
    expect(clients).toHaveLength(1)
    expect(clients[0].name).toBe('Jane Doe')
    expect(clients[0].id).toEqual(expect.any(String))
  })

  it('removes a client on deleteClient and clears a matching selectedClientID', () => {
    const client = buildClient()
    useClientStore.setState({ clients: [client], selectedClientID: client.id })

    useClientStore.getState().deleteClient(client.id)

    expect(useClientStore.getState().clients).toHaveLength(0)
    expect(useClientStore.getState().selectedClientID).toBeNull()
  })

  it('does not leak state between tests', () => {
    expect(useClientStore.getState().clients).toHaveLength(0)
  })
})
