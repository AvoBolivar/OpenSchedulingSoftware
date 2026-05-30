import ReadAppointments from "./readAppointments";
import CreateAppointment from "../createAppointment/createAppointment";

export default function AppointmentList() {
  return (
    <div>
      <CreateAppointment />
      <ReadAppointments onlySelectedDay={true} />
      <ReadAppointments />
    </div>
  )

}