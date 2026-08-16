import { describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../testUtils/render'
import CreateEmployee from './createEmployee'
import { resetStores } from '../../testUtils/resetStores'
import { useEmployeeStore } from '../../stores/useEmployeeStore'

describe('CreateEmployee', () => {
  beforeEach(() => resetStores())

  it('shows an inline error when name is empty on submit', async () => {
    render(<CreateEmployee />)
    await userEvent.click(screen.getByRole('button', { name: /add employee/i }))

    await userEvent.click(screen.getByRole('button', { name: /done/i }))

    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(useEmployeeStore.getState().employees).toHaveLength(0)
  })

  it('creates the employee and closes the modal on a valid submit', async () => {
    render(<CreateEmployee />)
    await userEvent.click(screen.getByRole('button', { name: /add employee/i }))

    await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Jane Doe')
    await userEvent.click(screen.getByRole('button', { name: /done/i }))

    const employees = useEmployeeStore.getState().employees
    expect(employees).toHaveLength(1)
    expect(employees[0].name).toBe('Jane Doe')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
