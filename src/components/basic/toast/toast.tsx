import { useEffect } from "react"
import { X } from "lucide-react"
import { useNotificationStore } from "../../../stores/useNotificationStore"

const AUTO_DISMISS_MS = 5000

export default function Toast() {
  const notifications = useNotificationStore((s) => s.notifications)
  const dismiss = useNotificationStore((s) => s.dismiss)

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2"
      role="status"
      aria-live="polite"
    >
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
    <div className="bg-foreground text-background pointer-events-auto flex items-center justify-between gap-3 rounded-lg px-3.5 py-3 shadow-lg">
      <span className="text-sm leading-snug">{message}</span>
      <button
        type="button"
        className="hover:bg-background/10 flex min-h-8 min-w-8 items-center justify-center rounded-md"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss"
      >
        <X width={16} height={16} aria-hidden="true" />
      </button>
    </div>
  )
}
