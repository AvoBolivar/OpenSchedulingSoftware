import { useState } from "react"
import "./clientCard.css"
import DeleteClient from "../../clientsTable/deleteClient"
import UpdateClient from "../../clientsTable/updateClient"
import type { Client } from "../../../definitions/client"

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
          <svg
            className={`client-chevron ${expanded ? "open" : ""}`}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="client-detail-panel">
          <div className="client-details">
            <div className="client-detail-row">
              <div className="client-detail-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="client-detail-text">
                <span className="client-detail-label">Address</span>
                <span className="client-detail-value">{client.address || "—"}</span>
              </div>
            </div>

            <div className="client-detail-row">
              <div className="client-detail-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="16" y2="17" />
                </svg>
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