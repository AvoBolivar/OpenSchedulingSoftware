import { useId } from "react"
import { Checkbox as ShadcnCheckbox } from "../../ui/checkbox"
import { Label } from "../../ui/label"

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function Checkbox({ label, checked, onChange, disabled = false }: CheckboxProps) {
  const id = useId()

  return (
    <div className="flex items-center gap-2">
      <ShadcnCheckbox
        id={id}
        checked={checked}
        onCheckedChange={(state) => onChange(state === true)}
        disabled={disabled}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}
