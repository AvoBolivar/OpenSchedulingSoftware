import { useState } from "react"
import { useClientStore } from "../../stores/useClientStore"
import type { Client } from "../../definitions/client"
import Input from "../basic/input/input"
import Button from "../basic/button/button"
import Modal from "../modal/modal"
import "./createClient.css"

interface UpdateClientProps {
  client: Client
}

export default function UpdateClient({ client }: UpdateClientProps) {
  const updateClient = useClientStore((s) => s.updateClient)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState(client.name)
  const [phoneNumber, setPhoneNumber] = useState(client.phoneNumber)
  const [address, setAddress] = useState(client.address)
  const [price, setPrice] = useState(client.price)
  const [employeePayment, setEmployeePayment] = useState(client.employeePayment)
  const [notes, setNotes] = useState<string[]>(client.notes ?? [])
  const [noteDraft, setNoteDraft] = useState("")
  const [active, setActive] = useState(client.active)

  function handleOpen() {
    // Re-sync state from the latest client prop in case it changed
    setName(client.name)
    setPhoneNumber(client.phoneNumber)
    setAddress(client.address)
    setPrice(client.price)
    setEmployeePayment(client.employeePayment)
    setNotes(client.notes ?? [])
    setNoteDraft("")
    setActive(client.active)
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

  function updateClientInfo() {
    updateClient(client.id, {
      name,
      phoneNumber,
      address,
      price,
      employeePayment,
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
        title="Edit Client"
      >
        <div className="create-client-form">
          <div className="form-section">
            <div className="form-fields">
              <Input label="Name" placeholder="George Burdell" value={name} onChange={setName} />
              <Input label="Phone Number" placeholder="000-111-2233" value={phoneNumber} onChange={setPhoneNumber} />
              <Input label="Address" placeholder="123 Main St" value={address} onChange={setAddress} />
            </div>
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
            <Button label="Save" onClick={updateClientInfo} />
          </div>
        </div>
      </Modal>
    </>
  )
}