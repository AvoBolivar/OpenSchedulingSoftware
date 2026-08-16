import { SquareCheckBig, CreditCard, UserCheck, Check } from "lucide-react";
import Checkbox from "../basic/checkbox/checkbox";
import { cn } from "../../lib/utils";

interface AppointmentFinishedProps {
  jobFinished: boolean
  setJobFinished: (jobFinished: boolean) => void
  jobPaid: boolean
  setJobPaid: (jobPaid: boolean) => void
  helperPaid: boolean
  setHelperPaid: (helperPaid: boolean) => void
}

export default function AppointmentFinished({
  jobFinished,
  setJobFinished,
  jobPaid,
  setJobPaid,
  helperPaid,
  setHelperPaid,
}: AppointmentFinishedProps) {
  const items = [
    {
      key: "jobFinished",
      label: "Job completed",
      description: "Mark when the work is done",
      checked: jobFinished,
      onChange: setJobFinished,
      icon: <SquareCheckBig width={18} height={18} />,
    },
    {
      key: "jobPaid",
      label: "Payment received",
      description: "Client has paid for the job",
      checked: jobPaid,
      onChange: setJobPaid,
      icon: <CreditCard width={18} height={18} />,
    },
    {
      key: "helperPaid",
      label: "Ines paid",
      description: "Helper has been compensated",
      checked: helperPaid,
      onChange: setHelperPaid,
      icon: <UserCheck width={18} height={18} />,
    },
  ]

  const completedCount = items.filter((i) => i.checked).length
  const totalCount = items.length
  const progress = (completedCount / totalCount) * 100
  const allDone = completedCount === totalCount

  return (
    <div className={cn("p-5 transition-all duration-300", allDone && "rounded-xl border border-primary/40 shadow-lg")}>
      {/* Header with progress */}
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-dashed border-border pb-4">
        <div className="min-w-0 flex-1">
          <h3 className="m-0 mb-1 text-base font-bold text-foreground">Completion checklist</h3>
          <p className={cn("m-0 flex items-center gap-1 text-[13px] font-medium text-primary", allDone && "font-bold")}>
            {allDone ? (
              <>
                <Check width={14} height={14} strokeWidth={3} aria-hidden="true" />
                All tasks complete
              </>
            ) : (
              `${completedCount} of ${totalCount} complete`
            )}
          </p>
        </div>
        <div className="relative h-11 w-11 shrink-0">
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              className="stroke-border"
              strokeWidth="4"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              className="stroke-primary transition-all duration-500 ease-in-out"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
              transform="rotate(-90 22 22)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tracking-wide text-primary">{completedCount}/{totalCount}</span>
        </div>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.key}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-[10px] border border-transparent bg-primary/5 px-3.5 py-3 transition-colors active:scale-[0.99] hover:border-primary/20 hover:bg-primary/10",
              item.checked && "border-primary/30 bg-primary/10"
            )}
            onClick={() => item.onChange(!item.checked)}
          >
            <div className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors",
              item.checked && "border-primary bg-primary text-primary-foreground"
            )}>{item.icon}</div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className={cn(
                "text-sm font-semibold text-foreground transition-colors",
                item.checked && "text-muted-foreground line-through decoration-primary/40 decoration-[1.5px]"
              )}>{item.label}</span>
              <span className={cn("text-xs leading-tight text-muted-foreground", item.checked && "text-muted-foreground/60")}>{item.description}</span>
            </div>
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                label=""
                checked={item.checked}
                onChange={item.onChange}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}