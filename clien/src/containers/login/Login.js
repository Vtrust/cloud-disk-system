import React from 'react';
import { Redirect } from 'react-router-dom'
import { Row, Col } from 'antd';
import { actions } from '../../reducers/user';
import { connect } from 'react-redux';
import LoginForm from './LoginFrom';

function Login({ userInfo,submitLogin }) {
  if (userInfo && userInfo.level) {
    console.log('跳转');
    
    return <Redirect to='/disk/folder/root' />
  }else{
    return (
      <div>
        <Row>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 10, offset: 6 }} style={{ textAlign: 'center', fontSize: '20px', padding: '150px 10px 20px 10px' }}>
            登陆
        </Col>
        </Row>
        <Row>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 6 }}>
            <LoginForm submitLogin={submitLogin} />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.user.userInfo,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    submitLogin: (username, password) => {
      dispatch(actions.post_login(username, password));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);