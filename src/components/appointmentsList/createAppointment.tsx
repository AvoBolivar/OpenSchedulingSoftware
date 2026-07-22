import { useState } from "react";
import Button from "../basic/button/button";
import AppointmentInfo from "./appointmentInfo";
import Modal from "../modal/modal";
import type { Client } from "../../definitions/client";
import { useAppointmentStore } from "../../stores/useAppointmentStore";
import { toDateKey } from "../../lib/date";

import "./createAppointment.css";

export default function CreateAppointment() {
  const createAppointment = useAppointmentStore((s) => s.createAppointment);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [startTime, setStartTime] = useState<string>("9:00 AM");
  const [endTime, setEndTime] = useState<string>("10:00 AM");
  const [expense, setExpense] = useState<string>("0");
  const [rate, setRate] = useState<string>("0");

  function handleClientChange(client: Client | null) {
    setSelectedClient(client);
    if (client) {
      setRate(String(client.price));
      setExpense(String(client.employeePayment));
    }
  }

  function resetForm() {
    setSelectedDate(new Date());
    setSelectedClient(null);
    setStartTime("9:00 AM");
    setEndTime("10:00 AM");
    setRate("0");
    setExpense("0");
  }

  function handleCreateAppointment() {
    if (!selectedClient) return; // guard — see note below

    createAppointment({
      clientID: selectedClient.id,
      startTime,
      endTime,
      charge: Number(rate),
      date: toDateKey(selectedDate),
      expense: Number(expense),
      show: true,
    });

    resetForm();
    setIsModalOpen(false);
  }

  return (
    <>
      <Button
        label="Create New Appointment"
        onClick={() => setIsModalOpen(true)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Appointment"
      >
        <div className="appointment-modal-layout">
          <AppointmentInfo
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedClient={selectedClient}
            setSelectedClient={handleClientChange}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            rate={rate}
            setRate={setRate}
            expense={expense}
            setExpense={setExpense}
          />
          <div className="form-actions">
            <Button label="Add Appointment" onClick={handleCreateAppointment} />
          </div>
        </div>
      </Modal>
    </>
  );
}