import "./button.css"

type ButtonVariant = "primary" | "secondary" | "danger"

interface ButtonProps {
  label: string
  onClick: () => void
  variant?: ButtonVariant
  icon?: React.ReactNode
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export default function Button({
  label,
  onClick,
  variant = "primary",
  icon,
  disabled = false,
  type = "button",
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {label}
    </button>
  )
}