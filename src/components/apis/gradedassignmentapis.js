import { Host } from "./apiHost";
const GradedAssignmentApi = {
    list:`${Host}/graded-assignments/`,
    create: `${Host}/graded-assignments/`,
    details:(id)=>(`${Host}/graded-assignments/${id}/`),

}

export default GradedAssignmentApi;