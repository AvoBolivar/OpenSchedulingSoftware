import { useState } from "react"
import { useClientStore } from "../../stores/useClientStore";
import Input from "../basic/input/input"
import Button from "../basic/button/button"
import Modal from "../modal/modal";

export default function CreateClient() {
  const createClient = useClientStore((s) => s.createClient)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  function addClient() {
    
    const tempClient = {
      name: name,
      phoneNumber: phoneNumber,
      address: address
    }

    setName("");
    setPhoneNumber("");
    setAddress("");

    createClient(tempClient)
    setIsModalOpen(false)
  }

  return (
    <>
      <Button label="Add Client" onClick={() => setIsModalOpen(true)}/>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Client"
      >
        <Input
          label="Name"
          placeholder="George Burdell"
          value={name}
          onChange={setName}
        />
        <Input
          label="Phone Number"
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
        
        <Button label="Done" onClick={() => {addClient()}} />
      </Modal>
    </>
  )
}