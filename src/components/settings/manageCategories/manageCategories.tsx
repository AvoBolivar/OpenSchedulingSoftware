import { useState } from "react"
import Button from "../../basic/button/button"
import Modal from "../../modal/modal"
import CategoriesList from "../../categoriesList/categoriesList"
import CreateCategory from "../../categoriesList/createCategory"

export default function ManageCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button label="Manage Categories" onClick={() => setIsModalOpen(true)} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Manage Categories"
      >
        <div className="flex flex-col gap-[18px] text-foreground">
          <CategoriesList />
          <CreateCategory />
        </div>
      </Modal>
    </>
  )
}
