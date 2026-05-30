import { useLocalStorage } from "./useLocalStorage";
import type { Client } from "../definitions/client";


export function useClient(clientID: string): Client{
  const [clients] = useLocalStorage<Client[]>("clients", []);
  
  const selectedClient = clients.find((c: { id: string; }) => c.id === clientID)

  return selectedClient
}