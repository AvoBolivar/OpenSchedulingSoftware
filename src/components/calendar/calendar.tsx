import Calendar from "react-calendar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "./calendar.css"

interface ThemedCalendarProps {
  value: Date | null
  onChange: (date: Date) => void
  eventDates?: Date[]
}

export default function ThemedCalendar({
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
      <Calendar
        value={value}
        onChange={(val) => {
          if (val instanceof Date) onChange(val)
        }}
        className="themed-calendar"
        prev2Label={null}
        next2Label={null}
        prevLabel={<ChevronLeft width={18} height={18} strokeWidth={2.5} />}
        nextLabel={<ChevronRight width={18} height={18} strokeWidth={2.5} />}
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
  )
}