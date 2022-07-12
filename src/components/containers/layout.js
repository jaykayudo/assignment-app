import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserAddOutlined,
    UserOutlined,
    UnorderedListOutlined,
    PlusOutlined,
    LoginOutlined,
    LogoutOutlined
  } from '@ant-design/icons';
  import { Layout, Menu, message } from 'antd';

  import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
  const { Header, Sider, Content } = Layout;


  const CustomLayout = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const navItem = [
      {
        key: '3',
        icon: <UserAddOutlined />,
        label: 'SignUp',
        onClick: ()=>(navigate('/register'))
      },
    ]
    if(context.isLoggedIn){
      navItem.push({
        key: '4',
        icon: <UserOutlined />,
        label: "Profile",
        onClick: ()=>(navigate('/profile'))
      })
      navItem.unshift(
        {
          key: '1',
          icon: <UnorderedListOutlined />,
          label: 'All Assignments',
          onClick: ()=>(navigate('/')),
        },
        {
          key: '2',
          icon: <PlusOutlined />,
          label: 'Create Assignments',
          onClick: ()=>(navigate('/create-assignment'))
        },
      )
    }
    const LogUserOut = ()=>{
      context.logUserOut()  
      message.success("Logout Successful")
    }
    return (
      <Layout style={{minHeight:'100vh'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={navItem}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: "0 10px",
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center"
            }}
          >
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              style:{color:"white",fontSize:"18px"},
              onClick: () => setCollapsed(!collapsed),
            })}
           {
            !context.isLoggedIn &&
            <Link to='/login' title="Login">
            <span style={{color:"white",fontSize:"18px"}}>
              <LoginOutlined />
            </span>
            </Link>
            
           }
           {
            context.isLoggedIn &&
            <div onClick={LogUserOut} title='Logout'>
            <span style={{color:"white",fontSize:"18px"}}>
              <LogoutOutlined />
            </span>
            </div>
            
           }
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    );
  };
  
  export default CustomLayout;