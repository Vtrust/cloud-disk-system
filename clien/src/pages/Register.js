import React from 'react';
import {
  Row, Col
} from 'antd';
import {view as RegisterFrom} from '../components/Register/'

const Register = () => {
  return (
    <Row>
      <Col xs={{ span: 22, offset: 1}} md={{ span: 12, offset: 6 }}>
        <RegisterFrom></RegisterFrom>
      </Col>
    </Row>
  )
}

export default Register
