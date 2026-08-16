import { useRef } from "react";
import { exportData } from "../../lib/exportData";
import { importData } from "../../lib/importData";
import Button from "../basic/button/button";

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
