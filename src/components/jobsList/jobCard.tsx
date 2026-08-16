import { useClientStore } from "../../stores/useClientStore"
import { useJobStore } from "../../stores/useJobStore"
import type { Job } from "../../definitions/job"
import { cn } from "../../lib/utils"

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const client = useClientStore((s) => s.clients.find((c) => c.id === job.clientID))
  const setSelectedJobID = useJobStore((s) => s.setSelectedJobID)

  return (
    <button
      type="button"
      className="flex min-h-[60px] w-full items-center justify-between gap-3 rounded-[14px] border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent/40 active:bg-accent/60"
      onClick={() => setSelectedJobID(job.id)}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="m-0 truncate text-[17px] leading-tight font-bold text-foreground">{job.name}</h3>
        <span className="truncate text-sm text-muted-foreground">{client?.name ?? "Unknown client"}</span>
      </div>
      <span
        className={cn(
          "inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase",
          job.status === "active" && "bg-primary/10 text-primary"
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-[0.85]" />
        {job.status === "active" ? "Active" : "Completed"}
      </span>
    </button>
  )
}
