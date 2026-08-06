// Minimal ambient typing for the Google Identity Services script (loaded via
// <script> in index.html — see aiNotes/global.md's config section). Only the
// token-client subset actually used by googleDriveProvider.ts is declared.
export {}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string
            scope: string
            callback: (response: { access_token?: string; error?: string }) => void
            error_callback?: (error: { type: string }) => void
          }): {
            requestAccessToken(options?: { prompt?: string }): void
          }
          revoke(accessToken: string, callback?: () => void): void
        }
      }
    }
  }
}
