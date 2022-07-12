import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import AuthContext from './context/AuthContext';
import { useContext } from 'react';

const CreateUser = () => {
  const context = useContext(AuthContext);
  const onFinish = (values) => {
    axios.post('http://127.0.0.1:8000/rest-auth/registration/',{username:values.username,password1:values.password,password2:values.password}).then(res=>{
        if(res.status === 201){
            localStorage.setItem('user',`${JSON.stringify(res.data.user)}`)
            localStorage.setItem('token',`Token ${res.data.token}`)
            context.logUserIn()
            message.success("User Created Successfully", 1)
        }
    }).catch(err=>{
        message.info(`${err.response.data.username}`)
    })
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please, Fill the Form Properly!")
  };
  return (
    <Form
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
        <h1>SignUp</h1>
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please Input the Username!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        
        rules={[
          {
            required: true,
            message: 'Please Input an Email!',
          },
        ]}
      >
        <Input type='email' />
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
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateUser;