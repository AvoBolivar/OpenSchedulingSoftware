import { ChevronLeft, FileText, User } from "lucide-react"
import { useJobStore } from "../../stores/useJobStore"
import { useClientStore } from "../../stores/useClientStore"
import UpdateJob from "./updateJob"
import DeleteJob from "./deleteJob"
import { cn } from "../../lib/utils"

interface JobDetailProps {
  jobID: string
}

export default function JobDetail({ jobID }: JobDetailProps) {
  const job = useJobStore((s) => s.jobs.find((j) => j.id === jobID))
  const setSelectedJobID = useJobStore((s) => s.setSelectedJobID)
  const client = useClientStore((s) => s.clients.find((c) => c.id === job?.clientID))

  // deleteJob clears a matching selectedJobID in the same store update, so
  // this only guards the brief re-render between that state change and
  // jobsList swapping back to the list view.
  if (!job) return null

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        className="flex w-fit items-center gap-1 rounded-lg border-0 bg-transparent p-0 text-sm font-semibold text-primary transition-colors hover:underline"
        onClick={() => setSelectedJobID(null)}
      >
        <ChevronLeft width={16} height={16} aria-hidden="true" />
        Back to Jobs
      </button>

      <div className="flex items-start justify-between gap-3">
        <h2 className="m-0 text-xl leading-tight font-bold text-foreground">{job.name}</h2>
        <span
          className={cn(
            "inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase",
            job.status === "active" && "bg-primary/10 text-primary"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-[0.85]" />
          {job.status === "active" ? "Active" : "Completed"}
        </span>
      </div>

      <div className="flex items-start gap-2.5">
        <div className="shrink-0 pt-0.5 text-primary">
          <User width={14} height={14} aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-col gap-px">
          <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Client</span>
          <span className="text-sm break-words text-foreground">{client?.name ?? "Unknown client"}</span>
        </div>
      </div>

      {job.description && (
        <div className="flex items-start gap-2.5">
          <div className="shrink-0 pt-0.5 text-primary">
            <FileText width={14} height={14} aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-col gap-px">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Description</span>
            <span className="text-sm break-words text-foreground">{job.description}</span>
          </div>
        </div>
      )}

      <div className="mt-2 flex gap-2.5 border-t border-border pt-4 [&>*]:flex-1">
        <UpdateJob job={job} />
        <DeleteJob jobID={job.id} />
      </div>
    </div>
  )
}
