import { Clock, MapPin, Phone, ChevronRight, CheckCircle2 } from "lucide-react"
import type { Appointment } from "../../../definitions/appointments"
import { useClientStore } from "../../../stores/useClientStore"
import { fromDateKey } from "../../../lib/date"
import { Card } from "../../ui/card"
import { cn } from "../../../lib/utils"

interface AppointmentCardProps {
  appointment: Appointment
  onClick: () => void
}

export default function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const getClient = useClientStore((s) => s.getClient)
  const client = getClient(appointment.clientID)

  if (!client) {
    return (
      <Card className="flex-row items-center gap-3 p-3">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-muted" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
        </div>
      </Card>
    )
  }

  const dateObj = fromDateKey(appointment.date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString("en-US", { month: "short" })
  const weekday = dateObj.toLocaleString("en-US", { weekday: "short" })

  const initials = client.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const formattedCharge =
    typeof appointment.charge === "number"
      ? `$${appointment.charge.toFixed(2)}`
      : appointment.charge

  const isCompleted = !appointment.show

  return (
    <Card
      className={cn(
        "flex-row items-start gap-3 p-3",
        isCompleted && "opacity-60"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-muted py-1.5 text-muted-foreground">
        <span className="text-[10px] uppercase">{weekday}</span>
        <span className="text-lg leading-none font-semibold text-foreground">{day}</span>
        <span className="text-[10px] uppercase">{month}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium">{client.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{formattedCharge}</span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  <CheckCircle2 width={12} height={12} aria-hidden="true" />
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock width={14} height={14} aria-hidden="true" />
            <span className="truncate">
              {appointment.startTime} – {appointment.endTime}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin width={14} height={14} aria-hidden="true" />
            <span className="truncate">{client.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone width={14} height={14} aria-hidden="true" />
            <span className="truncate">{client.phoneNumber}</span>
          </div>
        </div>
      </div>

      <ChevronRight className="mt-1 shrink-0 text-muted-foreground" width={18} height={18} aria-hidden="true" />
    </Card>
  )
}
