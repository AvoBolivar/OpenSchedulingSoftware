import ThemedCalendar from "../calendar/calendar";
import Input from "../basic/input/input";
import Autocomplete from "../basic/autocomplete/autocomplete";
import TimePicker from "../basic/time/timePicker";
import { useClientStore } from "../../stores/useClientStore";
import type { Client } from "../../definitions/client";
import type { RecurrenceFrequency } from "../../lib/date";
import "./createAppointment.css";

export type RepeatOption = "none" | RecurrenceFrequency;

interface AppointmentInfoProps {
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
  selectedClient: Client | null;
  setSelectedClient: (selectedClient: Client | null) => void;
  startTime: string;
  setStartTime: (startTime: string) => void;
  endTime: string;
  setEndTime: (endTime: string) => void;
  rate: string;
  setRate: (rate: string) => void;
  expense: string;
  setExpense: (expense: string) => void;
  // Recurrence is only offered when creating a new appointment — omit these
  // props (as the edit form does) to hide the "Repeat" section entirely.
  repeatOption?: RepeatOption;
  onRepeatOptionChange?: (option: RepeatOption) => void;
  repeatEndDate?: Date | null;
  onRepeatEndDateChange?: (date: Date) => void;
}

const REPEAT_OPTIONS: { value: RepeatOption; label: string }[] = [
  { value: "none", label: "None" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function AppointmentInfo({
  selectedDate,
  setSelectedDate,
  selectedClient,
  setSelectedClient,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  rate,
  setRate,
  expense,
  setExpense,
  repeatOption,
  onRepeatOptionChange,
  repeatEndDate,
  onRepeatEndDateChange,
}: AppointmentInfoProps) {
  const clients = useClientStore((s) => s.clients);

  const eventDates: Date[] = [];
  return (
    <div>
      <div className="calendar-section">
        <ThemedCalendar
          value={selectedDate}
          onChange={setSelectedDate}
          eventDates={eventDates}
        />
      </div>

      {onRepeatOptionChange && (
        <div className="repeat-section">
          <span className="appt-form-label">Repeat</span>
          <div className="repeat-toggle">
            {REPEAT_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`repeat-option ${repeatOption === value ? "selected" : ""}`}
                onClick={() => onRepeatOptionChange(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {repeatOption && repeatOption !== "none" && onRepeatEndDateChange && (
            <div className="repeat-end-date">
              <span className="appt-form-label">Ends On</span>
              <ThemedCalendar
                value={repeatEndDate ?? null}
                onChange={onRepeatEndDateChange}
                minDate={selectedDate}
              />
            </div>
          )}
        </div>
      )}

      <div className="appt-form-section">
        <div className="appt-form-group full-width">
          <Autocomplete<Client>
            label="Clients"
            placeholder="Search Clients"
            items={clients}
            itemToString={(client) => client?.name ?? ""}
            selectedItem={selectedClient}
            onSelectedItemChange={setSelectedClient}
          />
        </div>

        <div className="appt-form-group half-width">
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
          />
        </div>

        <div className="appt-form-group half-width">
          <TimePicker label="End Time" value={endTime} onChange={setEndTime} />
        </div>

        <div className="appt-form-group full-width">
          <Input
            label="Price"
            placeholder="200.00"
            value={rate}
            onChange={setRate}
          />
          <Input
            label="Ines Payment"
            placeholder="50.00"
            value={expense}
            onChange={setExpense}
          />
        </div>
      </div>
    </div>
  );
}
