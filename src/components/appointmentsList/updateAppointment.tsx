import { useState } from "react";
import type { Appointment } from "../../definitions/appointments";
import type { Client } from "../../definitions/client";
import { useAppointmentStore } from "../../stores/useAppointmentStore";
import { useClientStore } from "../../stores/useClientStore";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { toDateKey } from "../../lib/date";
import Modal from "../modal/modal";
import Button from "../basic/button/button";
import AppointmentInfo from "./appointmentInfo";
import AppointmentFinished from "../confirmationModals/appointmentFinished";
import "./createAppointment.css";

interface UpdateAppointmentProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  appointment: Appointment
}

// Outer component: does the lookup and guards. No useState here,
// so it's safe to return early.
export default function UpdateAppointment({
  isModalOpen,
  setIsModalOpen,
  appointment
}: UpdateAppointmentProps) {
  const getClient = useClientStore((s) => s.getClient);
  const client = appointment ? getClient(appointment.clientID) : undefined;

  if (!appointment || !client) {
    return null; 
  }
  return (
    <UpdateAppointmentForm
      appointment={appointment}
      client={client}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  );
}

interface FormProps {
  appointment: Appointment;
  client: Client;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

// Inner component: receives a guaranteed appointment, so every
// useState initializer is safe.
function UpdateAppointmentForm({
  appointment,
  client,
  isModalOpen,
  setIsModalOpen,
}: FormProps) {
  const updateApt = useAppointmentStore((s) => s.updateAppointment);
  const deleteApt = useAppointmentStore((s) => s.deleteAppointment);
  const createPayment = usePaymentStore((s) => s.createPayment);

  // updating the appointment
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(appointment.date));
  const [selectedClient, setSelectedClient] = useState<Client | null>(client);
  const [startTime, setStartTime] = useState<string>(appointment.startTime);
  const [endTime, setEndTime] = useState<string>(appointment.endTime);
  const [rate, setRate] = useState<string>(String(appointment.charge));
  const [expense, setExpense] = useState<string>(String(appointment.expense));

  // completing job
  const [jobFinished, setJobFinished] = useState<boolean>(false);
  const [jobPaid, setJobPaid] = useState<boolean>(false);
  const [helperPaid, setHelperPaid] = useState<boolean>(false);

  const [componentDisplayed, setComponentDisplayed] = useState<string>("Update");

  function resetForm() {
    setSelectedDate(new Date(appointment.date));
    setSelectedClient(client);
    setStartTime(appointment.startTime);
    setEndTime(appointment.endTime);
    setRate(String(appointment.charge));
    setExpense(String(appointment.expense));
  }

  function handleClose() {
    resetForm();
    setIsModalOpen(false);
    setComponentDisplayed("Update");
  }

  // showOverride lets handleSubmit force show:false without
  // waiting for a state update to flush.
  function updateAppointment(showOverride?: boolean) {
    if (!selectedClient) return;

    updateApt(appointment.id, {
      clientID: selectedClient.id,
      date: toDateKey(selectedDate),
      charge: Number(rate),
      startTime,
      endTime,
      expense: Number(expense),
      show: showOverride ?? appointment.show,
    });
    setIsModalOpen(false);
  }

  function deleteAppointment() {
    deleteApt(appointment.id);
    setIsModalOpen(false);
  }

  function handleSubmit() {
    createPayment({
      date: new Date().toDateString(),
      method: "",
      paymentReceived: jobPaid,
      expensesPaid: helperPaid,
      appointmentID: appointment.id,
    });
    updateAppointment(false); // mark the appointment as no longer showing
    handleClose();
  }

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose} title="Edit Appointment">
      <div className="appointment-modal-layout">
        {componentDisplayed === "Update" ? (
          <div>
            <AppointmentInfo
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
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
              <Button label="Update Appointment" onClick={() => updateAppointment()} />
              <Button label="Delete Appointment" onClick={deleteAppointment} />
              <Button label="Job Completed" onClick={() => setComponentDisplayed("Complete")} />
            </div>
          </div>
        ) : (
          <div>
            <AppointmentFinished
              jobFinished={jobFinished}
              setJobFinished={setJobFinished}
              jobPaid={jobPaid}
              setJobPaid={setJobPaid}
              helperPaid={helperPaid}
              setHelperPaid={setHelperPaid}
            />
            <div>
              <Button label="Done" onClick={handleSubmit} />
              <Button label="Back" onClick={() => setComponentDisplayed("Update")} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}