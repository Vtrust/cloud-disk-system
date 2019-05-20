import React from 'react';
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Menu, Icon } from 'antd';

const LogoutNav = withRouter((location) => {
  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['/login']} selectedKeys={[location.pathname]} >
      <Menu.Item key="/login">
        <Link to="/login">
          <Icon type="login" />
          <span className="nav-text">登陆</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/register">
        <Link to="/register">
          <Icon type="user-add" />
          <span className="nav-text">注册</span>
        </Link>
      </Menu.Item>
    </Menu>
  );
});

export default LogoutNav;