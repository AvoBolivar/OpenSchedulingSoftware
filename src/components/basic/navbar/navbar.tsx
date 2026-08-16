import { Briefcase, Calendar, ChartLine, Settings, Users } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"

export type PageId = "appointments" | "finance" | "clients" | "jobs" | "settings"

interface NavBarProps {
  current: PageId
  onChange: (page: PageId) => void
}

const NAV_ITEMS: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: "appointments", label: "Appointments", icon: <Calendar aria-hidden="true" width={16} height={16} /> },
  { id: "finance", label: "Finance", icon: <ChartLine aria-hidden="true" width={16} height={16} /> },
  { id: "clients", label: "Clients", icon: <Users aria-hidden="true" width={16} height={16} /> },
  { id: "jobs", label: "Jobs", icon: <Briefcase aria-hidden="true" width={16} height={16} /> },
  { id: "settings", label: "Settings", icon: <Settings aria-hidden="true" width={16} height={16} /> },
]

export default function NavBar({ current, onChange }: NavBarProps) {
  return (
    <Tabs value={current} onValueChange={(value) => onChange(value as PageId)}>
      <TabsList className="h-auto w-full gap-1 bg-transparent p-0">
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <TabsTrigger
            key={id}
            value={id}
            className="flex-col gap-0.5 rounded-lg py-1.5 text-xs data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none"
          >
            {icon}
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
