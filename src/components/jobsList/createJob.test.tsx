import { describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../testUtils/render'
import CreateJob from './createJob'
import { resetStores } from '../../testUtils/resetStores'
import { buildClient } from '../../testUtils/builders'
import { useClientStore } from '../../stores/useClientStore'
import { useJobStore } from '../../stores/useJobStore'

describe('CreateJob', () => {
  beforeEach(() => resetStores())

  it('keeps Done disabled until a name and client are chosen', async () => {
    const client = buildClient({ name: 'Jane Doe' })
    useClientStore.setState({ clients: [client] })

    render(<CreateJob />)
    await userEvent.click(screen.getByRole('button', { name: /add job/i }))

    expect(screen.getByRole('button', { name: /done/i })).toBeDisabled()

    await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Kitchen Remodel')

    expect(screen.getByRole('button', { name: /done/i })).toBeDisabled()
    expect(useJobStore.getState().jobs).toHaveLength(0)
  })

  it('creates a job for the entered name and selected client on submit', async () => {
    const client = buildClient({ name: 'Jane Doe' })
    useClientStore.setState({ clients: [client] })

    render(<CreateJob />)
    await userEvent.click(screen.getByRole('button', { name: /add job/i }))
    await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Kitchen Remodel')

    await userEvent.click(screen.getByRole('combobox', { name: /client/i }))
    await userEvent.click(await screen.findByRole('option', { name: 'Jane Doe' }))

    await userEvent.click(screen.getByRole('button', { name: /done/i }))

    const jobs = useJobStore.getState().jobs
    expect(jobs).toHaveLength(1)
    expect(jobs[0].name).toBe('Kitchen Remodel')
    expect(jobs[0].clientID).toBe(client.id)
    expect(jobs[0].status).toBe('active')
  })
})
