import { useRef } from "react";
import { exportData } from "../../../lib/exportData";
import { importData } from "../../../lib/importData";
import { notify } from "../../../lib/notify";
import { useNotificationStore } from "../../../stores/useNotificationStore";
import Button from "../../basic/button/button";

const ImportExportData = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await importData(file)
    e.target.value = ""

    if (!result.ok) {
      console.error(result.error.cause ?? result.error)
      notify(result.error)
      return
    }

    useNotificationStore.getState().push("Imported successfully.")
  }

  return (
    <div className="flex w-full flex-col gap-3 [&>button]:w-full">
      <Button label="Export Backup" variant="secondary" onClick={exportData} />
      <Button
        label="Import Backup"
        variant="secondary"
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Import backup file"
      />
    </div>
  )
}

export default ImportExportData
