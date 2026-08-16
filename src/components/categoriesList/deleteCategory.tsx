import { useState } from "react";
import Button from "../basic/button/button"
import Modal from "../modal/modal";
import { useCategoryStore } from "../../stores/useCategoryStore";

interface DeleteCategoryProps {
  categoryID: string
}

export default function DeleteCategory({ categoryID }: DeleteCategoryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory)

  // TODO(step 2.1): add the conflict check once Appointment has categoryIDs —
  // refuse deletion (kind: 'conflict') if any appointment still references this category.

  return (
    <>
      <Button label="x" onClick={() => setIsModalOpen(true)} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you would like to delete this Category?
        </p>
        <Button label="yes" onClick={() => {
          deleteCategory(categoryID)
          setIsModalOpen(false)
        }} />
        <Button label="no" onClick={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}
