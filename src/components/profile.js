import AuthContext from "./context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Descriptions,message, Card, List, Divider} from 'antd';
import './styles/profile.css'
import axios from "axios";
import ResultProgress from "./widgets/Progress";
import GradedAssignmentApi from "./apis/gradedassignmentapis";



const Profile = () =>{
  document.title = "Profile"
    const navigate = useNavigate();
    const context = useContext(AuthContext)
    const [gradedANTSData, setGradedANTSData] = useState([]);
    if(!localStorage.getItem('user')){
      message.error({
        content: "Login first",
        key:'updatable',
        duration:1
      })
      window.location.assign('/login')
    }
    useEffect(()=>{
      if(localStorage.getItem('token') && context.user){
        if(!context.user.is_student)
          return
        axios.defaults.headers = {
            'Content-Type':'application/json',
            'Authorization':`${localStorage.getItem('token')}`
          }
          axios.get(GradedAssignmentApi.list).then(res=>{
            if(res.status === 200){
              setGradedANTSData(res.data)
            }
          }).catch(err=>{
            if(err.response.status === 401 ){
              message.error({
                content: "User is Unauthorized, Login First.",
                key:'updatable',
                duration:1
              })
            }
            else{
                message.error({
                    content: "An Error Ocurred in Loading Assignment.",
                    key:'updatable',
                    duration:1
                  })
            }})
    }else{
    }
    },[])
    
    return (
        <>
    <Descriptions title="User Info" className="profile-box">
    <Descriptions.Item label="Username">{context.user ? context.user.username: "Loading"}</Descriptions.Item>
    {context.user.is_student &&<Descriptions.Item label="Type">Student</Descriptions.Item>}
    {context.user.is_teacher &&<Descriptions.Item label="Type">Teacher</Descriptions.Item>}

    </Descriptions>
    {context.user.is_student &&
    (
        <Card title="Graded Assignments" style={{marginTop:'15px'}}>
    <List
        size="large"
        bordered
        style={{padding:"20px 10px"}}
        dataSource={gradedANTSData}
        renderItem={(item) => (<><h4>{item.assignment_name}</h4><ResultProgress grade={item.grade} key={item.id} /><Divider /></>)}
    />
  </Card>
    )
    }
    
    </>
    );
}
export default Profile;