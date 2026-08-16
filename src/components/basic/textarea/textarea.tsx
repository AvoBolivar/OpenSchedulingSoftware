import { useId } from "react"
import { Textarea as ShadcnTextarea } from "../../ui/textarea"
import { Label } from "../../ui/label"

interface TextareaProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export default function Textarea({ label, placeholder, value, onChange }: TextareaProps) {
  const id = useId()

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <ShadcnTextarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
