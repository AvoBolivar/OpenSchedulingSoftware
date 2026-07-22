import { SquareCheckBig, CreditCard, UserCheck, Check } from "lucide-react";
import Checkbox from "../basic/checkbox/checkbox";
import "./appointmentFinished.css"

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
    <div className={`af-card ${allDone ? "complete" : ""}`}>
      {/* Header with progress */}
      <div className="af-header">
        <div className="af-header-text">
          <h3 className="af-title">Completion checklist</h3>
          <p className="af-subtitle">
            {allDone ? (
              <>
                <Check width={14} height={14} strokeWidth={3} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                All tasks complete
              </>
            ) : (
              `${completedCount} of ${totalCount} complete`
            )}
          </p>
        </div>
        <div className="af-progress-ring">
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#ffa5ab40"
              strokeWidth="4"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke={allDone ? "#a53860" : "#da627d"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
              transform="rotate(-90 22 22)"
              style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.3s ease" }}
            />
          </svg>
          <span className="af-progress-text">{completedCount}/{totalCount}</span>
        </div>
      </div>

      {/* Task list */}
      <div className="af-task-list">
        {items.map((item) => (
          <div
            key={item.key}
            className={`af-task ${item.checked ? "checked" : ""}`}
            onClick={() => item.onChange(!item.checked)}
          >
            <div className="af-task-icon">{item.icon}</div>
            <div className="af-task-content">
              <span className="af-task-label">{item.label}</span>
              <span className="af-task-description">{item.description}</span>
            </div>
            <div className="af-task-checkbox" onClick={(e) => e.stopPropagation()}>
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