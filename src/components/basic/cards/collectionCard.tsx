import type { Client } from "../../../definitions/client"
import type { Appointment } from "../../../definitions/appointments"
import { fromDateKey } from "../../../lib/date"
import { Card } from "../../ui/card"

interface CollectionCardProps {
  client: Client
  appointment: Appointment
  onClick: () => void
}

export default function CollectionCard({ client, appointment, onClick }: CollectionCardProps) {
  const dateObj = fromDateKey(appointment.date)
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const formattedCharge =
    typeof appointment.charge === "number"
      ? `$${appointment.charge.toFixed(2)}`
      : `$${appointment.charge}`

  return (
    <Card
      className="flex-row items-center justify-between gap-3 p-3"
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
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium">{client.name}</h3>
        <p className="truncate text-xs text-muted-foreground">{client.phoneNumber}</p>
        <p className="truncate text-xs text-muted-foreground">{client.address}</p>
        <p className="mt-1 text-xs text-muted-foreground">Appointment {formattedDate}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        <span className="text-xs text-muted-foreground">Owed</span>
        <span className="text-base font-semibold text-primary">{formattedCharge}</span>
      </div>
    </Card>
  )
}
