import { useEffect } from "react"
import { X } from "lucide-react"
import { useNotificationStore } from "../../../stores/useNotificationStore"
import "./toast.css"

const AUTO_DISMISS_MS = 5000

export default function Toast() {
  const notifications = useNotificationStore((s) => s.notifications)
  const dismiss = useNotificationStore((s) => s.dismiss)

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {notifications.map((n) => (
        <ToastItem key={n.id} id={n.id} message={n.message} onDismiss={dismiss} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  id: string
  message: string
  onDismiss: (id: string) => void
}

function ToastItem({ id, message, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [id, onDismiss])

  return (
    <div className="toast">
      <span className="toast__message">{message}</span>
      <button
        type="button"
        className="toast__dismiss"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss"
      >
        <X width={16} height={16} aria-hidden="true" />
      </button>
    </div>
  )
}
