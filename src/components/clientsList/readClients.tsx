import type { Client } from "../../definitions/client"
import { useClientStore } from "../../stores/useClientStore"
import ClientCard from "./clientCard"

export default function ReadClients() {
  const clients = useClientStore((s) => s.clients)

  if (clients.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-muted-foreground">
        <p className="m-0 mb-1 text-base font-bold text-primary">No clients yet</p>
        <p className="m-0 text-sm">
          Add your first client to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3.5">
      {clients.map((client: Client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  )
}