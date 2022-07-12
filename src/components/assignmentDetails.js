import { Card, message, Skeleton} from 'antd';
import { ExclamationCircleOutlined, CaretLeftFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import AuthContext from './context/AuthContext';
import Questions from './Questions';
import axios from 'axios';
import AssignmentApi from './apis/assignmentapis';


import {
    EditOutlined,DeleteOutlined
  } from '@ant-design/icons';

const smallButtonStyles = {
    display:"inline-block",
    padding:"5px 7px",
    fontSize: "17px"
}



const LocalizedModal = (props) => {
  

  const showModal = () => {
    props.showModal()
  };

  const hideModal = () => {
    props.hideModal()
  };

  return (
    <>
      <Modal
        title="Delete Post"
        visible={props.visible}
        onOk={showModal}
        onCancel={hideModal}
        okText="Yes, Delete It"
        cancelText="No"
      >
        <p>Are you sure that you want to delete this Post?</p>
        
      </Modal>
    </>
  );
};



const CompleteModal = (props) => (
  <Space>
    <LocalizedModal visible={props.visible} showModal={props.showModal} hideModal={props.hideModal} />
  </Space>
);


const PostDetails = () => {
    const {id} = useParams()
    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(true);
    const context = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(()=>{
      if(!context.user.is_student){
        message.error({
          content:'Only students are allowed to answer the assignment',
          key:'secondupdatable',
          duration: 1
        })
        navigate('/')
      }
    message.loading({
        content: 'Loading...',
        key:'updatable',
        duration:1
      });
    axios.defaults.headers = {
      'Content-Type':'application/json',
      'Authorization':`${context.userToken}`
    }
    axios.get(AssignmentApi.check(id)).then(res=>{
      if(!res.data.taken){
        axios.get(AssignmentApi.details(id)).then(res=>{
          if(res.status === 200){
              setValues(res.data)
              message.success({
                  content: 'Loaded',
                  key:'updatable',
                  duration:1
                });
              
              setLoading(false)
              document.title = `${values.title}`    
          }
      }).catch(err =>{
        switch(err.response.status){
            case 400:
              message.error({
                content: err.message,
                key:'updatable',
                duration:1
              })
              navigate('/')
              break
              case 401:
                message.error({
                  content: "You need to be authenticated in order to view an assignment",
                  key:'updatable',
                  duration:1
                })
                navigate('/')
                break
              case 404:
                message.error({
                  content: "Page not Found",
                  key:'updatable',
                  duration:1
                })
                navigate('/')
                break
              default:
                message.error(
                  {
                    content: "An Error Occurred",
                    key:'updatable',
                    duration:1
                  }
                )
                navigate('/')
        }  
      })
      }
      else{
        message.info(
          {
            content: "You have already taken this assignment",
            key:'assignmentCheck',
            duration:1
          }
        )
        navigate('/')
      }
    }).catch(err=>{
      console.log(err)
      message.error("an error occurred")
      navigate('/')
    })
    
    
    },[])
    
    return (
  <> 
    <Link to={'/'}><CaretLeftFilled />Back</Link>
    <Card title={values.title||"Loading"} style={{marginTop:'15px'}}>
      {loading && <Skeleton active />}
      {!loading && <Questions assignmentId = {values.id} questions={values.questions}></Questions>}
    </Card>
  </>
    );
};

export default PostDetails;
