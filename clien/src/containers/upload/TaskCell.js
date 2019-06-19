import React, { Component } from 'react';
import { Row, Col, Progress } from 'antd';
import {formatSize} from '../../util/files';

class TaskCell extends Component {
  render() {
    let task = this.props.task;
    return (
      <Row style={{ padding: '5px'}}  type="flex" justify="space-around" align="middle">
        <Col span={8}>{task.name}</Col>
        <Col span={2}>{task.message}</Col>
        <Col span={4} style={{textAlign:'center'}}>{formatSize(task.uploadSize)}/{formatSize(task.size)}</Col>
        <Col span={10}>
          <Progress percent={task.percent} />
        </Col>
      </Row>
    );
  }
}

export default TaskCell;