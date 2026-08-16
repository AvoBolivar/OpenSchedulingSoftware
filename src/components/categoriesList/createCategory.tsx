import { useState } from "react"
import { useCategoryStore } from "../../stores/useCategoryStore"
import Button from "../basic/button/button"
import Input from "../basic/input/input"
import Modal from "../modal/modal"

export default function CreateCategory() {
  const createCategory = useCategoryStore((s) => s.createCategory)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")

  function resetForm() {
    setName("")
  }

  function addCategory() {
    createCategory({ name })
    resetForm()
    setIsModalOpen(false)
  }

  return (
    <>
      <Button label="Add Category" onClick={() => setIsModalOpen(true)} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Category"
      >
        <div className="flex flex-col gap-[18px] text-foreground">
          <Input label="Name" placeholder="Deep Clean" value={name} onChange={setName} />

          <div className="mt-1 flex flex-col border-t border-border pt-3 [&>*]:flex-1">
            <Button label="Done" onClick={addCategory} />
          </div>
        </div>
      </Modal>
    </>
  )
}
