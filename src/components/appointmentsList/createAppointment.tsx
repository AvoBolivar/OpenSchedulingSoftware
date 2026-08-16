import { useState } from "react";
import Button from "../basic/button/button";
import AppointmentInfo from "./appointmentInfo";
import type { RepeatOption } from "./appointmentInfo";
import Modal from "../modal/modal";
import type { Client } from "../../definitions/client";
import { useAppointmentStore } from "../../stores/useAppointmentStore";
import { toDateKey, generateRecurringDates } from "../../lib/date";

export default function CreateAppointment() {
  const createAppointment = useAppointmentStore((s) => s.createAppointment);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [startTime, setStartTime] = useState<string>("9:00 AM");
  const [endTime, setEndTime] = useState<string>("10:00 AM");
  const [expense, setExpense] = useState<string>("0");
  const [rate, setRate] = useState<string>("0");
  const [repeatOption, setRepeatOption] = useState<RepeatOption>("none");
  const [repeatEndDate, setRepeatEndDate] = useState<Date | null>(null);

  const isRepeating = repeatOption !== "none";
  // Compare by date-key (not raw Date <) since selectedDate can carry a
  // time-of-day component while repeatEndDate is always midnight-normalized
  // by the calendar — a same-day range would otherwise look "invalid".
  const repeatEndDateInvalid =
    isRepeating && (!repeatEndDate || toDateKey(repeatEndDate) < toDateKey(selectedDate));
  const occurrenceDates =
    isRepeating && repeatEndDate && !repeatEndDateInvalid
      ? generateRecurringDates(selectedDate, repeatOption, repeatEndDate)
      : [selectedDate];

  function handleClientChange(client: Client | null) {
    setSelectedClient(client);
    if (client) {
      setRate(String(client.price));
      setExpense(String(client.employeePayment));
      setStartTime(client.defaultStartTime ?? "9:00 AM");
      setEndTime(client.defaultEndTime ?? "10:00 AM");
    }
  }

  function resetForm() {
    setSelectedDate(new Date());
    setSelectedClient(null);
    setStartTime("9:00 AM");
    setEndTime("10:00 AM");
    setRate("0");
    setExpense("0");
    setRepeatOption("none");
    setRepeatEndDate(null);
  }

  function handleCreateAppointment() {
    if (!selectedClient || repeatEndDateInvalid) return; // guard — see note below

    for (const date of occurrenceDates) {
      createAppointment({
        clientID: selectedClient.id,
        startTime,
        endTime,
        charge: Number(rate),
        date: toDateKey(date),
        expense: Number(expense),
        show: true,
      });
    }

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
        <div className="mx-auto flex max-w-[800px] flex-col gap-6 px-1 py-2 md:grid md:grid-cols-[1.2fr_1fr] md:items-start">
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
            repeatOption={repeatOption}
            onRepeatOptionChange={setRepeatOption}
            repeatEndDate={repeatEndDate}
            onRepeatEndDateChange={setRepeatEndDate}
          />
          <div className="mt-3 flex flex-col justify-end gap-2.5">
            {isRepeating && (
              <span className="text-center text-[13px] text-primary">
                {repeatEndDateInvalid
                  ? "Pick an end date on or after the start date."
                  : `This will create ${occurrenceDates.length} appointment${occurrenceDates.length === 1 ? "" : "s"}.`}
              </span>
            )}
            <Button
              label="Add Appointment"
              onClick={handleCreateAppointment}
              disabled={!selectedClient || repeatEndDateInvalid}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
