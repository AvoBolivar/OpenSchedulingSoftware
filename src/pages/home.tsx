import { useState } from "react"
import type { PageId } from "../components/basic/navbar/navbar"
import NavBar from "../components/basic/navbar/navbar"
import ThemeToggle from "../components/basic/themeToggle/themeToggle"
import AppointmentsPage from "./appointmentsPage"
import FinancePage from "./financePage"
import ClientsPage from "./clientsPage"
import JobsPage from "./jobsPage"
import SettingsPage from "./settingsPage"

export default function Home() {
  const [page, setPage] = useState<PageId>("appointments")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur-sm">
        <NavBar current={page} onChange={setPage} />
        <ThemeToggle />
      </header>

      <main className="px-4 pt-1 pb-10">
        {page === "appointments" && <AppointmentsPage />}
        {page === "finance" && <FinancePage />}
        {page === "clients" && <ClientsPage />}
        {page === "jobs" && <JobsPage />}
        {page === "settings" && <SettingsPage />}
      </main>
    </div>
  )
}
