import { useState } from "react"
import { Plus, X } from "lucide-react"
import { useEmployeeStore } from "../../stores/useEmployeeStore"
import type { Employee } from "../../definitions/employee"
import Input from "../basic/input/input"
import Button from "../basic/button/button"
import Switch from "../basic/switch/switch"
import Modal from "../modal/modal"

interface UpdateEmployeeProps {
  employee: Employee
}

export default function UpdateEmployee({ employee }: UpdateEmployeeProps) {
  const updateEmployee = useEmployeeStore((s) => s.updateEmployee)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState(employee.name)
  const [phoneNumber, setPhoneNumber] = useState(employee.phoneNumber)
  const [notes, setNotes] = useState<string[]>(employee.notes ?? [])
  const [noteDraft, setNoteDraft] = useState("")
  const [active, setActive] = useState(employee.active)

  function handleOpen() {
    // Re-sync state from the latest employee prop in case it changed
    setName(employee.name)
    setPhoneNumber(employee.phoneNumber)
    setNotes(employee.notes ?? [])
    setNoteDraft("")
    setActive(employee.active)
    setIsModalOpen(true)
  }

  function addNote() {
    const trimmed = noteDraft.trim()
    if (!trimmed) return
    setNotes((prev) => [...prev, trimmed])
    setNoteDraft("")
  }

  function removeNote(index: number) {
    setNotes((prev) => prev.filter((_, i) => i !== index))
  }

  function updateEmployeeInfo() {
    updateEmployee(employee.id, {
      name,
      phoneNumber,
      notes,
      active,
    })
    setIsModalOpen(false)
  }

  return (
    <>
      <Button label="edit" onClick={handleOpen} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Employee"
      >
        <div className="flex flex-col gap-[18px] text-foreground">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-2.5">
              <Input label="Name" placeholder="George Burdell" value={name} onChange={setName} />
              <Input label="Phone Number" placeholder="000-111-2233" value={phoneNumber} onChange={setPhoneNumber} />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Status</span>
            <Switch
              label="Active Employee"
              description={active ? "Currently working" : "Inactive — not working"}
              checked={active}
              onChange={setActive}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Notes</span>
            <div className="flex items-end gap-2 [&>:first-child]:min-w-0 [&>:first-child]:flex-1">
              <Input
                label=""
                placeholder="Add a note..."
                value={noteDraft}
                onChange={setNoteDraft}
              />
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground shadow-sm transition-transform hover:-translate-y-px active:translate-y-0 active:brightness-95"
                onClick={addNote}
                aria-label="Add note"
              >
                <Plus width={20} height={20} aria-hidden="true" />
              </button>
            </div>
            {notes.length > 0 && (
              <ul className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
                {notes.map((note, i) => (
                  <li key={i} className="flex items-center justify-between gap-2.5 rounded-lg border border-border bg-primary/5 py-2 pr-2 pl-3">
                    <span className="flex-1 text-sm break-words text-foreground">{note}</span>
                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary hover:text-primary-foreground active:bg-primary/20"
                      onClick={() => removeNote(i)}
                      aria-label="Remove note"
                    >
                      <X width={16} height={16} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-1 flex flex-col border-t border-border pt-3 [&>*]:flex-1">
            <Button label="Save" onClick={updateEmployeeInfo} />
          </div>
        </div>
      </Modal>
    </>
  )
}
