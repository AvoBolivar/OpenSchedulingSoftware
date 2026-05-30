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
        <svg
          className="cb-check-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="cb-label">{label}</span>
    </label>
  )
}