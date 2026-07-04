import { useState } from "react"
import { useClientStore } from "../../stores/useClientStore"
import type { Client } from "../../definitions/client"
import Button from "../basic/button/button"
import Input from "../basic/input/input"
import Modal from "../modal/modal"
import "./createClient.css"

type NewClient = Omit<Client, "id">

export default function CreateClient() {
  const createClient = useClientStore((s) => s.createClient)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [price, setPrice] = useState(0)
  const [employeePayment, setEmployeePayment] = useState(0)
  const [notes, setNotes] = useState<string[]>([])
  const [noteDraft, setNoteDraft] = useState("")
  const [active, setActive] = useState(true)

  function resetForm() {
    setName("")
    setPhoneNumber("")
    setAddress("")
    setPrice(0)
    setEmployeePayment(0)
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
        <div className="create-client-form">
          <div className="form-section">
            <span className="form-section-label">Basic Info</span>
            <div className="form-fields">
              <Input label="Name" placeholder="George Burdell" value={name} onChange={setName} />
              <Input label="Phone Number" placeholder="000-111-2233" value={phoneNumber} onChange={setPhoneNumber} />
              <Input label="Address" placeholder="123 Main St" value={address} onChange={setAddress} />
            </div>
          </div>

          <div className="form-section">
            <span className="form-section-label">Financial</span>
            <div className="form-fields form-fields-row">
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

          <div className="form-section">
            <span className="form-section-label">Status</span>
            <div className="toggle-row">
              <div className="toggle-text">
                <span className="toggle-title">Active Client</span>
                <span className="toggle-subtitle">
                  {active ? "Currently scheduling" : "Inactive — not scheduling"}
                </span>
              </div>
              <button
                type="button"
                className={`toggle-switch ${active ? "is-active" : ""}`}
                onClick={() => setActive((v) => !v)}
                aria-pressed={active}
                aria-label="Toggle active status"
              >
                <span className="toggle-knob" />
              </button>
            </div>
          </div>

          <div className="form-section">
            <span className="form-section-label">Notes</span>
            <div className="note-input-row">
              <Input
                label=""
                placeholder="Add a note..."
                value={noteDraft}
                onChange={setNoteDraft}
              />
              <button
                type="button"
                className="note-add-btn"
                onClick={addNote}
                aria-label="Add note"
              >
                +
              </button>
            </div>
            {notes.length > 0 && (
              <ul className="note-list">
                {notes.map((note, i) => (
                  <li key={i} className="note-item">
                    <span className="note-text">{note}</span>
                    <button
                      type="button"
                      className="note-remove-btn"
                      onClick={() => removeNote(i)}
                      aria-label="Remove note"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-actions">
            <Button label="Done" onClick={addClient} />
          </div>
        </div>
      </Modal>
    </>
  )
}