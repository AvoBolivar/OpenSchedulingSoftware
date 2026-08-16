import { useState } from "react"
import { useAccountStore } from "../../../stores/useAccountStore"
import { useNotificationStore } from "../../../stores/useNotificationStore"
import { googleDriveProvider } from "../../../lib/backupProviders/googleDriveProvider"
import { buildBackupData } from "../../../lib/exportData"
import { applyBackupData } from "../../../lib/importData"
import { notify } from "../../../lib/notify"
import Button from "../../basic/button/button"
import Modal from "../../modal/modal"

export default function GoogleAccount() {
  const account = useAccountStore((s) => s.account)
  const [isBusy, setIsBusy] = useState(false)
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)

  async function handleConnect() {
    setIsBusy(true)
    const result = await googleDriveProvider.connect()
    setIsBusy(false)

    if (!result.ok) {
      console.error(result.error.cause ?? result.error)
      notify(result.error)
      return
    }
    useNotificationStore.getState().push(`Connected as ${result.value.email}.`)
  }

  function handleDisconnect() {
    googleDriveProvider.disconnect()
    useNotificationStore.getState().push("Disconnected from Google Drive.")
  }

  async function handleBackup() {
    setIsBusy(true)
    const result = await googleDriveProvider.backup(buildBackupData())
    setIsBusy(false)

    if (!result.ok) {
      console.error(result.error.cause ?? result.error)
      notify(result.error)
      return
    }
    useNotificationStore.getState().push("Backed up to Google Drive.")
  }

  async function handleRestore() {
    setIsRestoreModalOpen(false)
    setIsBusy(true)
    const result = await googleDriveProvider.restore()
    setIsBusy(false)

    if (!result.ok) {
      console.error(result.error.cause ?? result.error)
      notify(result.error)
      return
    }
    applyBackupData(result.value)
    useNotificationStore.getState().push("Restored from Google Drive.")
  }

  if (!account) {
    return (
      <Button
        label="Connect Google Drive"
        variant="secondary"
        onClick={handleConnect}
        disabled={isBusy}
        className="w-full"
      />
    )
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="border-border bg-muted/50 flex items-center gap-3 rounded-lg border p-3">
        {account.pictureUrl && (
          <img
            className="size-10 shrink-0 rounded-full"
            src={account.pictureUrl}
            alt=""
            aria-hidden="true"
          />
        )}
        <div>
          <div className="text-foreground font-semibold">{account.name}</div>
          <div className="text-muted-foreground text-sm">{account.email}</div>
        </div>
      </div>

      <Button
        label="Backup to Drive"
        variant="secondary"
        onClick={handleBackup}
        disabled={isBusy}
        className="w-full"
      />
      <Button
        label="Restore from Drive"
        variant="secondary"
        onClick={() => setIsRestoreModalOpen(true)}
        disabled={isBusy}
        className="w-full"
      />
      <Button
        label="Disconnect"
        variant="danger"
        onClick={handleDisconnect}
        disabled={isBusy}
        className="w-full"
      />

      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        title="Restore from Google Drive?"
      >
        <p>
          This replaces all clients, appointments, and payments on this device with the
          backup stored in your Google Drive. This can't be undone.
        </p>
        <div className="mt-4 flex gap-3">
          <Button
            label="Cancel"
            variant="secondary"
            onClick={() => setIsRestoreModalOpen(false)}
            className="flex-1"
          />
          <Button label="Restore" variant="danger" onClick={handleRestore} className="flex-1" />
        </div>
      </Modal>
    </div>
  )
}
