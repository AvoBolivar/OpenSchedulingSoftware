import { useState, useRef, useEffect } from "react"
import "./timePicker.css"

interface TimePickerProps {
  label: string
  value: string // "HH:MM AM/PM" format, e.g. "9:30 AM"
  onChange: (value: string) => void
}

export default function TimePicker({ label, value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Parse the value into parts
  const parseTime = (str: string) => {
    const match = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (!match) return { hour: 9, minute: 0, period: "AM" as "AM" | "PM" }
    return {
      hour: parseInt(match[1], 10),
      minute: parseInt(match[2], 10),
      period: match[3].toUpperCase() as "AM" | "PM",
    }
  }

  const { hour, minute, period } = parseTime(value)

  const updateTime = (h: number, m: number, p: "AM" | "PM") => {
    onChange(`${h}:${m.toString().padStart(2, "0")} ${p}`)
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const hours = Array.from({ length: 12 }, (_, i) => i + 1) // 1-12
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5) // 0, 5, 10, ..., 55

  return (
    <div className="tp-wrapper" ref={wrapperRef}>
      <label className="tp-label">{label}</label>

      <button
        type="button"
        className={`tp-input ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="tp-clock-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="tp-value">
          {hour}:{minute.toString().padStart(2, "0")} {period}
        </span>
        <svg
          className={`tp-chevron ${isOpen ? "open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="tp-dropdown">
          <div className="tp-columns">
            {/* Hours */}
            <div className="tp-column">
              <div className="tp-column-label">Hour</div>
              <div className="tp-scroll">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className={`tp-option ${hour === h ? "selected" : ""}`}
                    onClick={() => updateTime(h, minute, period)}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="tp-separator">:</div>

            {/* Minutes */}
            <div className="tp-column">
              <div className="tp-column-label">Min</div>
              <div className="tp-scroll">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`tp-option ${minute === m ? "selected" : ""}`}
                    onClick={() => updateTime(hour, m, period)}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM */}
            <div className="tp-column tp-period-column">
              <div className="tp-column-label">Period</div>
              <div className="tp-period-toggle">
                <button
                  type="button"
                  className={`tp-period ${period === "AM" ? "selected" : ""}`}
                  onClick={() => updateTime(hour, minute, "AM")}
                >
                  AM
                </button>
                <button
                  type="button"
                  className={`tp-period ${period === "PM" ? "selected" : ""}`}
                  onClick={() => updateTime(hour, minute, "PM")}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          <div className="tp-footer">
            <button
              type="button"
              className="tp-now-btn"
              onClick={() => {
                const now = new Date()
                let h = now.getHours()
                const m = Math.round(now.getMinutes() / 5) * 5
                const p: "AM" | "PM" = h >= 12 ? "PM" : "AM"
                h = h % 12 || 12
                updateTime(h, m === 60 ? 0 : m, p)
              }}
            >
              Now
            </button>
            <button
              type="button"
              className="tp-done-btn"
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}