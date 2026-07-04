import "./input.css"

interface InputProps {
  label: string
  placeholder: string
  type?: string
  inputMode?: "text" | "decimal" | "numeric" | "tel" | "email" | "url" | "search"
  value: string
  onChange: (value: string) => void
  onEnter?: () => void
}

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  inputMode,
  onEnter,
}: InputProps) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
        className="input-field"
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            e.preventDefault()
            onEnter()
          }
        }}
      />
    </div>
  )
}