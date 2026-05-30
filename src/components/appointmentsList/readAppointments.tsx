import { useState, useMemo } from "react";
import type { Appointment } from "../../definitions/appointments";
import { useAppointmentStore } from "../../stores/useAppointmentStore";
import { toDateKey } from "../../lib/date";
import AppointmentCard from "../basic/cards/appointmentCard";
import UpdateAppointment from "./updateAppointment";

interface ReadAppointmentsProps {
  onlySelectedDay?: boolean
}

export default function ReadAppointments({ onlySelectedDay }: ReadAppointmentsProps) {
  const appointments = useAppointmentStore((s) => s.appointments);
  const selectedDay = useAppointmentStore((s) => s.selectedDay);
  const getDayAppointments = useAppointmentStore((s) => s.getDayAppointments);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const upcomingAppointments = useMemo(() => {
    if (onlySelectedDay) {
      return getDayAppointments(toDateKey(selectedDay))
    }
    return appointments.filter((a) => a.show)
  }, [onlySelectedDay, appointments, selectedDay, getDayAppointments])

  return (
    <>
      {upcomingAppointments.map((appointment) => (
        <AppointmentCard
          appointment={appointment}
          key={appointment.id}
          onClick={() => {
            setSelectedApt(appointment)
            setIsModalOpen(true)
          }}
        />
      ))}

      {selectedApt && (
        <UpdateAppointment
          key={selectedApt.id}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          appointment={selectedApt}
        />
      )}
    </>
  );
}