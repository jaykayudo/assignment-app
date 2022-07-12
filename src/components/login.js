import { Button, Form, Input,message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext from './context/AuthContext';
const Login = () => {
    document.title = "Login"
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    useEffect(()=>{
    if(context.isLoggedIn){
          message.info("User is logged in")
          navigate('/')
        }
    },[context])
    
  const onFinish = (values) => {
    axios.post('http://127.0.0.1:8000/rest-auth/login/',{username:values.username,password:values.password}).then(res=>{
        if(res.status === 200){
            localStorage.setItem('token',`Token ${res.data.key}`)
            localStorage.setItem('user',`${JSON.stringify(res.data.user)}`)
            context.logUserIn()
            message.success("Login Successful")
            setTimeout(()=>{
                navigate('/')
            },1000)
        }
    }).catch(err =>{
        if(err.response.status === 400){
            message.error("Incorrect Credentials")
        }
        else {
            message.error("An Error Occurred")
        }
    })
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please, fill the form properly")
  };
  const handleSubmit =()=>{

  };

  return (
    <Form
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      onSubmit={handleSubmit}
    >
        <h1>Login</h1>
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please Input your Username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please Input your Password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="success" htmlType="submit">
          login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;