import { useState } from "react";
import Button from "../basic/button/button"
import Modal from "../modal/modal";
import { useEmployeeStore } from "../../stores/useEmployeeStore";
import { notify } from "../../lib/notify";

interface DeleteEmployeeProps {
  employeeID: string
}

export default function DeleteEmployee({employeeID}: DeleteEmployeeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteEmployee = useEmployeeStore((s) => s.deleteEmployee)

  function handleDelete() {
    const result = deleteEmployee(employeeID)
    if (!result.ok) {
      console.error(result.error.cause ?? result.error)
      notify(result.error)
      return
    }
    setIsModalOpen(false)
  }

  return (
    <>
      <Button label="x" onClick={() => setIsModalOpen(true)} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you would like to delete this Employee?
        </p>
        <Button label="yes" onClick={handleDelete}/>
        <Button label="no" onClick={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}
