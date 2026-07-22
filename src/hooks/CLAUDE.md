# src/hooks

Custom React hooks shared across the app.

## Files

- **useLocalStorage.ts** — Generic `useLocalStorage<T>(key, defaultValue)` hook. Wraps `useState` + `useEffect` to persist a value to `localStorage` under `key`, JSON-serialized, syncing on every change. Acts as the app's lightweight data store.
- **useClient.ts** — `useClient(clientID)` hook. Reads the `"clients"` array out of `localStorage` (via `useLocalStorage`) and returns the `Client` matching `clientID`.
