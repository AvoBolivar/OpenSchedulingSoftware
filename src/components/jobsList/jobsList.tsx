import { useJobStore } from "../../stores/useJobStore"
import ReadJobs from "./readJobs"
import CreateJob from "./createJob"
import JobDetail from "./jobDetail"

export default function JobsList() {
  const selectedJobID = useJobStore((s) => s.selectedJobID)

  if (selectedJobID) {
    return <JobDetail jobID={selectedJobID} />
  }

  return (
    <>
      <ReadJobs />
      <hr className="my-[18px] border-0 border-t-[1.5px] border-dashed border-border" />
      <CreateJob />
    </>
  )
}
