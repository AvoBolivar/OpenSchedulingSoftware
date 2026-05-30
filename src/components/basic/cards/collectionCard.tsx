import type { Client } from "../../../definitions/client"
import type { Appointment } from "../../../definitions/appointments"
import "./collectionCard.css"

interface CollectionCardProps {
  client: Client
  appointment: Appointment
  onClick: () => void
}

export default function CollectionCard({ client, appointment, onClick }: CollectionCardProps) {
  // Format date nicely
  const dateObj = new Date(appointment.date)
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Format charge as currency
  const formattedCharge =
    typeof appointment.charge === "number"
      ? `$${appointment.charge.toFixed(2)}`
      : `$${appointment.charge}`

  return (
    <div
      className="collection-card"
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
      <div className="collection-main">
        <h3 className="collection-name">{client.name}</h3>
        <p className="collection-detail">{client.phoneNumber}</p>
        <p className="collection-detail">{client.address}</p>
        <p className="collection-date">Appointment {formattedDate}</p>
      </div>

      <div className="collection-amount">
        <span className="collection-amount-label">Owed</span>
        <span className="collection-amount-value">{formattedCharge}</span>
      </div>
    </div>
  )
}