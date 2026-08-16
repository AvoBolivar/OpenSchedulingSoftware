import { useState } from "react"
import { useCategoryStore } from "../../stores/useCategoryStore"
import type { Category } from "../../definitions/category"
import Input from "../basic/input/input"
import Button from "../basic/button/button"
import Modal from "../modal/modal"

interface UpdateCategoryProps {
  category: Category
}

export default function UpdateCategory({ category }: UpdateCategoryProps) {
  const updateCategory = useCategoryStore((s) => s.updateCategory)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState(category.name)

  function handleOpen() {
    // Re-sync state from the latest category prop in case it changed
    setName(category.name)
    setIsModalOpen(true)
  }

  function updateCategoryInfo() {
    updateCategory(category.id, { name })
    setIsModalOpen(false)
  }

  return (
    <>
      <Button label="edit" onClick={handleOpen} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Category"
      >
        <div className="flex flex-col gap-[18px] text-foreground">
          <Input label="Name" placeholder="Deep Clean" value={name} onChange={setName} />

          <div className="mt-1 flex flex-col border-t border-border pt-3 [&>*]:flex-1">
            <Button label="Save" onClick={updateCategoryInfo} />
          </div>
        </div>
      </Modal>
    </>
  )
}
