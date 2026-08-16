import { describe, it, expect, beforeEach } from 'vitest'
import { useEmployeeStore } from './useEmployeeStore'
import { useAppointmentStore } from './useAppointmentStore'
import { resetStores } from '../testUtils/resetStores'
import { buildEmployee, buildAppointment } from '../testUtils/builders'
import { ok, err } from '../lib/result'

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

    const result = useEmployeeStore.getState().deleteEmployee(employee.id)

    expect(result).toEqual(ok(undefined))
    expect(useEmployeeStore.getState().employees).toHaveLength(0)
    expect(useEmployeeStore.getState().selectedEmployeeID).toBeNull()
  })

  it('returns conflict when deleting an employee referenced by an appointment', () => {
    const employee = buildEmployee()
    useEmployeeStore.setState({ employees: [employee] })
    useAppointmentStore.getState().createAppointment(buildAppointment({ employeeIDs: [employee.id] }))

    const result = useEmployeeStore.getState().deleteEmployee(employee.id)

    expect(result).toEqual(err({ kind: 'conflict', message: expect.any(String) }))
    expect(useEmployeeStore.getState().employees).toHaveLength(1) // nothing was deleted
  })

  it('does not leak state between tests', () => {
    expect(useEmployeeStore.getState().employees).toHaveLength(0)
  })
})
