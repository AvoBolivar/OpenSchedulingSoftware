import Modal from "../modal/modal";
import Button from "../basic/button/button";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { useAppointmentStore } from "../../stores/useAppointmentStore";
import type { Payment } from "../../definitions/payments";

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
      <div className="p-1 text-foreground">
        <p className="m-0 mb-4 text-[10px] font-bold tracking-[0.16em] text-primary uppercase">Payout</p>

        <div className="flex items-center gap-3.5">
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold tracking-wide text-primary-foreground shadow-md">{initials(HELPER_NAME)}</div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Paying out to</span>
            <h2 className="m-0 truncate text-[19px] leading-tight font-bold text-foreground">{HELPER_NAME}</h2>
          </div>
        </div>

        <div className="my-5 h-px bg-border" />

        <div className="flex items-baseline justify-between gap-3 rounded-xl border border-border bg-primary/10 px-[18px] py-4">
          <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Amount owed</span>
          <span className="text-[30px] leading-none font-bold tracking-tight text-foreground">
            <span className="mr-0.5 align-[6px] text-[17px] text-primary">$</span>
            {appmnt? appmnt.expense : 0}
          </span>
        </div>

        <div className="mt-[22px] flex gap-2.5 [&>*]:flex-1">
          <Button label={`Pay ${HELPER_NAME}`} onClick={handlePayHelper} />
        </div>
      </div>
    </Modal>
  );
}