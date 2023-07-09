
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
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const storeUserLoggedInInfomation = localStorage.getItem("token")
    if(storeUserLoggedInInfomation){
    axios.post("http://127.0.0.1:8000/getuserbytoken/",{token:storeUserLoggedInInfomation},{headers:{'Authorization':`${storeUserLoggedInInfomation}`}}).then(res=>{
        setIsLoggedIn(true);
        setUser(res.data.user);
        setUserToken("Token "+res.data.key)
        localStorage.setItem('user',JSON.stringify(res.data.user))
        localStorage.setItem('token',"Token "+res.data.key)
      }).catch(err=>{
        setIsLoggedIn(false);
      })
      
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
        userToken: userToken,
        user: user,
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
