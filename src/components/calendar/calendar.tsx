import Calendar from "react-calendar"
import "./calendar.css"

interface ThemedCalendarProps {
  label?: string
  value: Date | null
  onChange: (date: Date) => void
  eventDates?: Date[]
}

export default function ThemedCalendar({
  label,
  value,
  onChange,
  eventDates = [],
}: ThemedCalendarProps) {
  // Normalize dates to YYYY-MM-DD for fast lookup
  const eventDateSet = new Set(
    eventDates.map((d) => d.toDateString())
  )

  const hasEvent = (date: Date) => eventDateSet.has(date.toDateString())

  const isToday = (date: Date) =>
    date.toDateString() === new Date().toDateString()

  return (
    <div className="cal-wrapper">
      {label && <label className="cal-label">{label}</label>}

      <Calendar
        value={value}
        onChange={(val) => {
          if (val instanceof Date) onChange(val)
        }}
        className="themed-calendar"
        prev2Label={null}
        next2Label={null}
        prevLabel={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        }
        nextLabel={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        }
        formatShortWeekday={(_locale, date) =>
          ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
        }
        tileContent={({ date, view }) =>
          view === "month" && hasEvent(date) ? (
            <span className="cal-event-dot" aria-label="Has event" />
          ) : null
        }
        tileClassName={({ date, view }) => {
          if (view !== "month") return ""
          const classes = []
          if (isToday(date)) classes.push("cal-today")
          if (hasEvent(date)) classes.push("cal-has-event")
          return classes.join(" ")
        }}
      />
    </div>
  )
}