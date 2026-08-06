import { useState } from "react"
import { useAccountStore } from "../../../stores/useAccountStore"
import { useNotificationStore } from "../../../stores/useNotificationStore"
import { googleDriveProvider } from "../../../lib/backupProviders/googleDriveProvider"
import { buildBackupData } from "../../../lib/exportData"
import { applyBackupData } from "../../../lib/importData"
import { notify } from "../../../lib/notify"
import Button from "../../basic/button/button"
import Modal from "../../modal/modal"
import "./googleAccount.css"

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
      <div className="google-account">
        <Button
          label="Connect Google Drive"
          variant="secondary"
          onClick={handleConnect}
          disabled={isBusy}
        />
      </div>
    )
  }

  return (
    <div className="google-account">
      <div className="google-account__profile">
        {account.pictureUrl && (
          <img className="google-account__avatar" src={account.pictureUrl} alt="" aria-hidden="true" />
        )}
        <div>
          <div className="google-account__name">{account.name}</div>
          <div className="google-account__email">{account.email}</div>
        </div>
      </div>

      <Button label="Backup to Drive" variant="secondary" onClick={handleBackup} disabled={isBusy} />
      <Button
        label="Restore from Drive"
        variant="secondary"
        onClick={() => setIsRestoreModalOpen(true)}
        disabled={isBusy}
      />
      <Button label="Disconnect" variant="danger" onClick={handleDisconnect} disabled={isBusy} />

      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        title="Restore from Google Drive?"
      >
        <p>
          This replaces all clients, appointments, and payments on this device with the
          backup stored in your Google Drive. This can't be undone.
        </p>
        <div className="google-account__modal-actions">
          <Button label="Cancel" variant="secondary" onClick={() => setIsRestoreModalOpen(false)} />
          <Button label="Restore" variant="danger" onClick={handleRestore} />
        </div>
      </Modal>
    </div>
  )
}
