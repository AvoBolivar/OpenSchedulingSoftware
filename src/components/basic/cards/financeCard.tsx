import "./financeCard.css"

type FinanceColorScheme = "rose" | "deep" | "blush" | "plum"

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
  // Format amount as currency
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return (
    <div className={`finance-card finance-${colorScheme}`}>
      <div className="finance-card-top">
        <div className="finance-icon">{icon}</div>
      </div>
      <div className="finance-card-bottom">
        <span className="finance-amount">{formattedAmount}</span>
        <span className="finance-label">{label}</span>
      </div>
    </div>
  )
}