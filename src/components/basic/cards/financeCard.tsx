import { Card } from "../../ui/card"
import { cn } from "../../../lib/utils"

type FinanceColorScheme = "rose" | "deep" | "blush" | "plum" | "berry" | "coral"

const COLOR_SCHEME_CLASSES: Record<FinanceColorScheme, string> = {
  rose: "bg-chart-1/12 text-chart-1",
  deep: "bg-chart-2/12 text-chart-2",
  blush: "bg-chart-3/12 text-chart-3",
  plum: "bg-chart-4/12 text-chart-4",
  berry: "bg-chart-5/12 text-chart-5",
  coral: "bg-primary/12 text-primary",
}

interface FinanceCardProps {
  label: string
  amount: number
  icon: React.ReactNode
  colorScheme?: FinanceColorScheme
}

export default function FinanceCard({
  label,
  amount,
  icon,
  colorScheme = "rose",
}: FinanceCardProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return (
    <Card className="gap-3 p-4">
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          COLOR_SCHEME_CLASSES[colorScheme]
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-lg font-semibold">{formattedAmount}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </Card>
  )
}
