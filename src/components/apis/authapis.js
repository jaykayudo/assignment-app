import { Host } from "./apiHost";
const AuthApi = {
    login:`${Host}/rest-auth/login/`,
    register: `${Host}/rest-auth/registration/`,
    registerTeacher:`${Host}/register-teacher/`,
    registerStudent: `${Host}/register-student/`,
    userDelete: (id)=>(`${Host}/users/${id}/`),
}

export default AuthApi;