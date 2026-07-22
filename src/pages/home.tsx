import { useState } from "react"
import type { PageId } from "../components/basic/navbar/navbar"
import NavBar from "../components/basic/navbar/navbar"
import AppointmentsPage from "./appointmentsPage"
import FinancePage from "./financePage"
import ClientsPage from "./clientsPage"

export default function Home() {
  const [page, setPage] = useState<PageId>("appointments")

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fdf2ea",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#450920",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          padding: "18px 16px",
          background: "rgba(253, 242, 234, 0.85)",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid rgba(255, 165, 171, 0.35)",
        }}
      >
        <NavBar current={page} onChange={setPage} />
      </header>

      <main style={{ padding: "4px 16px 40px" }}>
        {page === "appointments" && <AppointmentsPage />}
        {page === "finance" && <FinancePage />}
        {page === "clients" && <ClientsPage />}
      </main>
    </div>
  )
}