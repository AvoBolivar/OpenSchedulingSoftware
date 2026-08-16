import { describe, it, expect, beforeEach } from 'vitest'
import { useAppointmentStore } from './useAppointmentStore'
import { resetStores } from '../testUtils/resetStores'
import { buildAppointment } from '../testUtils/builders'

describe('useAppointmentStore', () => {
  beforeEach(() => resetStores())

  it('adds an appointment with a generated id on createAppointment', () => {
    useAppointmentStore.getState().createAppointment(buildAppointment({ name: 'Deep Clean' }))

    const appointments = useAppointmentStore.getState().appointments
    expect(appointments).toHaveLength(1)
    expect(appointments[0].name).toBe('Deep Clean')
    expect(appointments[0].id).toEqual(expect.any(String))
  })

  it('returns appointments matching the given jobID via getAppointmentsByJobID', () => {
    const matching1 = buildAppointment({ jobID: 'job-1' })
    const matching2 = buildAppointment({ jobID: 'job-1' })
    const other = buildAppointment({ jobID: 'job-2' })
    const unassigned = buildAppointment({ jobID: null })
    useAppointmentStore.setState({ appointments: [matching1, other, matching2, unassigned] })

    const result = useAppointmentStore.getState().getAppointmentsByJobID('job-1')

    expect(result).toEqual([matching1, matching2])
  })

  it('backfills name/categoryIDs/employeeIDs/jobID on migrate for pre-v1 persisted appointments', () => {
    const legacyAppointment = {
      id: 'legacy-1',
      clientID: 'client-1',
      date: '2026-01-01',
      charge: 100,
      startTime: '9:00 AM',
      endTime: '10:00 AM',
      expense: 25,
      show: true,
    }
    const migrate = useAppointmentStore.persist.getOptions().migrate
    if (!migrate) throw new Error('expected a migrate function to be configured')

    const migrated = migrate({ appointments: [legacyAppointment] }, 0) as { appointments: unknown[] }

    expect(migrated.appointments[0]).toEqual({
      ...legacyAppointment,
      name: '',
      categoryIDs: [],
      employeeIDs: [],
      jobID: null,
    })
  })

  it('leaves an already-migrated appointment untouched on migrate', () => {
    const appointment = buildAppointment({
      name: 'Deep Clean',
      categoryIDs: ['cat-1'],
      employeeIDs: ['emp-1'],
      jobID: 'job-1',
    })
    const migrate = useAppointmentStore.persist.getOptions().migrate
    if (!migrate) throw new Error('expected a migrate function to be configured')

    const migrated = migrate({ appointments: [appointment] }, 1) as { appointments: unknown[] }

    expect(migrated.appointments[0]).toEqual(appointment)
  })

  it('does not leak state between tests', () => {
    expect(useAppointmentStore.getState().appointments).toHaveLength(0)
  })
})
