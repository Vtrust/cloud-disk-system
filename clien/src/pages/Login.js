import React from 'react';
import {
  Row, Col
} from 'antd';
import {view as LoginFrom} from '../components/Login/'

const Register = () => {
  return (
    <Row>
      <Col xs={{ span: 22, offset: 1}} md={{ span: 12, offset: 6 }}>
        <LoginFrom></LoginFrom>
      </Col>
    </Row>
  )
}

export default Register
