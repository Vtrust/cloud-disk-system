import React from 'react';
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Menu, Icon ,Avatar} from 'antd';

const LoginNav = withRouter(({ username,location, submitLogout, getTypeFiles }) => {
  return (
    <div>
      <div style={{width:70,margin:"0 auto"}}>
       <Avatar size={70}  style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
       </div>
       <div style={{width:100,margin:"20px auto",color:"#fff",textAlign:"center", fontSize:"20px"}}>{username}</div>
    <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} >
     
      <Menu.Item key="/disk/folder/">
        <Link to="/disk/folder/root">
          <Icon type="appstore" />
          <span className="nav-text">全部文件</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/disk/fileType/doc" >
        <Link to="/disk/fileType/doc">
          <Icon type="file-word" />
          <span className="nav-text">文档</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/disk/fileType/image">
        <Link to="/disk/fileType/image">
          <Icon type="picture" />
          <span className="nav-text">图片</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/disk/fileType/audio">
        <Link to="/disk/fileType/audio">
          <Icon type="customer-service" />
          <span className="nav-text">音乐</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/disk/fileType/video">
        <Link to="/disk/fileType/video">
          <Icon type="play-square" />
          <span className="nav-text">视频</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/disk/fileType/other">
        <Link to="/disk/fileType/other">
          <Icon type="question" />
          <span className="nav-text">其他</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/share">
        <Link to="/share">
          <Icon type="share-alt" />
          <span className="nav-text">我的分享</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/logout" onClick={submitLogout}>
      <Link to="/login">
        <Icon type="logout" />
        <span className="nav-text">登出</span>
        </Link>
      </Menu.Item>
    </Menu>
    </div>
  );
});

export default LoginNav;