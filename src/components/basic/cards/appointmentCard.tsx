import type { Appointment } from "../../../definitions/appointments"
import { useClientStore } from "../../../stores/useClientStore"
import "./appointmentCard.css"

interface AppointmentCardProps {
  appointment: Appointment
  onClick: () => void
}

export default function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const getClient = useClientStore((s) => s.getClient)
  const client = getClient(appointment.clientID)

  if (!client) {
    return (
      <div className="appt-card appt-card-loading">
        <div className="appt-date-block appt-skeleton" />
        <div className="appt-content">
          <div className="appt-skeleton appt-skeleton-line" />
          <div className="appt-skeleton appt-skeleton-line short" />
          <div className="appt-skeleton appt-skeleton-line" />
        </div>
      </div>
    )
  }


  // Parse the date to extract day number and month
  const dateObj = new Date(appointment.date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString("en-US", { month: "short" })
  const weekday = dateObj.toLocaleString("en-US", { weekday: "short" })

  // Get client initials for avatar
  const initials = client.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  // Format charge as currency
  const formattedCharge =
    typeof appointment.charge === "number"
      ? `$${appointment.charge.toFixed(2)}`
      : appointment.charge

  return (
    <div
      className="appt-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Date block on the left */}
      <div className="appt-date-block">
        <span className="appt-weekday">{weekday}</span>
        <span className="appt-day">{day}</span>
        <span className="appt-month">{month}</span>
      </div>

      {/* Main content */}
      <div className="appt-content">
        {/* Client header */}
        <div className="appt-client-header">
          <div className="appt-avatar">{initials}</div>
          <div className="appt-client-info">
            <h3 className="appt-client-name">{client.name}</h3>
            <span className="appt-charge">{formattedCharge}</span>
          </div>
        </div>

        {/* Detail rows */}
        <div className="appt-details">
          <div className="appt-detail-row">
            <svg className="appt-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="appt-detail-text">
              {appointment.startTime} – {appointment.endTime}
            </span>
          </div>

          <div className="appt-detail-row">
            <svg className="appt-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="appt-detail-text">{client.address}</span>
          </div>

          <div className="appt-detail-row">
            <svg className="appt-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
            <span className="appt-detail-text">{client.phoneNumber}</span>
          </div>
        </div>
      </div>

      {/* Chevron indicator */}
      <svg className="appt-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </div>
  )
}