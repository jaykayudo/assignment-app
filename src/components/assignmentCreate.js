import { Button, Form, Input,message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QuestionsForm from './questionsForm';
import AuthContext from './context/AuthContext';
import { useContext, useEffect } from 'react';
import AssignmentApi from './apis/assignmentapis';




const AssignmentCreate = () => {
    document.title = "Create Assignment"
    const context = useContext(AuthContext)
    const navigate = useNavigate();
    useEffect(()=>{
      if(!context.isLoggedIn){
        message.error({
          content:"You need to login to access this page",
          key:'updatable',
          duration: 2
        });
        navigate('/')
        return
      }
    },[])
    const onFinish = (values) => {
      if(!context.userToken || !context.isLoggedIn || !context.user.is_teacher){
          message.error("You are not allowed to create assignment")
          navigate('/')
      }
      const questions = []
      for(let x of values.questions){
          questions.push(
            {
              question: x.question,
              answer: x.answer,
              choices:x.choices.map((choice)=>({title:choice.choice})),
              order: (values.questions.indexOf(x) + 1)
            }
          )
      }
      const data = {
        title: values.title,
        teacher: context.user.username,
        questions: questions
      }
    if(localStorage.getItem("token"))
        axios.defaults.headers = {'Authorization':`${localStorage.getItem("token")}`,'Content-Type':'application/json'}
    axios.post(AssignmentApi.create,data).then(res=>{
        if(res.status === 201){
            message.success("Assignment Created")
            setTimeout(()=>{
                navigate('/')
            },1000)
        }
    }).catch(err =>{
        if(err.response.status === 400){
            message.error("An Error Ocurred")
        }
        else if(err.response.status === 401){
            message.error("You need to be Logged In, in order to create a post")
        }
        else{
          message.error(err.message)
        }
        
    })
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please, fill the form properly.")
  };
  

  return (
   <>
    <Form
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
        <h1>Add Assignments</h1>
        <Form.Item
        name={"title"}
      >
        <Input placeholder='Title of the assignment'/>
      </Form.Item>
      <QuestionsForm />

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
    </>
  );
};

export default AssignmentCreate;