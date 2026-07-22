import Modal from "../modal/modal";
import Button from "../basic/button/button";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { useAppointmentStore } from "../../stores/useAppointmentStore";
import type { Payment } from "../../definitions/payments";
import "./payHelper.css";

interface PayHelperModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  payment: Payment;
}

const HELPER_NAME = "Ines";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PayHelperModal({
  isModalOpen,
  setIsModalOpen,
  payment,
}: PayHelperModalProps) {
  const payHelper = usePaymentStore((s) => s.payHelper);
  const getAppmnt = useAppointmentStore((s) => s.getAppointment);

  const appmnt = getAppmnt(payment.appointmentID)

  function handlePayHelper() {
    payHelper(payment.appointmentID);
    setIsModalOpen(false);
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Payout"
    >
      <div className="payout-modal">
        <p className="payout-eyebrow">Payout</p>

        <div className="payout-header">
          <div className="payout-avatar">{initials(HELPER_NAME)}</div>
          <div className="payout-name-wrapper">
            <span className="payout-label">Paying out to</span>
            <h2 className="payout-name">{HELPER_NAME}</h2>
          </div>
        </div>

        <div className="payout-divider" />

        <div className="payout-amount">
          <span className="payout-amount-label">Amount owed</span>
          <span className="payout-amount-value">
            <span className="cur">$</span>
            {appmnt? appmnt.expense : 0}
          </span>
        </div>

        <div className="payout-actions">
          <Button label={`Pay ${HELPER_NAME}`} onClick={handlePayHelper} />
        </div>
      </div>
    </Modal>
  );
}