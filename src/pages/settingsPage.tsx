import Button from "../components/basic/button/button"
import GoogleAccount from "../components/settings/googleAccount/googleAccount"
import ImportExportData from "../components/settings/importExportData/importExportData"
import ManageCategories from "../components/settings/manageCategories/manageCategories"

export default function SettingsPage() {
  const deleteData = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="mx-auto w-full max-w-[920px] px-4 pt-5 pb-[calc(44px+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] text-foreground sm:px-5 sm:pt-7 sm:pb-14">
      <header className="mb-2">
        <h1 className="m-0 text-[22px] leading-tight font-bold text-primary sm:text-2xl">Settings</h1>
        <p className="mt-1 mb-0 text-sm text-muted-foreground">Manage your account and backups</p>
      </header>

      <section className="mt-6 sm:mt-7">
        <span className="mb-2.5 block text-xs font-bold tracking-wider text-primary uppercase">Google Drive</span>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <GoogleAccount />
        </div>
      </section>

      <section className="mt-6 sm:mt-7">
        <span className="mb-2.5 block text-xs font-bold tracking-wider text-primary uppercase">Local Backup</span>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <ImportExportData />
        </div>
      </section>

      <section className="mt-6 sm:mt-7">
        <span className="mb-2.5 block text-xs font-bold tracking-wider text-primary uppercase">Categories</span>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <ManageCategories />
        </div>
      </section>

      <section className="mt-6 sm:mt-7">
        <div className="flex flex-col gap-3 [&_button]:min-h-12 sm:flex-row sm:[&>*]:w-auto [&>*]:w-full">
          <Button label="Delete Data" onClick={deleteData} />
        </div>
      </section>
    </div>
  )
}
