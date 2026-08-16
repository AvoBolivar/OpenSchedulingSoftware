import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Job } from '../definitions/job'
import { useAppointmentStore } from './useAppointmentStore'
import { type Result, ok, err } from '../lib/result'

type NewJob = Omit<Job, 'id'>

interface JobState {
  jobs: Job[]
  selectedJobID: string | null

  setJobs: (jobs: Job[]) => void
  setSelectedJobID: (id: string | null) => void

  createJob: (data: NewJob) => void
  getJob: (id: string) => Job | undefined
  updateJob: (id: string, patch: Partial<NewJob>) => void
  deleteJob: (id: string) => Result<void>
}

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      jobs: [],
      selectedJobID: null,

      setJobs: (jobs) => set({ jobs }),
      setSelectedJobID: (id) => set({ selectedJobID: id }),

      createJob: (data) =>
        set((state) => ({
          jobs: [...state.jobs, { ...data, id: crypto.randomUUID() }],
        })),

      getJob: (id) => get().jobs.find((j) => j.id === id),

      updateJob: (id, patch) =>
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        })),

      deleteJob: (id) => {
        const isReferenced = useAppointmentStore
          .getState()
          .appointments.some((a) => a.jobID === id)
        if (isReferenced) {
          return err({
            kind: 'conflict',
            message: 'This job is still linked to an appointment. Remove the link before deleting.',
          })
        }

        set((state) => ({
          jobs: state.jobs.filter((j) => j.id !== id),
          selectedJobID: state.selectedJobID === id ? null : state.selectedJobID,
        }))
        return ok(undefined)
      },
    }),
    { name: 'jobs' }
  )
)
