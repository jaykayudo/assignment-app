import { Host } from "./apiHost";
const AssignmentApi = {
    list:`${Host}/assignments/`,
    create: `${Host}/assignments/`,
    check:(id)=>(`${Host}/check-assignment/${id}/`),
    details:(id)=>(`${Host}/assignments/${id}/`),
    delete:(id)=>(`${Host}/assignments/${id}/`),
    retrieve:(id)=>(`${Host}/assignments/${id}/`),
}

export default AssignmentApi;