import {
    Button,
    Form,
    Input,
    Select, 
    Tabs, 
    message
  } from 'antd';
import axios from 'axios';
import AuthApi from './apis/authapis'
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AuthContext from './context/AuthContext';
const { TabPane } = Tabs;
const { Option } = Select;


const Registration = () => {
  document.title = "Register"
    const context = useContext(AuthContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    useEffect(()=>{
        if(context.isLoggedIn){
            message.info("User already logged in")
            navigate('/')
        }
    },[])
    const onFinish = (values) =>{
        message.loading({
            content:"Processing data",
            key:'updatable',
            duration: 1
        })
        const userData = {
            username:values.username,
            email: values.email,
            password1: values.password,
            password2: values.confirm
        }
        const originalTeacherData = {
            firstname: values.firstname,
            surname: values.surname,
            gender: values.gender,
            
        }
        axios.post(AuthApi.register,userData).then(res=>{
            
            if(res.status === 201){
                const teacherData = {
                    user: res.data.user.username,
                    ...originalTeacherData
                }
                axios.post(AuthApi.registerTeacher, teacherData).then(techres=>{
                    if(techres.status === 201){
                        localStorage.setItem('user',`${JSON.stringify(res.data.user)}`)
                        localStorage.setItem('token',`Token ${res.data.key}`)
                        context.logUserIn()
                        message.success({
                            content:"Teacher created successfully",
                            key:'updatable',
                            duration: 1
                        })
                        setTimeout(()=>( navigate('/')),1000)
                       
                    }
                }).catch(err=>{
                    
                    axios.defaults.headers = {'Authorization':`Token ${res.data.key}`}
                    axios.delete(AuthApi.userDelete(res.data.user.id)).then(deleteres=>{
                        message.error({
                        content:err.message,
                        key:'updatable',
                        duration: 1
                        })
                    })
                })
            }
        }).catch(err=>{
            if(err.response.status === 400){
                if(err.response.data.username){
                    for(let x of err.response.data.username){
                        message.error(x)
                    }
                }
                if(err.response.data.email){
                    for(let x of err.response.data.email){
                        message.error(x)
                    }
                }
                if(err.response.data.password){
                    for(let x of err.response.data.password){
                        message.error(x)
                    }
                }
            }else{
                message.error({
                content:err.message,
                key:'updatable',
                duration: 1
            })
            }
            
        })

    }
    const studentOnFinish = (values) =>{
        message.loading({
            content:"Processing data",
            key:'updatable',
            duration: 1
        })
        const userData = {
            username:values.username,
            email: values.email,
            password1: values.password,
            password2: values.confirm
        }
        const originalStudentData = {
            firstname: values.firstname,
            surname: values.surname,
            gender: values.gender,
            designation: values.designation
            
        }
        axios.post(AuthApi.register,userData).then(res=>{
            
            if(res.status === 201){
                const studentData = {
                    user: res.data.user.username,
                    ...originalStudentData
                }
                axios.post(AuthApi.registerStudent, studentData).then(studres=>{
                    if(studres.status === 201){
                        localStorage.setItem('user',`${JSON.stringify(res.data.user)}`)
                        localStorage.setItem('token',`Token ${res.data.key}`)
                        context.logUserIn()
                        message.success({
                            content:"Student created successfully",
                            key:'updatable',
                            duration: 1
                        })
                        setTimeout(()=>( navigate('/')),1000)
                    }
                }).catch(err=>{
                    message.error({
                        content:err.message,
                        key:'updatable',
                        duration: 1
                    })
                })
            }
        }).catch(err=>{
            if(err.response.status === 400){
                if(err.response.status === 400){
                    if(err.response.data.username){
                        for(let x of err.response.data.username){
                            message.error(x)
                        }
                    }
                    if(err.response.data.email){
                        for(let x of err.response.data.email){
                            message.error(x)
                        }
                    }
                    if(err.response.data.password){
                        for(let x of err.response.data.password){
                            message.error(x)
                        }
                    }
                }else{
                    message.error({
                    content:err.message,
                    key:'updatable',
                    duration: 1
                })
                }
            }else{
                message.error({
                content:err.message,
                key:'updatable',
                duration: 1
                })
            }
            
        })

    }
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" size={'large'}>
        <TabPane tab="Register as Teacher" key="1">
        <Form

      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
        <h2>Teacher Registration</h2>
        <Form.Item
        name="firstname"
        label="Firstname"
        rules={[
          {
            required: true,
            message: 'Please input your Firstname!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="surname"
        label="Surname"
        rules={[
          {
            required: true,
            message: 'Please input your Surname!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>
        
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="username"
        label="Username"
        tooltip="A unique username for the website to know you"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
            whitespace: false,
          },
        ]}
      >
        <Input />
      </Form.Item>

      

      <Form.Item
        name="gender"
        label="Gender"
        rules={[
          {
            required: true,
            message: 'Please select gender!',
          },
        ]}
      >
        <Select placeholder="select your gender">
          <Option value="m">Male</Option>
          <Option value="f">Female</Option>
        </Select>
      </Form.Item>

      
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
    </TabPane>
    <TabPane tab="Register as Student" key="2">
        <Form
        form={form}
        name="register"
        onFinish={studentOnFinish}
        scrollToFirstError
        >
            <h2>Student Registration</h2>
            <Form.Item
            name="firstname"
            label="Firstname"
            rules={[
                {
                required: true,
                message: 'Please input your Firstname!',
                },
            ]}
            >
            <Input />
            </Form.Item>
            <Form.Item
            name="surname"
            label="Surname"
            rules={[
                {
                required: true,
                message: 'Please input your Surname!',
                },
            ]}
            >
            <Input />
            </Form.Item>
            <Form.Item
            name="email"
            label="E-mail"
            rules={[
                {
                type: 'email',
                message: 'The input is not valid E-mail!',
                },
                {
                required: true,
                message: 'Please input your E-mail!',
                },
            ]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            name="password"
            label="Password"
            rules={[
                {
                required: true,
                message: 'Please input your password!',
                },
            ]}
            hasFeedback
            >
            <Input.Password />
            </Form.Item>

            <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
                {
                required: true,
                message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                    }

                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
                }),
            ]}
            >
            <Input.Password />
            </Form.Item>

            <Form.Item
            name="username"
            label="Username"
            tooltip="A unique username for the website to know you"
            rules={[
                {
                required: true,
                message: 'Please input your username!',
                whitespace: false,
                },
            ]}
            >
            <Input />
            </Form.Item>



            <Form.Item
            name="designation"
            label="Designation"
            rules={[
                {
                required: true,
                message: 'Please select designation!',
                },
            ]}
            >
            <Select placeholder="select your designation">
                <Option value="computer">Computer</Option>
                <Option value="chemistry">Chemistry</Option>
                <Option value="english">English</Option>
                <Option value="physics">Physics</Option>
                <Option value="social sciences">Social Sciences</Option>
                <Option value="mathematics">Mathematics</Option>
            </Select>
            </Form.Item>
            <Form.Item
            name="gender"
            label="Gender"
            rules={[
                {
                required: true,
                message: 'Please select gender!',
                },
            ]}
            >
            <Select placeholder="select your gender">
                <Option value="m">Male</Option>
                <Option value="f">Female</Option>
            </Select>
            </Form.Item>

            <Form.Item>
            <Button type="primary" htmlType="submit">
                Register
            </Button>
            </Form.Item>
            </Form>
    </TabPane>
        
    </Tabs>
    </div>
  );
};

export default Registration;