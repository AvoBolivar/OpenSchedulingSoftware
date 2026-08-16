import { Button as ShadcnButton } from "../../ui/button"

type ButtonVariant = "primary" | "secondary" | "danger"

const VARIANT_MAP: Record<ButtonVariant, "default" | "secondary" | "destructive"> = {
  primary: "default",
  secondary: "secondary",
  danger: "destructive",
}

interface ButtonProps {
  label: string
  onClick: () => void
  variant?: ButtonVariant
  icon?: React.ReactNode
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  className?: string
}

export default function Button({
  label,
  onClick,
  variant = "primary",
  icon,
  disabled = false,
  type = "button",
  className,
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={VARIANT_MAP[variant]}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {icon}
      {label}
    </ShadcnButton>
  )
}
