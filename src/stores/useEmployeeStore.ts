import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Employee } from '../definitions/employee'
import { useAppointmentStore } from './useAppointmentStore'
import { type Result, ok, err } from '../lib/result'

type NewEmployee = Omit<Employee, 'id'>

interface EmployeeState {
  employees: Employee[]
  selectedEmployeeID: string | null

  setEmployees: (employees: Employee[]) => void
  setSelectedEmployeeID: (id: string | null) => void

  createEmployee: (data: NewEmployee) => void
  getEmployee: (id: string) => Employee | undefined
  updateEmployee: (id: string, patch: Partial<NewEmployee>) => void
  deleteEmployee: (id: string) => Result<void>
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      employees: [],
      selectedEmployeeID: null,

      setEmployees: (employees) => set({ employees }),
      setSelectedEmployeeID: (id) => set({ selectedEmployeeID: id }),

      createEmployee: (data) =>
        set((state) => ({
          employees: [...state.employees, { ...data, id: crypto.randomUUID() }],
        })),

      getEmployee: (id) => get().employees.find((e) => e.id === id),

      updateEmployee: (id, patch) =>
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, ...patch } : e
          ),
        })),

      deleteEmployee: (id) => {
        const isReferenced = useAppointmentStore
          .getState()
          .appointments.some((a) => a.employeeIDs.includes(id))
        if (isReferenced) {
          return err({
            kind: 'conflict',
            message: 'This employee is still assigned to an appointment. Remove them from all appointments before deleting.',
          })
        }

        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
          selectedEmployeeID:
            state.selectedEmployeeID === id ? null : state.selectedEmployeeID,
        }))
        return ok(undefined)
      },
    }),
    { name: 'employees' }
  )
)
