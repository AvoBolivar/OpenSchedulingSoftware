import { useMemo } from "react"
import FinanceCard from "../components/basic/cards/financeCard"
import CollectionsList from "../components/collectionsList/collectionsList"
import { usePaymentStore } from "../stores/usePaymentStore"
import "./pages.css"

export default function FinancePage() {
  const payments = usePaymentStore((s) => s.payments)

  const totalWeek = useMemo(
    () => usePaymentStore.getState().getTotalMadeThisWeek(),
    [payments]
  )
  const totalMonth = useMemo(
    () => usePaymentStore.getState().getTotalMadeThisMonth(),
    [payments]
  )
  const totalOwed = useMemo(
    () => usePaymentStore.getState().getTotalOwed(),
    [payments]
  )
  const payout = useMemo(
    () => usePaymentStore.getState().getTotalNeededToPayOut(),
    [payments]
  )

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Finance</h1>
        <p className="page__subtitle">
          Track earnings, balances, and payouts
        </p>
      </header>

      <section className="section">
        <span className="section__label">Overview</span>
        <div className="finance-grid">
          <FinanceCard
            label="This Week"
            amount={totalWeek}
            colorScheme="rose"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            }
          />
          <FinanceCard
            label="This Month"
            amount={totalMonth}
            colorScheme="blush"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            }
          />
          <FinanceCard
            label="Total Owed"
            amount={totalOwed}
            colorScheme="deep"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            }
          />
          <FinanceCard
            label="Owed to Ines"
            amount={payout}
            colorScheme="plum"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 11l-3 3-2-2" />
              </svg>
            }
          />
        </div>
      </section>

      <section className="section">
        <span className="section__label">People Who Owe Money</span>
        <div className="panel">
          <CollectionsList />
        </div>
      </section>
    </div>
  )
}