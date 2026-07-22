import { Clock, MapPin, Phone, ChevronRight } from "lucide-react"
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
            <Clock className="appt-icon" width={14} height={14} aria-hidden="true" />
            <span className="appt-detail-text">
              {appointment.startTime} – {appointment.endTime}
            </span>
          </div>

          <div className="appt-detail-row">
            <MapPin className="appt-icon" width={14} height={14} aria-hidden="true" />
            <span className="appt-detail-text">{client.address}</span>
          </div>

          <div className="appt-detail-row">
            <Phone className="appt-icon" width={14} height={14} aria-hidden="true" />
            <span className="appt-detail-text">{client.phoneNumber}</span>
          </div>
        </div>
      </div>

      {/* Chevron indicator */}
      <ChevronRight className="appt-chevron" width={18} height={18} aria-hidden="true" />
    </div>
  )
}