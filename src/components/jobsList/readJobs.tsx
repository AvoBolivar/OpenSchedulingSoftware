import type { Job } from "../../definitions/job"
import { useJobStore } from "../../stores/useJobStore"
import JobCard from "./jobCard"

export default function ReadJobs() {
  const jobs = useJobStore((s) => s.jobs)

  if (jobs.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-muted-foreground">
        <p className="m-0 mb-1 text-base font-bold text-primary">No jobs yet</p>
        <p className="m-0 text-sm">
          Add your first job to see it here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3.5">
      {jobs.map((job: Job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
