import { describe, it, expect, beforeEach } from 'vitest'
import { useJobStore } from './useJobStore'
import { useAppointmentStore } from './useAppointmentStore'
import { resetStores } from '../testUtils/resetStores'
import { buildJob, buildAppointment } from '../testUtils/builders'
import { ok, err } from '../lib/result'

describe('useJobStore', () => {
  beforeEach(() => resetStores())

  it('adds a job with a generated id on createJob', () => {
    useJobStore.getState().createJob(buildJob({ name: 'Kitchen Remodel' }))

    const jobs = useJobStore.getState().jobs
    expect(jobs).toHaveLength(1)
    expect(jobs[0].name).toBe('Kitchen Remodel')
    expect(jobs[0].id).toEqual(expect.any(String))
  })

  it('applies a shallow patch on updateJob', () => {
    const job = buildJob({ status: 'active' })
    useJobStore.setState({ jobs: [job] })

    useJobStore.getState().updateJob(job.id, { status: 'completed' })

    expect(useJobStore.getState().jobs[0].status).toBe('completed')
    expect(useJobStore.getState().jobs[0].name).toBe(job.name)
  })

  it('removes a job on deleteJob and clears a matching selectedJobID', () => {
    const job = buildJob()
    useJobStore.setState({ jobs: [job], selectedJobID: job.id })

    const result = useJobStore.getState().deleteJob(job.id)

    expect(result).toEqual(ok(undefined))
    expect(useJobStore.getState().jobs).toHaveLength(0)
    expect(useJobStore.getState().selectedJobID).toBeNull()
  })

  it('returns conflict when deleting a job referenced by an appointment', () => {
    const job = buildJob()
    useJobStore.setState({ jobs: [job] })
    useAppointmentStore.getState().createAppointment(buildAppointment({ jobID: job.id }))

    const result = useJobStore.getState().deleteJob(job.id)

    expect(result).toEqual(err({ kind: 'conflict', message: expect.any(String) }))
    expect(useJobStore.getState().jobs).toHaveLength(1) // nothing was deleted
  })

  it('does not leak state between tests', () => {
    expect(useJobStore.getState().jobs).toHaveLength(0)
  })
})
