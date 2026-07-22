import { useMemo } from "react"
import { ChartLine, Calendar, Clock, UserCheck, CreditCard, Wallet } from "lucide-react"
import FinanceCard from "../components/basic/cards/financeCard"
import CollectionsList from "../components/collectionsList/collectionsList"
import ReadPaymentHistory from "../components/collectionsList/readPaymentHistory"
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
  const totalCollected = useMemo(
    () => usePaymentStore.getState().getTotalCollected(),
    [payments]
  )
  const netAfterPayouts = useMemo(
    () => usePaymentStore.getState().getTotalNetAfterPayouts(),
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
              <ChartLine />
            }
          />
          <FinanceCard
            label="This Month"
            amount={totalMonth}
            colorScheme="blush"
            icon={
              <Calendar />
            }
          />
          <FinanceCard
            label="Total Owed"
            amount={totalOwed}
            colorScheme="deep"
            icon={
              <Clock />
            }
          />
          <FinanceCard
            label="Owed to Ines"
            amount={payout}
            colorScheme="plum"
            icon={
              <UserCheck />
            }
          />
          <FinanceCard
            label="Total Collected"
            amount={totalCollected}
            colorScheme="berry"
            icon={
              <CreditCard />
            }
          />
          <FinanceCard
            label="Net After Payouts"
            amount={netAfterPayouts}
            colorScheme="coral"
            icon={
              <Wallet />
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

      <section className="section">
        <span className="section__label">Payment History</span>
        <div className="panel">
          <ReadPaymentHistory />
        </div>
      </section>
    </div>
  )
}