import { useState } from "react";
import type { Payment } from "../../definitions/payments";
import { useClientStore } from "../../stores/useClientStore";
import { useAppointmentStore } from "../../stores/useAppointmentStore";
import { usePaymentStore } from "../../stores/usePaymentStore";
import Modal from "../modal/modal";
import Button from "../basic/button/button";
import Autocomplete from "../basic/autocomplete/autocomplete";
import Checkbox from "../basic/checkbox/checkbox";
import "./updateCollection.css";

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

  const dateObj = new Date(appointment.date);
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
      <div className="uc-layout">
        {/* Client header */}
        <div className="uc-client">
          <div className="uc-avatar">{initials}</div>
          <div className="uc-client-info">
            <h3 className="uc-client-name">{client.name}</h3>
            <p className="uc-client-detail">{client.phoneNumber}</p>
            <p className="uc-client-detail">{client.address}</p>
          </div>
        </div>

        {/* Appointment summary */}
        <div className="uc-appointment">
          <div className="uc-appointment-row">
            <svg
              className="uc-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>{formattedDate}</span>
          </div>
          <div className="uc-appointment-row">
            <svg
              className="uc-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              {appointment.startTime} – {appointment.endTime}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="uc-divider" />

        {/* Form fields */}
        <div className="uc-field">
          <label className="uc-label">Rate</label>
          <div className="uc-input-wrapper">
            <span className="uc-currency-prefix">$</span>
            <input
              type="number"
              className="uc-input"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <Autocomplete<string>
          label="Payment method"
          placeholder="Select a method"
          items={PAYMENT_METHODS}
          itemToString={(item) => item ?? ""}
          selectedItem={method}
          onSelectedItemChange={(item) => setMethod(item)}
        />

        <div className="uc-checkbox-wrapper">
          <Checkbox
            label="Payment received"
            checked={paymentReceived}
            onChange={setPaymentReceived}
          />
        </div>

        {/* Actions */}
        <div className="uc-actions">
          <div className="uc-actions">
            <Button
              label="Delete"
              variant="danger"
              onClick={handleDelete}
              icon={
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                </svg>
              }
            />
            <div className="uc-actions-right">
              <Button
                label="Cancel"
                variant="secondary"
                onClick={handleClose}
              />
              <Button label="Save" variant="primary" onClick={handleSave} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}