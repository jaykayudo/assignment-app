
import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import CustomLayout from './components/containers/layout';
import {message} from 'antd'

import BaseRouter from './components/router';
import AuthContext from './components/context/AuthContext';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    const storeUserLoggedInInfomation = localStorage.getItem("token")
    if(storeUserLoggedInInfomation){
      setIsLoggedIn(true);
    }
  },[])

  const LogUserOut = () =>{
      localStorage.removeItem('user')
      localStorage.removeItem("token")
      setIsLoggedIn(false)
      window.location.reload()
  }
  return (
    <>
    <AuthContext.Provider value={
      {
        isLoggedIn: isLoggedIn,
        userToken: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem('user')),
        logUserOut: LogUserOut,
        logUserIn:()=>(setIsLoggedIn(true))
    }
      }>
      <Router>
        <CustomLayout>
          <BaseRouter /> 
        </CustomLayout>
      </Router>
    </AuthContext.Provider>
    </>
  );
}

export default App;
