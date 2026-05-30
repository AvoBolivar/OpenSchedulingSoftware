import "./navbar.css"

export type PageId = "appointments" | "finance" | "clients"

interface NavBarProps {
  current: PageId
  onChange: (page: PageId) => void
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: "appointments", label: "Appointments" },
  { id: "finance", label: "Finance" },
  { id: "clients", label: "Clients" },
]

export default function NavBar({ current, onChange }: NavBarProps) {
  return (
    <nav className="navbar">
      {NAV_ITEMS.map(({ id, label }) => {
        const isActive = current === id
        return (
          <button
            key={id}
            type="button"
            className={
              "navbar__tab" + (isActive ? " navbar__tab--active" : "")
            }
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}