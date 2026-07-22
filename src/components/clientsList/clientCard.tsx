import { useState } from "react"
import { ChevronDown, MapPin, Phone, FileText } from "lucide-react"
import "./clientCard.css"
import DeleteClient from "./deleteClient"
import UpdateClient from "./updateClient"
import type { Client } from "../../definitions/client"

interface ClientCardProps {
  client: Client
}

export default function ClientCard({ client }: ClientCardProps) {
  const [expanded, setExpanded] = useState(false)

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n)

  const noteCount = client.notes?.length ?? 0

  return (
    <div className={`client-card ${!client.active ? "is-inactive" : ""}`}>
      {/* Always-visible summary — tap to expand */}
      <button
        type="button"
        className="client-summary"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="client-summary-main">
          <h3 className="client-name">{client.name}</h3>
          <span className={`client-status ${client.active ? "is-active" : ""}`}>
            <span className="client-status-dot" />
            {client.active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="client-summary-right">
          <span className="client-summary-price">
            {formatCurrency(client.price)}
          </span>
          <ChevronDown
            className={`client-chevron ${expanded ? "open" : ""}`}
            width={18}
            height={18}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="client-detail-panel">
          <div className="client-details">
            <div className="client-detail-row">
              <div className="client-detail-icon">
                <MapPin width={14} height={14} aria-hidden="true" />
              </div>
              <div className="client-detail-text">
                <span className="client-detail-label">Address</span>
                <span className="client-detail-value">{client.address || "—"}</span>
              </div>
            </div>

            <div className="client-detail-row">
              <div className="client-detail-icon">
                <Phone width={14} height={14} aria-hidden="true" />
              </div>
              <div className="client-detail-text">
                <span className="client-detail-label">Phone</span>
                <span className="client-detail-value">{client.phoneNumber || "—"}</span>
              </div>
            </div>
          </div>

          {/* Both figures live here now, so the summary stays clean */}
          <div className="client-finance">
            <div className="client-finance-item">
              <span className="client-finance-label">Price</span>
              <span className="client-finance-value">{formatCurrency(client.price)}</span>
            </div>
            <div className="client-finance-divider" />
            <div className="client-finance-item">
              <span className="client-finance-label">Employee Pay</span>
              <span className="client-finance-value">{formatCurrency(client.employeePayment)}</span>
            </div>
          </div>

          {noteCount > 0 && (
            <div className="client-notes">
              <div className="client-notes-header">
                <FileText width={12} height={12} aria-hidden="true" />
                <span className="client-notes-label">
                  Notes <span className="client-notes-count">{noteCount}</span>
                </span>
              </div>
              <ul className="client-notes-list">
                {client.notes.map((note, i) => (
                  <li key={i} className="client-notes-item">{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="client-actions">
            <UpdateClient client={client} />
            <DeleteClient clientID={client.id} />
          </div>
        </div>
      )}
    </div>
  )
}