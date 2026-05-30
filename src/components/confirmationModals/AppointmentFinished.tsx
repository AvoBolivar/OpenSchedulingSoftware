import Checkbox from "../basic/checkbox/checkbox";
import "./AppointmentFinished.css"

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
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      key: "jobPaid",
      label: "Payment received",
      description: "Client has paid for the job",
      checked: jobPaid,
      onChange: setJobPaid,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      ),
    },
    {
      key: "helperPaid",
      label: "Ines paid",
      description: "Helper has been compensated",
      checked: helperPaid,
      onChange: setHelperPaid,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 11l-3 3-2-2" />
        </svg>
      ),
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: 4 }}>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
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