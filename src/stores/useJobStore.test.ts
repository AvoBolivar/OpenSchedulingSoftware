import { describe, it, expect, beforeEach } from 'vitest'
import { useJobStore } from './useJobStore'
import { resetStores } from '../testUtils/resetStores'
import { buildJob } from '../testUtils/builders'

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

    useJobStore.getState().deleteJob(job.id)

    expect(useJobStore.getState().jobs).toHaveLength(0)
    expect(useJobStore.getState().selectedJobID).toBeNull()
  })

  it('does not leak state between tests', () => {
    expect(useJobStore.getState().jobs).toHaveLength(0)
  })
})
