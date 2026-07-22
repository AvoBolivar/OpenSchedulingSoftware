import { useMemo, useState } from "react";
import type { Payment } from "../../definitions/payments";
import { usePaymentStore } from "../../stores/usePaymentStore";
import PaymentHistoryCard from "../basic/cards/paymentHistoryCard";
import UpdateCollection from "./updateCollection";

export default function ReadPaymentHistory() {
  const payments = usePaymentStore((s) => s.payments);
  const receivedPayments = useMemo(
    () => usePaymentStore.getState().getReceivedPayments(),
    [payments]
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  function handleEditPaymentModal(payment: Payment) {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  }

  if (receivedPayments.length === 0) {
    return <p>No payments received yet</p>;
  }

  return (
    <>
      {receivedPayments.map(({ client, payment }) => (
        <PaymentHistoryCard
          key={payment.id}
          client={client}
          payment={payment}
          onClick={() => handleEditPaymentModal(payment)}
        />
      ))}

      {selectedPayment && (
        <UpdateCollection
          key={selectedPayment.id}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          payment={selectedPayment}
        />
      )}
    </>
  );
}
