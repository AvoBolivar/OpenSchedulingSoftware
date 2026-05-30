import ThemedCalendar from "../calendar/calendar";
import Input from "../basic/input/input";
import Autocomplete from "../basic/autocomplete/autocomplete";
import TimePicker from "../basic/time/timePicker";
import { useClientStore } from "../../stores/useClientStore";
import type { Client } from "../../definitions/client";
import "../createAppointment/createAppointment.css";

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
  expense: string
  setExpense: (expense: string) => void
}

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
  setExpense
}: AppointmentInfoProps) {
  const clients = useClientStore((s) => s.clients)

  const eventDates: Date[] = [];
  return (
    <div>
      <div className="calendar-section">
        <ThemedCalendar
          label="Select Date"
          value={selectedDate}
          onChange={setSelectedDate}
          eventDates={eventDates}
        />
      </div>

      <div className="form-section">
        <div className="form-group full-width">
          <Autocomplete<Client>
            label="Clients"
            placeholder="Search Clients"
            items={clients}
            itemToString={(client) => client?.name ?? ""}
            selectedItem={selectedClient}
            onSelectedItemChange={setSelectedClient}
          />
        </div>

        <div className="form-group half-width">
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
          />
        </div>

        <div className="form-group half-width">
          <TimePicker label="End Time" value={endTime} onChange={setEndTime} />
        </div>

        <div className="form-group full-width">
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
