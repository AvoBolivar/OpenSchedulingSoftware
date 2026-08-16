import { useState } from "react";
import Button from "../basic/button/button"
import Modal from "../modal/modal";
import { useJobStore } from "../../stores/useJobStore";

interface DeleteJobProps {
  jobID: string
}

export default function DeleteJob({ jobID }: DeleteJobProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteJob = useJobStore((s) => s.deleteJob)

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
        <Button label="yes" onClick={() => {
          deleteJob(jobID)
          setIsModalOpen(false)
        }} />
        <Button label="no" onClick={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}
