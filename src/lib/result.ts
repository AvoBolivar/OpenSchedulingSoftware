export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E }

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value })
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error })

// The shared error shape. `kind` is for code to branch on;
// `message` is for humans and must be safe to show in the UI.
export interface AppError {
  kind: AppErrorKind
  message: string
  cause?: unknown // original thrown value, for console logging only — never shown to user
}

export type AppErrorKind =
  | "validation" // data failed a check at a trust boundary
  | "not_found"  // an entity ID (or remote resource) that doesn't resolve
  | "conflict"   // operation invalid given current state (e.g. delete blocked by references)
  | "storage"    // localStorage / persistence / remote backup IO failure
  | "parse"      // malformed JSON or file content
  | "auth"       // OAuth sign-in/connection failure (denied, expired, misconfigured)
  | "unknown"    // caught something unexpected at a try/catch boundary
