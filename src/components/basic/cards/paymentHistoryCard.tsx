import type { Client } from "../../../definitions/client"
import type { Payment } from "../../../definitions/payments"
import { Card } from "../../ui/card"

interface PaymentHistoryCardProps {
  client: Client
  payment: Payment
  onClick: () => void
}

export default function PaymentHistoryCard({ client, payment, onClick }: PaymentHistoryCardProps) {
  const formattedDate = new Date(payment.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

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
        <p className="truncate text-xs text-muted-foreground">{payment.method || "—"}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        <span className="text-xs text-muted-foreground">Received</span>
        <span className="text-sm font-medium">{formattedDate}</span>
      </div>
    </Card>
  )
}
