import { useState } from "react"
import { Plus, X } from "lucide-react"
import { useClientStore } from "../../stores/useClientStore"
import type { Client } from "../../definitions/client"
import Button from "../basic/button/button"
import Input from "../basic/input/input"
import TimePicker from "../basic/time/timePicker"
import Switch from "../basic/switch/switch"
import Modal from "../modal/modal"

type NewClient = Omit<Client, "id">

export default function CreateClient() {
  const createClient = useClientStore((s) => s.createClient)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [price, setPrice] = useState(0)
  const [employeePayment, setEmployeePayment] = useState(0)
  const [defaultStartTime, setDefaultStartTime] = useState("9:00 AM")
  const [defaultEndTime, setDefaultEndTime] = useState("10:00 AM")
  const [notes, setNotes] = useState<string[]>([])
  const [noteDraft, setNoteDraft] = useState("")
  const [active, setActive] = useState(true)

  function resetForm() {
    setName("")
    setPhoneNumber("")
    setAddress("")
    setPrice(0)
    setEmployeePayment(0)
    setDefaultStartTime("9:00 AM")
    setDefaultEndTime("10:00 AM")
    setNotes([])
    setNoteDraft("")
    setActive(true)
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

  function addClient() {
    const tempClient: NewClient = {
      name,
      phoneNumber,
      address,
      price,
      employeePayment,
      defaultStartTime,
      defaultEndTime,
      notes,
      active,
    }

    createClient(tempClient)
    resetForm()
    setIsModalOpen(false)
  }

  return (
    <>
      <Button label="Add Client" onClick={() => setIsModalOpen(true)} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Client"
      >
        <div className="flex flex-col gap-[18px] text-foreground">
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Basic Info</span>
            <div className="flex flex-col gap-2.5">
              <Input label="Name" placeholder="George Burdell" value={name} onChange={setName} />
              <Input label="Phone Number" placeholder="000-111-2233" value={phoneNumber} inputMode="tel" onChange={setPhoneNumber} />
              <Input label="Address" placeholder="123 Main St" value={address} inputMode="decimal" onChange={setAddress} />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Financials</span>
            <div className="flex flex-col gap-2.5 [&>*]:min-w-0 [&>*]:flex-1 min-[420px]:flex-row min-[420px]:gap-3">
              <Input
                label="Price"
                placeholder="0"
                value={String(price)}
                onChange={(v) => setPrice(Number(v) || 0)}
              />
              <Input
                label="Employee Payment"
                placeholder="0"
                value={String(employeePayment)}
                onChange={(v) => setEmployeePayment(Number(v) || 0)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Schedule</span>
            <div className="flex flex-col gap-2.5 [&>*]:min-w-0 [&>*]:flex-1 min-[420px]:flex-row min-[420px]:gap-3">
              <TimePicker
                label="Default Start Time"
                value={defaultStartTime}
                onChange={setDefaultStartTime}
              />
              <TimePicker
                label="Default End Time"
                value={defaultEndTime}
                onChange={setDefaultEndTime}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Status</span>
            <Switch
              label="Active Client"
              description={active ? "Currently scheduling" : "Inactive — not scheduling"}
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
            <Button label="Done" onClick={addClient} />
          </div>
        </div>
      </Modal>
    </>
  )
}