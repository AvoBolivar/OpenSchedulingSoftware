import { useState } from "react";
import type { Payment } from "../../definitions/payments";
import { useClientStore } from "../../stores/useClientStore";
import { useAppointmentStore } from "../../stores/useAppointmentStore";
import { usePaymentStore } from "../../stores/usePaymentStore";
import CollectionCard from "../basic/cards/collectionCard";
import PayoutCard from "../basic/cards/payoutCard";
import UpdateCollection from "./updateCollection";
import PayHelperModal from "../confirmationModals/payHelper";

interface ReadCollectionsProps {
  type: string;
}

export default function ReadCollections({ type }: ReadCollectionsProps) {
  const getApt = useAppointmentStore((s) => s.getAppointment);
  const getClt = useClientStore((s) => s.getClient);
  const payments = usePaymentStore((s) => s.payments);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  function handleEditCollectionModal(payment: Payment) {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  }

  const isPayout = type === "PayOut";

  // Pick the relevant set of payments based on the view type:
  //  - collections: money still owed *by* clients (paymentReceived === false)
  //  - payouts:     money still owed *to* employees (expensesPaid === false)
  const visiblePayments = isPayout
    ? payments.filter((p) => !p.expensesPaid)
    : payments.filter((p) => !p.paymentReceived);

  if (visiblePayments.length === 0) {
    return isPayout ? (
      <p>All payouts have been made.</p>
    ) : (
      <p>All payments have been received.</p>
    );
  }

  return (
    <>
      <h2>{isPayout ? "Outstanding Payouts" : "Outstanding Collections"}</h2>

      {visiblePayments.map((payment) => {
        const appointment = getApt(payment.appointmentID);
        if (!appointment) return null;

        const client = getClt(appointment.clientID);
        if (!client) return null;

        return (
          <div key={payment.id}>
            {isPayout ? (
              <PayoutCard
                client={client}
                appointment={appointment}
                onClick={() => handleEditCollectionModal(payment)}
              />
            ) : (
              <CollectionCard
                client={client}
                appointment={appointment}
                onClick={() => handleEditCollectionModal(payment)}
              />
            )}
          </div>
        );
      })}

      {selectedPayment &&
        (isPayout ? (
          <PayHelperModal
            key={selectedPayment.id}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            payment={selectedPayment}
          />
        ) : (
          <UpdateCollection
            key={selectedPayment.id}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            payment={selectedPayment}
          />
        ))}
    </>
  );
}