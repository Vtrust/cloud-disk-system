import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Checkbox, Icon, Input, Tooltip } from "antd";
import { bindActionCreators } from 'redux';
import { actions } from '../../reducers/files';
import {formatSize} from '../../util/files';
const { select_file } = actions;

const OptionFile = (file, edit) => {
  return (
    <Row>
      <Col span={4} offset={16}>
        <Tooltip title="重命名">
          <Icon type="edit" onClick={edit} />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="删除">
          <Icon type="delete" />
        </Tooltip>
      </Col>
    </Row>
  );
}

const OptionFolder = (file, edit) => {
  return (
    <Row>
      <Col span={4}>
        {/* {file.lock ?
          <Icon type="lock" /> :
          <Icon type="unlock" />
        } */}
      </Col>
      <Col span={4}>
        <Tooltip title="文件信息">
          <Icon type="info-circle" />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="重命名">
          <Icon type="edit" onClick={edit} />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="复制链接">
          <Icon type="link" />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="下载">
          <Icon type="download" />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="删除">
          <Icon type="delete" />
        </Tooltip>
      </Col>
    </Row>
  );
}

class FIleCell extends Component {
  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.state = {
      edit: this.props.edit,
    }
  }

  onCheck = e => {
    //e.preventDefault();
    e.stopPropagation();
    console.log('checked = ', e.target.checked);
    this.props.select_file(this.props.file.file_id,e.target.checked);
  };

  onEdit = e => {
    e.preventDefault();
    this.setState({
      edit:!this.state.edit
    })
  };

  render() {
    const file = this.props.file;
    return (
      <Row className={file.type === 'folder' ? 'folderCell' : 'fileCell'} type="flex" justify="space-around" align="middle">
        <Col span={1} className={"checkBox"}>
          <Checkbox
            checked={file.checked}
            onClick={this.onCheck}
          >
          </Checkbox>
        </Col>
        <Col span={1}>
          <Icon type={file.type} style={{ fontSize: '28px' }} />
        </Col>
        <Col span={11}>
          {this.state.edit ?
            <Input value={file.file_name} /> :
            file.file_name
          }</Col>
        <Col span={4} offset={1}>
          {file.type === 'folder' ?
            OptionFile(file, this.onEdit) :
            OptionFolder(file, this.onEdit)
          }
        </Col>
        <Col span={2} offset={1}>{file.size==='-'?'-':formatSize(file.size)}</Col>
        <Col span={3}>{file.update}</Col>
      </Row >
    );
  }
}

FIleCell.defaultProps = {    
  edit:false
};

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch){
  return {
    select_file: bindActionCreators(select_file, dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FIleCell);