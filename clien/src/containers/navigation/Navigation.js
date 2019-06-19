import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginNav from './LoginNav';
import LogoutNav from './LogoutNav';
import { actions as UserActions } from '../../reducers/user';
import { actions as FileActions } from '../../reducers/files';
import { Layout } from 'antd';
import { bindActionCreators } from 'redux'
const { Sider } = Layout;
const { get_type_files } = FileActions;
const { get_logout } = UserActions;


class Navigation extends Component {

  render() {
    return (
      <Sider style={{
        overflow: 'auto', height: '100vh', position: 'fixed', left: 0,paddingTop:'40px'
      }}>
        {(this.props.userInfo && this.props.userInfo.level) ? <LoginNav username={this.props.userInfo.username} submitLogout={this.props.get_logout} getTypeFiles={this.props.get_type_files}/> : <LogoutNav />}
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  return { userInfo: state.user.userInfo };
}

function mapDispatchToProps(dispatch) {
  return {
    get_logout:bindActionCreators(get_logout,dispatch),
    get_type_files:bindActionCreators(get_type_files,dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Navigation);