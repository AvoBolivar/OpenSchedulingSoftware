import { describe, it, expect } from 'vitest'
import { toDateKey, generateRecurringDates } from './date'

describe('generateRecurringDates', () => {
  it('generates one date per week from start through the end date, inclusive', () => {
    const start = new Date(2026, 0, 1) // Thu Jan 1 2026
    const end = new Date(2026, 0, 22) // Thu Jan 22 2026

    const dates = generateRecurringDates(start, 'weekly', end)

    expect(dates.map(toDateKey)).toEqual([
      '2026-01-01',
      '2026-01-08',
      '2026-01-15',
      '2026-01-22',
    ])
  })

  it('generates one date per month on the same day-of-month', () => {
    const start = new Date(2026, 0, 15) // Jan 15 2026
    const end = new Date(2026, 3, 15) // Apr 15 2026

    const dates = generateRecurringDates(start, 'monthly', end)

    expect(dates.map(toDateKey)).toEqual([
      '2026-01-15',
      '2026-02-15',
      '2026-03-15',
      '2026-04-15',
    ])
  })

  it('stops before exceeding the end date when the step overshoots it', () => {
    const start = new Date(2026, 0, 1)
    const end = new Date(2026, 0, 20) // one day short of the third weekly occurrence

    const dates = generateRecurringDates(start, 'weekly', end)

    expect(dates.map(toDateKey)).toEqual(['2026-01-01', '2026-01-08', '2026-01-15'])
  })

  it('returns just the start date when start and end are the same day', () => {
    const day = new Date(2026, 0, 1)

    expect(generateRecurringDates(day, 'weekly', day).map(toDateKey)).toEqual(['2026-01-01'])
  })

  it('returns an empty array when the end date is before the start date', () => {
    const start = new Date(2026, 0, 10)
    const end = new Date(2026, 0, 1)

    expect(generateRecurringDates(start, 'weekly', end)).toEqual([])
  })

  it('caps runaway ranges instead of generating an unbounded number of occurrences', () => {
    const start = new Date(2020, 0, 1)
    const end = new Date(2100, 0, 1) // ~80 years of weekly occurrences

    const dates = generateRecurringDates(start, 'weekly', end)

    expect(dates.length).toBe(520)
  })
})
