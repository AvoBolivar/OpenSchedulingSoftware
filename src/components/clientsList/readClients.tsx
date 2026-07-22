import type { Client } from "../../definitions/client"
import { useClientStore } from "../../stores/useClientStore"
import ClientCard from "./clientCard"
import "./readClients.css"

export default function ReadClients() {
  const clients = useClientStore((s) => s.clients)

  if (clients.length === 0) {
    return (
      <div className="clients-empty">
        <p className="clients-empty-title">No clients yet</p>
        <p className="clients-empty-hint">
          Add your first client to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="clients-list">
      {clients.map((client: Client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  )
}