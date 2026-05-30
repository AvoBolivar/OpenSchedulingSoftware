import Modal from "../modal/modal";
import Button from "../basic/button/button";
import Input from "../basic/input/input";
import { useState } from "react";
import { useClientStore } from "../../stores/useClientStore";
import type { Client } from "../../definitions/client";

interface UpdateClientProps {
  client: Client
}

export default function UpdateClient({client}: UpdateClientProps) {
  const updateClient = useClientStore((s) => s.updateClient)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(client.name);
  const [phoneNumber, setPhoneNumber] = useState(client.phoneNumber);
  const [address, setAddress] = useState(client.address);

  function handleOpen() {
    setName(client.name);
    setPhoneNumber(client.phoneNumber);
    setAddress(client.address);
    setIsModalOpen(true);
  }

  function updateClientInfo() {
    const newClient = {
      name: name,
      phoneNumber: phoneNumber,
      address: address
    }
    updateClient(client.id, newClient)
  }

  return (
    <>
    <Button label="edit" onClick={handleOpen} />
    
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={"Edit Client"}
    >
      <Input 
        label="name"
        placeholder="George Burdell"
        value={name}
        onChange={setName}
      />
      <Input 
        label="phoneNumber"
        placeholder="000-111-2233"
        value={phoneNumber}
        onChange={setPhoneNumber}
      />
      <Input 
        label="Address"
        placeholder="123 Main St"
        value={address}
        onChange={setAddress}
      />
      <Button label="save" onClick={() => {
        updateClientInfo()
        setIsModalOpen(false)
      }} />
    </Modal>

    </>
  )
}