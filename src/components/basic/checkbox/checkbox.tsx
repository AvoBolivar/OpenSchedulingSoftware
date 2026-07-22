import { Check } from "lucide-react"
import "./checkbox.css"

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function Checkbox({ label, checked, onChange, disabled = false }: CheckboxProps) {
  return (
    <label className={`cb-wrapper ${disabled ? "disabled" : ""}`}>
      <input
        type="checkbox"
        className="cb-native"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className={`cb-box ${checked ? "checked" : ""}`}>
        <Check className="cb-check-icon" width={14} height={14} strokeWidth={3.5} aria-hidden="true" />
      </span>
      <span className="cb-label">{label}</span>
    </label>
  )
}