import React from "react";

const AuthContext = React.createContext({
    isLoggedIn: false,
    userToken: localStorage.getItem("token")
})

export default AuthContext;