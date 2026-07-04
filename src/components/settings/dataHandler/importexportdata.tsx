import { exportData } from "../../../lib/exportData";
import { importData } from "../../../lib/importData";


import React from 'react'

const ImportData = () => {
  return (
    <div>
      <button onClick={exportData}>Export</button>

      <input
        type="file"
        accept="application/json"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          try {
            await importData(file)
            alert('Imported successfully — reload the page.')
          } catch (err) {
            alert(`Import failed: ${(err as Error).message}`)
          }
        }}
      />
    </div>
  )
}

export default ImportData