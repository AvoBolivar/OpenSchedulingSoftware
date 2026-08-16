import { useId } from "react"
import { Input as ShadcnInput } from "../../ui/input"
import { Label } from "../../ui/label"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../../ui/input-group"

interface InputProps {
  label: string
  placeholder: string
  type?: string
  inputMode?: "text" | "decimal" | "numeric" | "tel" | "email" | "url" | "search"
  value: string
  onChange: (value: string) => void
  onEnter?: () => void
  // A short leading glyph (e.g. "$") rendered inside the field — only needed
  // for prefixed values like currency, so it opts into `ui/input-group`.
  prefix?: string
}

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  inputMode,
  onEnter,
  prefix,
}: InputProps) {
  const id = useId()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault()
      onEnter()
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      {prefix ? (
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>{prefix}</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id={id}
            type={type}
            inputMode={inputMode}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </InputGroup>
      ) : (
        <ShadcnInput
          id={id}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  )
}
