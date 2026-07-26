export function toDateKey(d: Date): string {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function fromDateKey(key: string): Date {
    const [year, month, day] = key.split('-').map(Number)
    return new Date(year, month - 1, day)
}

export type RecurrenceFrequency = 'weekly' | 'monthly'

// Safety cap so a mistaken far-future end date can't generate an unbounded
// run of appointments (520 = 10 years of weekly occurrences).
const MAX_RECURRING_OCCURRENCES = 520

// Generates one Date per occurrence from `start` through `endDate` (inclusive),
// stepping by 7 days (weekly) or by calendar month (monthly, same day-of-month).
export function generateRecurringDates(start: Date, frequency: RecurrenceFrequency, endDate: Date): Date[] {
    const dates: Date[] = []
    let current = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())

    while (current <= end && dates.length < MAX_RECURRING_OCCURRENCES) {
        dates.push(current)
        current = frequency === 'weekly'
            ? new Date(current.getFullYear(), current.getMonth(), current.getDate() + 7)
            : new Date(current.getFullYear(), current.getMonth() + 1, current.getDate())
    }

    return dates
}