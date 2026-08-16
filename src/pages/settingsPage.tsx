import Button from "../components/basic/button/button"
import GoogleAccount from "../components/settings/googleAccount/googleAccount"
import ImportExportData from "../components/settings/importExportData/importExportData"
import "./pages.css"

export default function SettingsPage() {
  const deleteData = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Settings</h1>
        <p className="page__subtitle">Manage your account and backups</p>
      </header>

      <section className="section">
        <span className="section__label">Google Drive</span>
        <div className="panel">
          <GoogleAccount />
        </div>
      </section>

      <section className="section">
        <span className="section__label">Local Backup</span>
        <div className="panel">
          <ImportExportData />
        </div>
      </section>

      <section className="section">
        <div className="button-section">
          <Button label="Delete Data" onClick={deleteData} />
        </div>
      </section>
    </div>
  )
}
