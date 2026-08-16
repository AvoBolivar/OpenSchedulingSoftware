import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Job } from '../definitions/job'

type NewJob = Omit<Job, 'id'>

interface JobState {
  jobs: Job[]
  selectedJobID: string | null

  setJobs: (jobs: Job[]) => void
  setSelectedJobID: (id: string | null) => void

  createJob: (data: NewJob) => void
  getJob: (id: string) => Job | undefined
  updateJob: (id: string, patch: Partial<NewJob>) => void
  deleteJob: (id: string) => void
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

      // TODO(appointmentScopeGrowth Step 2.1): block delete if any appointment.jobID references this job
      deleteJob: (id) =>
        set((state) => ({
          jobs: state.jobs.filter((j) => j.id !== id),
          selectedJobID: state.selectedJobID === id ? null : state.selectedJobID,
        })),
    }),
    { name: 'jobs' }
  )
)
