import { useState } from "react";
import Button from "../basic/button/button"
import Modal from "../modal/modal";
import { useClientStore } from "../../stores/useClientStore";

interface DeleteClientProps {
  clientID: string
}

export default function DeleteClient({clientID}: DeleteClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteClient = useClientStore((s) => s.deleteClient)
  

  return (
    <>
      <Button label="x" onClick={() => setIsModalOpen(true)} />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you would like to delete this Client?
        </p>
        <Button label="yes" onClick={() => {
          deleteClient(clientID)
          setIsModalOpen(false)
        }}/>
        <Button label="no" onClick={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}