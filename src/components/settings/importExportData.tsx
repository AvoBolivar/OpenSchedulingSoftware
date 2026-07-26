import { useRef } from "react";
import { exportData } from "../../lib/exportData";
import { importData } from "../../lib/importData";
import Button from "../basic/button/button";
import "./importExportData.css";

const ImportExportData = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importData(file)
      alert('Imported successfully — reload the page.')
    } catch (err) {
      alert(`Import failed: ${(err as Error).message}`)
    } finally {
      e.target.value = ""
    }
  }

  return (
    <div className="import-export-row">
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
        className="import-export-file-input"
        aria-label="Import backup file"
      />
    </div>
  )
}

export default ImportExportData
