import type { Client } from "../../../definitions/client"
import type { Payment } from "../../../definitions/payments"
import "./paymentHistoryCard.css"

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
    <div
      className="payment-history-card"
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
      <div className="payment-history-main">
        <h3 className="payment-history-name">{client.name}</h3>
        <p className="payment-history-detail">{payment.method || "—"}</p>
      </div>

      <div className="payment-history-date">
        <span className="payment-history-date-label">Received</span>
        <span className="payment-history-date-value">{formattedDate}</span>
      </div>
    </div>
  )
}
