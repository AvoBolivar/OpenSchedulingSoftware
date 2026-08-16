import Calendar from "react-calendar"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ThemedCalendarProps {
  value: Date | null
  onChange: (date: Date) => void
  eventDates?: Date[]
  minDate?: Date
}

// react-calendar renders its own fixed BEM class names (`.react-calendar__*`)
// that we can't attach per-element Tailwind classes to. Tailwind's arbitrary-
// variant `_`→space rule collides with the literal underscores in those BEM
// names (verified: `\_` escaping still gets collapsed to a space when
// Tailwind builds the descendant selector), so this is themed via a `@layer
// components` block in index.css (still token/Tailwind-driven via `@apply`)
// instead — see the "react-calendar" section there.
const CALENDAR_CLASSNAME = "themed-calendar"

export default function ThemedCalendar({
  value,
  onChange,
  eventDates = [],
  minDate,
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
        minDate={minDate}
        className={CALENDAR_CLASSNAME}
        calendarType="gregory"
        prev2Label={null}
        next2Label={null}
        prevLabel={<ChevronLeft width={18} height={18} strokeWidth={2.5} />}
        nextLabel={<ChevronRight width={18} height={18} strokeWidth={2.5} />}
        formatShortWeekday={(_locale, date) =>
          ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
        }
        tileContent={({ date, view }) =>
          view === "month" && hasEvent(date) ? (
            <span
              className="cal-event-dot mt-px block h-[5px] w-[5px] rounded-full bg-primary"
              aria-label="Has event"
            />
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