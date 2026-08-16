import { useId } from "react"
import { Switch as ShadcnSwitch } from "../../ui/switch"
import { Label } from "../../ui/label"

interface SwitchProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function Switch({ label, description, checked, onChange, disabled = false }: SwitchProps) {
  const id = useId()

  return (
    <div className="flex items-center justify-between gap-3 rounded-[10px] border border-border bg-card px-3.5 py-3 transition-colors hover:border-primary/40">
      <div className="flex min-w-0 flex-col gap-0.5">
        <Label htmlFor={id} className="text-sm font-semibold text-foreground">{label}</Label>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
      <ShadcnSwitch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )
}
