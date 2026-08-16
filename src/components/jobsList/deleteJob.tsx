import { useState } from "react";
import Button from "../basic/button/button"
import Modal from "../modal/modal";
import { useJobStore } from "../../stores/useJobStore";
import { notify } from "../../lib/notify";

interface DeleteJobProps {
  jobID: string
}

export default function DeleteJob({ jobID }: DeleteJobProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteJob = useJobStore((s) => s.deleteJob)

  function handleDelete() {
    const result = deleteJob(jobID)
    if (!result.ok) {
      console.error(result.error.cause ?? result.error)
      notify(result.error)
      return
    }
    setIsModalOpen(false)
  }

  return (
    <>
      <Button label="x" variant="danger" onClick={() => setIsModalOpen(true)} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you would like to delete this Job?
        </p>
        <Button label="yes" onClick={handleDelete} />
        <Button label="no" onClick={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}
