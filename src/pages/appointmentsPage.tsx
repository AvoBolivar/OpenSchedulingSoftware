import { useMemo } from "react";
import { useAppointmentStore } from "../stores/useAppointmentStore";
import { useShallow } from "zustand/shallow";
import ThemedCalendar from "../components/calendar/calendar";
import CreateAppointment from "../components/appointmentsList/createAppointment";
import ReadAppointments from "../components/appointmentsList/readAppointments";

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

  return (
    <div className="mx-auto w-full max-w-[920px] px-4 pt-5 pb-[calc(44px+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] text-foreground sm:px-5 sm:pt-7 sm:pb-14">
      <header className="mb-2">
        <h1 className="m-0 text-[22px] leading-tight font-bold text-primary sm:text-2xl">Appointments</h1>
        <p className="mt-1 mb-0 text-sm text-muted-foreground">
          Manage your schedule and upcoming sessions
        </p>
      </header>

      <section className="mt-6 sm:mt-7">
        <span className="mb-2.5 block text-xs font-bold tracking-wider text-primary uppercase">Schedule</span>
          <ThemedCalendar
            value={new Date(selectedDay)}
            onChange={setSelectedDay}
            eventDates={eventDates}
          />
          <hr className="my-[18px] border-0 border-t-[1.5px] border-dashed border-border" />
          <CreateAppointment />
      </section>

      <section className="mt-6 sm:mt-7">
        <span className="mb-2.5 block text-xs font-bold tracking-wider text-primary uppercase">Selected Day</span>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <ReadAppointments onlySelectedDay={true} />
        </div>
      </section>

      <section className="mt-6 sm:mt-7">
        <span className="mb-2.5 block text-xs font-bold tracking-wider text-primary uppercase">All Appointments</span>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <ReadAppointments />
        </div>
      </section>
    </div>
  )
}