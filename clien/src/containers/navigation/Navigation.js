import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../reducers/user';
import LoginNav from './LoginNav';
import LogoutNav from './LogoutNav';
import { Layout } from 'antd';
const { Sider } = Layout;


class Navigation extends Component {
  render() {
    return (
      <Sider style={{
        overflow: 'auto', height: '100vh', position: 'fixed', left: 0,paddingTop:'40px'
      }}>
        {(this.props.userInfo && this.props.userInfo.level) ? <LoginNav submitLogout={this.props.submitLogout} /> : <LogoutNav />}
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  return { userInfo: state.user.userInfo };
}

function mapDispatchToProps(dispatch) {
  return {
    submitLogout: () => {
      dispatch(actions.get_logout());
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Navigation);