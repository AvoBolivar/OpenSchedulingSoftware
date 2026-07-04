import { useMemo } from "react";
import { useAppointmentStore } from "../stores/useAppointmentStore";
import { useShallow } from "zustand/shallow";
import ThemedCalendar from "../components/calendar/calendar";
import CreateAppointment from "../components/createAppointment/createAppointment";
import ReadAppointments from "../components/appointmentsList/readAppointments";
import Button from "../components/basic/button/button";
import ImportData from "../components/settings/dataHandler/importexportdata";
import "./pages.css";

export default function AppointmentsPage() {
  const [selectedDay, setSelectedDay] = useAppointmentStore(
    useShallow((s) => [s.selectedDay, s.setSelectedDay])
  )

  const appointments = useAppointmentStore((s) => s.appointments)

  const eventDates = useMemo(
    () => useAppointmentStore.getState().getMonthsAppointmentDates(
      selectedDay.getFullYear(),
      selectedDay.getMonth()
    ),
    [appointments, selectedDay]
  )

  const deleteData = () => {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Appointments</h1>
        <p className="page__subtitle">
          Manage your schedule and upcoming sessions
        </p>
      </header>

      <section className="section">
        <span className="section__label">Schedule</span>
        <div className="panel">
          <ThemedCalendar
            label="Calendar"
            value={new Date(selectedDay)}
            onChange={setSelectedDay}
            eventDates={eventDates}
          />
          <hr className="divider" />
          <CreateAppointment />
        </div>
      </section>

      <section className="section">
        <span className="section__label">Selected Day</span>
        <div className="panel">
          <ReadAppointments onlySelectedDay={true} />
        </div>
      </section>

      <section className="section">
        <span className="section__label">All Appointments</span>
        <div className="panel">
          <ReadAppointments />
        </div>
      </section>
      <Button 
        label="Delete Data"
        onClick={deleteData}
      />
      <ImportData />
    </div>
  )
}