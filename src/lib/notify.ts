import type { AppError } from "./result"
import { useNotificationStore } from "../stores/useNotificationStore"

// The single entry point for surfacing an AppError as a toast.
// error.message is shown verbatim — it must already be user-safe (see errorHandling.md §0).
export function notify(error: AppError): void {
  useNotificationStore.getState().push(error.message)
}
