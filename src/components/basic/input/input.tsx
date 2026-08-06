import { useId } from "react"
import { Input as ShadcnInput } from "../../ui/input"
import { Label } from "../../ui/label"

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
  const id = useId()

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <ShadcnInput
        id={id}
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
