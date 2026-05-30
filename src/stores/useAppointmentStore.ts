import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Appointment } from '../definitions/appointments'

type NewAppointment = Omit<Appointment, 'id'>

interface AppointmentState {
  appointments: Appointment[]
  selectedAppointmentID: string | null
  selectedDay: Date

  setAppointments: (appointments: Appointment[]) => void
  setSelectedAppointmentID: (id: string | null) => void
  setSelectedDay: (selectedDay: Date) => void

  createAppointment: (data: NewAppointment) => void
  getAppointment: (id: string) => Appointment | undefined
  updateAppointment: (id: string, patch: Partial<NewAppointment>) => void
  deleteAppointment: (id: string) => void

  getFutureAppointments: () => Appointment[]
  getMonthsAppointmentDates: (year: number, month: number) => Date[]
  getDayAppointments: (date: string) => Appointment[]
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],
      selectedAppointmentID: null,
      selectedDay: new Date(),

      setAppointments: (appointments) => set({ appointments }),
      setSelectedAppointmentID: (id) => set({ selectedAppointmentID: id }),
      setSelectedDay: (day: Date) => set({selectedDay: day}),

      createAppointment: (data) =>
        set((state) => ({
          appointments: [
            ...state.appointments,
            { ...data, id: crypto.randomUUID() },
          ],
        })),

      getAppointment: (id) =>
        get().appointments.find((a) => a.id === id),

      updateAppointment: (id, patch) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, ...patch } : a
          ),
        })),

      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
          selectedAppointmentID:
            state.selectedAppointmentID === id
              ? null
              : state.selectedAppointmentID,
        })),

      getFutureAppointments: () => {
        const today = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
        return get()
          .appointments.filter((a) => a.date >= today)
          .sort((a, b) => a.date.localeCompare(b.date))
      },

      getMonthsAppointmentDates: (year, month) => {
        const seen = new Set<string>()
        const dates: Date[] = []

        for (const appt of get().appointments) {
          const [y, m, day] = appt.date.split('-').map(Number)
          if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(day)) {
            console.warn('Bad appointment date format:', appt.date)
            continue
          }
          if (y !== year || m - 1 !== month) continue
          if (seen.has(appt.date)) continue
          seen.add(appt.date)
          dates.push(new Date(y, m - 1, day))
        }

        return dates
      },

      getDayAppointments: (date: string) => {
        return get()
          .appointments.filter((a) => a.date === date)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
      }

    }),
    { 
      name: 'appointments',
      partialize: (state) => ({ appointments: state.appointments }),
     }
  )
)