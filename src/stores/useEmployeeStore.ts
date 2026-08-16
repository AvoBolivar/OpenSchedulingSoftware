import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Employee } from '../definitions/employee'

type NewEmployee = Omit<Employee, 'id'>

interface EmployeeState {
  employees: Employee[]
  selectedEmployeeID: string | null

  setEmployees: (employees: Employee[]) => void
  setSelectedEmployeeID: (id: string | null) => void

  createEmployee: (data: NewEmployee) => void
  getEmployee: (id: string) => Employee | undefined
  updateEmployee: (id: string, patch: Partial<NewEmployee>) => void
  deleteEmployee: (id: string) => void
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

      // TODO(appointmentScopeGrowth Step 2.1): block delete if referenced by an appointment
      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
          selectedEmployeeID:
            state.selectedEmployeeID === id ? null : state.selectedEmployeeID,
        })),
    }),
    { name: 'employees' }
  )
)
