import { useState } from "react";
import { Calendar, Clock, Trash2 } from "lucide-react";
import type { Payment } from "../../definitions/payments";
import { useClientStore } from "../../stores/useClientStore";
import { useAppointmentStore } from "../../stores/useAppointmentStore";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { fromDateKey } from "../../lib/date";
import Modal from "../modal/modal";
import Button from "../basic/button/button";
import Input from "../basic/input/input";
import Autocomplete from "../basic/autocomplete/autocomplete";
import Checkbox from "../basic/checkbox/checkbox";

interface UpdateCollectionProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  payment: Payment;
}

const PAYMENT_METHODS: string[] = ["venmo", "check", "zelle"];

export default function UpdateCollection({
  isModalOpen,
  setIsModalOpen,
  payment,
}: UpdateCollectionProps) {
  const getAppointment = useAppointmentStore((s) => s.getAppointment);
  const updateApt = useAppointmentStore((s) => s.updateAppointment);
  const getClient = useClientStore((s) => s.getClient);
  const updatePayment = usePaymentStore((s) => s.updatePayment);
  const deletePayment = usePaymentStore((s) => s.deletePayment);

  const appointment = getAppointment(payment.appointmentID);
  const client = appointment ? getClient(appointment.clientID) : undefined;

  const [rate, setRate] = useState<string>(String(appointment?.charge ?? ""));
  const [method, setMethod] = useState<string | null>(payment.method || null);
  const [paymentReceived, setPaymentReceived] = useState<boolean>(
    payment.paymentReceived,
  );

  if (!appointment || !client) {
    return null;
  }

  const initials = client.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const dateObj = fromDateKey(appointment.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  function resetForm() {
    setRate(String(appointment!.charge));
    setMethod(payment.method || null);
    setPaymentReceived(payment.paymentReceived);
  }

  function handleClose() {
    resetForm();
    setIsModalOpen(false);
  }

  function handleSave() {
    updateApt(appointment!.id, { charge: Number(rate) });

    updatePayment(payment.id, {
      method: method ?? "",
      paymentReceived: paymentReceived,
      date:
        paymentReceived && !payment.paymentReceived
          ? new Date().toDateString()
          : payment.date,
    });

    setIsModalOpen(false);
  }

  function handleDelete() {
    deletePayment(payment.id);
    setIsModalOpen(false);
  }

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose} title="Collection">
      <div className="flex flex-col gap-4">
        {/* Client header */}
        <div className="flex items-center gap-3 rounded-[10px] bg-primary/10 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold tracking-wide text-primary-foreground shadow-sm">{initials}</div>
          <div className="min-w-0 flex-1">
            <h3 className="m-0 mb-1 text-base font-bold text-foreground">{client.name}</h3>
            <p className="m-0 text-[13px] leading-snug text-muted-foreground">{client.phoneNumber}</p>
            <p className="m-0 text-[13px] leading-snug text-muted-foreground">{client.address}</p>
          </div>
        </div>

        {/* Appointment summary */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[13px] text-foreground">
            <Calendar className="shrink-0 text-primary" width={14} height={14} aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-foreground">
            <Clock className="shrink-0 text-primary" width={14} height={14} aria-hidden="true" />
            <span>
              {appointment.startTime} – {appointment.endTime}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-1 h-px bg-border" />

        {/* Form fields */}
        <Input
          label="Rate"
          type="number"
          prefix="$"
          placeholder="0.00"
          value={rate}
          onChange={setRate}
        />

        <Autocomplete<string>
          label="Payment method"
          placeholder="Select a method"
          items={PAYMENT_METHODS}
          itemToString={(item) => item ?? ""}
          selectedItem={method}
          onSelectedItemChange={(item) => setMethod(item)}
        />

        <div className="rounded-lg bg-primary/10 px-3.5 py-3">
          <Checkbox
            label="Payment received"
            checked={paymentReceived}
            onChange={setPaymentReceived}
          />
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-4">
          <Button
            label="Delete"
            variant="danger"
            onClick={handleDelete}
            icon={<Trash2 width={14} height={14} />}
          />
          <div className="flex gap-2">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={handleClose}
            />
            <Button label="Save" variant="primary" onClick={handleSave} />
          </div>
        </div>
      </div>
    </Modal>
  );
}