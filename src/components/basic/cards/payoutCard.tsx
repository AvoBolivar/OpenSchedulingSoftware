import type { Client } from "../../../definitions/client"
import type { Appointment } from "../../../definitions/appointments"
import "./collectionCard.css"

interface PayoutCardProps {
  client: Client
  appointment: Appointment
  onClick: () => void
}

export default function PayoutCard({ client, appointment, onClick }: PayoutCardProps) {
  // Format date nicely
  const dateObj = new Date(appointment.date)
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Format charge as currency
  const formattedCharge =
    typeof appointment.expense === "number"
      ? `$${appointment.expense.toFixed(2)}`
      : `$${appointment.expense}`

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
        <span className="collection-amount-label">Needed To Pay:</span>
        <span className="collection-amount-value">{formattedCharge}</span>
      </div>
    </div>
  )
}