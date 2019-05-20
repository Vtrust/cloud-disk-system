import React from 'react';
import { Row, Col } from 'antd';
import { actions } from '../../reducers/user';
import { connect } from 'react-redux';
import RegistrationForm from './RegisterFrom';



function RegisterBox({ submitRegister }) {
  return (
    <div>
      <Row>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 10, offset: 6 }} style={{ textAlign: 'center', fontSize: '20px', padding: '100px 10px 20px 10px' }}>
          注册
      </Col>
      </Row>
      <Row>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 8, offset: 6 }}>
          <RegistrationForm submitRegister={submitRegister} />
        </Col>
      </Row>
    </div>
  )
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    submitRegister: (username, password, email, phone) => {
      dispatch(actions.post_register(username, password, email, phone));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterBox);
