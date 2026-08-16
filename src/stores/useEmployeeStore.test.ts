import { describe, it, expect, beforeEach } from 'vitest'
import { useEmployeeStore } from './useEmployeeStore'
import { resetStores } from '../testUtils/resetStores'
import { buildEmployee } from '../testUtils/builders'

describe('useEmployeeStore', () => {
  beforeEach(() => resetStores())

  it('adds an employee with a generated id on createEmployee', () => {
    useEmployeeStore.getState().createEmployee(buildEmployee({ name: 'Jane Doe' }))

    const employees = useEmployeeStore.getState().employees
    expect(employees).toHaveLength(1)
    expect(employees[0].name).toBe('Jane Doe')
    expect(employees[0].id).toEqual(expect.any(String))
  })

  it('applies a partial patch on updateEmployee', () => {
    const employee = buildEmployee({ name: 'Jane Doe', active: true })
    useEmployeeStore.setState({ employees: [employee] })

    useEmployeeStore.getState().updateEmployee(employee.id, { active: false })

    const updated = useEmployeeStore.getState().getEmployee(employee.id)
    expect(updated?.active).toBe(false)
    expect(updated?.name).toBe('Jane Doe')
  })

  it('removes an employee on deleteEmployee and clears a matching selectedEmployeeID', () => {
    const employee = buildEmployee()
    useEmployeeStore.setState({ employees: [employee], selectedEmployeeID: employee.id })

    useEmployeeStore.getState().deleteEmployee(employee.id)

    expect(useEmployeeStore.getState().employees).toHaveLength(0)
    expect(useEmployeeStore.getState().selectedEmployeeID).toBeNull()
  })

  it('does not leak state between tests', () => {
    expect(useEmployeeStore.getState().employees).toHaveLength(0)
  })
})
