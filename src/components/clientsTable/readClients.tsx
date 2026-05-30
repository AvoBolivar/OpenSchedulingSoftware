import type { Client } from "../../definitions/client"
import { useClientStore } from "../../stores/useClientStore"
import ClientCard from "../basic/cards/clientCard"

export default function ReadClients() {
  const clients = useClientStore((s) => s.clients)
  return (
    <div>
      {clients.length == 0 ?
        <div>
          <p>no clients</p>
        </div>
        :
        clients.map((client: Client) => (
          <div>
            <ClientCard client={client}/>
          </div>
        ))
      }
    </div>
    )
}