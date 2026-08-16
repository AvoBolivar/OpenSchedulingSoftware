import { useState } from "react";
import Button from "../basic/button/button"
import Modal from "../modal/modal";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { notify } from "../../lib/notify";

interface DeleteCategoryProps {
  categoryID: string
}

export default function DeleteCategory({ categoryID }: DeleteCategoryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory)

  function handleDelete() {
    const result = deleteCategory(categoryID)
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
          Are you sure you would like to delete this Category?
        </p>
        <Button label="yes" onClick={handleDelete} />
        <Button label="no" onClick={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}
