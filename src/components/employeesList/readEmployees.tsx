import type { Employee } from "../../definitions/employee"
import { useEmployeeStore } from "../../stores/useEmployeeStore"
import EmployeeCard from "./employeeCard"

export default function ReadEmployees() {
  const employees = useEmployeeStore((s) => s.employees)

  if (employees.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-muted-foreground">
        <p className="m-0 mb-1 text-base font-bold text-primary">No employees yet</p>
        <p className="m-0 text-sm">
          Add your first employee to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3.5">
      {employees.map((employee: Employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  )
}
