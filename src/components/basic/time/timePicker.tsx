import { useId, useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"

interface TimePickerProps {
  label: string
  value: string // "HH:MM AM/PM" format, e.g. "9:30 AM"
  onChange: (value: string) => void
}

function parseTime(str: string) {
  const match = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return { hour: 9, minute: 0, period: "AM" as "AM" | "PM" }
  return {
    hour: parseInt(match[1], 10),
    minute: parseInt(match[2], 10),
    period: match[3].toUpperCase() as "AM" | "PM",
  }
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1) // 1-12
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5) // 0, 5, ..., 55

export default function TimePicker({ label, value, onChange }: TimePickerProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const { hour, minute, period } = parseTime(value)

  const updateTime = (h: number, m: number, p: "AM" | "PM") => {
    onChange(`${h}:${m.toString().padStart(2, "0")} ${p}`)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id={id} type="button" variant="outline" className="justify-start font-normal">
            <Clock width={16} height={16} aria-hidden="true" />
            {hour}:{minute.toString().padStart(2, "0")} {period}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Hour</span>
              <Select value={String(hour)} onValueChange={(v) => updateTime(Number(v), minute, period)}>
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Min</span>
              <Select
                value={String(minute)}
                onValueChange={(v) => updateTime(hour, Number(v), period)}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MINUTES.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Period</span>
              <Select
                value={period}
                onValueChange={(v) => updateTime(hour, minute, v as "AM" | "PM")}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const now = new Date()
                let h = now.getHours()
                const m = Math.round(now.getMinutes() / 5) * 5
                const p: "AM" | "PM" = h >= 12 ? "PM" : "AM"
                h = h % 12 || 12
                updateTime(h, m === 60 ? 0 : m, p)
              }}
            >
              Now
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
