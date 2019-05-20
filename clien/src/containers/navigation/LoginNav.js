import React from 'react';
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Menu, Icon } from 'antd';

const LoginNav = withRouter(({ location, submitLogout }) => {
  return (
    <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} >
      <Menu.Item key="/disk/folder/*">
        <Link to="/disk/folder/root">
          <Icon type="appstore" />
          <span className="nav-text">全部文件</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/disk/doc">
        <Link to="/">
          <Icon type="file-word" />
          <span className="nav-text">文档</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/disk/image">
        <Link to="/disk/image">
          <Icon type="picture" />
          <span className="nav-text">图片</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/disk/music">
        <Link to="/disk/music">
          <Icon type="customer-service" />
          <span className="nav-text">音乐</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/disk/video">
        <Link to="/disk/video">
          <Icon type="play-square" />
          <span className="nav-text">视频</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/disk/start">
        <Link to="/disk/start">
          <Icon type="star" />
          <span className="nav-text">收藏</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/logout" onClick={submitLogout}>
        <Icon type="logout" />
        <span className="nav-text">登出</span>
      </Menu.Item>
    </Menu>
  );
});

export default LoginNav;