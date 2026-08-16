import { useState } from "react"
import { useJobStore } from "../../stores/useJobStore"
import { useClientStore } from "../../stores/useClientStore"
import type { Job } from "../../definitions/job"
import type { Client } from "../../definitions/client"
import { cn } from "../../lib/utils"
import Button from "../basic/button/button"
import Input from "../basic/input/input"
import Autocomplete from "../basic/autocomplete/autocomplete"
import Textarea from "../basic/textarea/textarea"
import Modal from "../modal/modal"

interface UpdateJobProps {
  job: Job
}

const STATUS_OPTIONS: { value: Job["status"]; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
]

export default function UpdateJob({ job }: UpdateJobProps) {
  const updateJob = useJobStore((s) => s.updateJob)
  const clients = useClientStore((s) => s.clients)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState(job.name)
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    clients.find((c) => c.id === job.clientID) ?? null
  )
  const [description, setDescription] = useState(job.description)
  const [status, setStatus] = useState<Job["status"]>(job.status)

  function handleOpen() {
    // Re-sync state from the latest job prop in case it changed
    setName(job.name)
    setSelectedClient(clients.find((c) => c.id === job.clientID) ?? null)
    setDescription(job.description)
    setStatus(job.status)
    setIsModalOpen(true)
  }

  function updateJobInfo() {
    if (!name.trim() || !selectedClient) return

    updateJob(job.id, {
      name,
      clientID: selectedClient.id,
      description,
      status,
    })
    setIsModalOpen(false)
  }

  return (
    <>
      <Button label="edit" onClick={handleOpen} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Job">
        <div className="flex flex-col gap-[18px] text-foreground">
          <div className="flex flex-col gap-2.5">
            <Input label="Name" placeholder="Kitchen remodel" value={name} onChange={setName} />
            <Autocomplete<Client>
              label="Client"
              placeholder="Search Clients"
              items={clients}
              itemToString={(client) => client?.name ?? ""}
              selectedItem={selectedClient}
              onSelectedItemChange={setSelectedClient}
            />
            <Textarea
              label="Description"
              placeholder="What's this job about?"
              value={description}
              onChange={setDescription}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Status</span>
            <div className="flex gap-1 rounded-[10px] bg-primary/10 p-1">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    "min-h-10 min-w-0 flex-1 rounded-[7px] border-0 bg-transparent px-1.5 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary/20",
                    status === value && "bg-primary text-primary-foreground hover:bg-primary"
                  )}
                  onClick={() => setStatus(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-1 flex flex-col border-t border-border pt-3 [&>*]:flex-1">
            <Button label="Save" onClick={updateJobInfo} disabled={!name.trim() || !selectedClient} />
          </div>
        </div>
      </Modal>
    </>
  )
}
