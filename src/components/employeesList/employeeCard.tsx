import { useState } from "react"
import { ChevronDown, Phone, FileText } from "lucide-react"
import DeleteEmployee from "./deleteEmployee"
import UpdateEmployee from "./updateEmployee"
import type { Employee } from "../../definitions/employee"
import { cn } from "../../lib/utils"

interface EmployeeCardProps {
  employee: Employee
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const [expanded, setExpanded] = useState(false)

  const noteCount = employee.notes?.length ?? 0

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] border border-border bg-card shadow-sm",
        !employee.active && "bg-muted/40 opacity-[0.72]"
      )}
    >
      {/* Always-visible summary — tap to expand */}
      <button
        type="button"
        className="flex min-h-[60px] w-full items-center justify-between gap-3 border-0 bg-transparent p-4 text-left transition-colors hover:bg-accent/40 active:bg-accent/60"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="m-0 truncate text-[17px] leading-tight font-bold text-foreground">{employee.name}</h3>
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase",
              employee.active && "bg-primary/10 text-primary"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-[0.85]" />
            {employee.active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <ChevronDown
            className={cn("text-primary transition-transform duration-200 motion-reduce:transition-none", expanded && "rotate-180")}
            width={18}
            height={18}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="animate-in fade-in border-t border-border px-4 pb-4 duration-200 motion-reduce:animate-none">
          <div className="flex flex-col gap-3 pt-3.5">
            <div className="flex items-start gap-2.5">
              <div className="shrink-0 pt-0.5 text-primary">
                <Phone width={14} height={14} aria-hidden="true" />
              </div>
              <div className="flex min-w-0 flex-col gap-px">
                <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Phone</span>
                <span className="text-sm break-words text-foreground">{employee.phoneNumber || "—"}</span>
              </div>
            </div>
          </div>

          {noteCount > 0 && (
            <div className="mt-3.5 border-t border-dashed border-border pt-3.5">
              <div className="mb-2 flex items-center gap-1.5 text-primary">
                <FileText width={12} height={12} aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                  Notes <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{noteCount}</span>
                </span>
              </div>
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                {employee.notes.map((note, i) => (
                  <li key={i} className="rounded-r-md border-l-2 border-primary bg-primary/5 py-1.5 pr-2.5 pl-3 text-[13px] leading-relaxed break-words text-foreground">{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex gap-2.5 [&>*]:flex-1">
            <UpdateEmployee employee={employee} />
            <DeleteEmployee employeeID={employee.id} />
          </div>
        </div>
      )}
    </div>
  )
}
