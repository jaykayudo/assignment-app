import { Avatar, List, message, Divider } from 'antd';
import React, { Component } from 'react';
import axios from 'axios';
import AuthContext from './context/AuthContext';
import AssignmentApi from './apis/assignmentapis'
import { Navigate, Link } from 'react-router-dom';

class AssignmentList extends Component {

    componentDidMount(){
      document.title = "Assignments"
      if(!localStorage.getItem('user')){
        window.location.assign('/login')
        return
      }
      axios.defaults.headers = {
        'Content-Type':'application/json',
        'Authorization':`${localStorage.getItem('token')}`
      }
      axios.get(AssignmentApi.list).then(res=>{
        if(res.status === 200){
          this.setState({posts: res.data})
        }
      }).catch(err=>{
        if(err.response.status === 401 ){
          message.error({
            content: "User is Unauthorized, Login First.",
            key:'updatable',
            duration:1
          })
          
        }
      })
    }
    renderItem(item){
      return (<Link to={`/${item.id}`}><List.Item>{item.title}</List.Item></Link>);
    }
    state = { posts:[], loaded:false } 
    render() {
        return (
          <AuthContext.Consumer>
            {(ctx)=>{
              {!ctx.userToken && <Navigate to={'/login'} replace={true}/>}
              return(
                <>
                <Divider orientation="left">Assignments</Divider>
                <List
                  size="large"
                  bordered
                  dataSource={this.state.posts}
                  renderItem={(item) => this.renderItem(item)}
                />
              </>
            )
               }}
        
        </AuthContext.Consumer>
    

        
      )} 
        
    }

 
export default AssignmentList;
