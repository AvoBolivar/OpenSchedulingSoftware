import "./clientCard.css"
import DeleteClient from "../../clientsTable/deleteClient"
import UpdateClient from "../../clientsTable/updateClient"
import type { Client } from "../../../definitions/client"

interface ClientCardProps {
  client: Client
}

export default function ClientCard({ client }: ClientCardProps) {

  // Get initials for avatar
  const initials = client.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="client-card">
      {/* Header with avatar and actions */}
      <div className="client-card-header">
        <div className="client-avatar">{initials}</div>
        <div className="client-name-wrapper">
          <h3 className="client-name">{client.name}</h3>
          <span className="client-label">Client</span>
        </div>
        <div className="client-actions">
          <UpdateClient client={client}/>
          <DeleteClient clientID={client.id}/>
        </div>
      </div>

      {/* Divider */}
      <div className="client-divider" />

      {/* Contact details */}
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
            <span className="client-detail-value">{client.address}</span>
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
            
              {client.phoneNumber}
          </div>
        </div>
      </div>
    </div>
  )
}