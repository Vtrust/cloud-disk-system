import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Checkbox, Icon, Input, Tooltip } from "antd";
import { bindActionCreators } from 'redux';
import { actions } from '../../reducers/files';
import { formatSize,linkDownload } from '../../util/files';
const { select_file, delete_files } = actions;

const OptionFile = (file, edit, deleteFile) => {
  return (
    <Row>
      <Col span={4} offset={16}>
        <Tooltip title="重命名">
          <Icon type="edit" onClick={edit}  className={"fileCellOptionBtn"}/>
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="删除">
          <Icon type="delete" onClick={deleteFile}  className={"fileCellOptionBtn"}/>
        </Tooltip>
      </Col>
    </Row>
  );
}

const OptionFolder = (file, edit, deleteFile,downloadFile) => {
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
          <Icon type="info-circle" className={"fileCellOptionBtn"} />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="重命名">
          <Icon type="edit" onClick={edit} className={"fileCellOptionBtn"} />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="复制链接">
          <Icon type="link" className={"fileCellOptionBtn"} />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="下载">
          <Icon type="download" onClick={downloadFile} className={"fileCellOptionBtn"} />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="删除" >
          <Icon type="delete" onClick={deleteFile} className={"fileCellOptionBtn"} />
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
    this.deleteFile = this.deleteFile.bind(this);
    this.state = {
      edit: this.props.edit,
      file_name: this.props.file.file_name
    }
  }

  onCheck = e => {
    //e.preventDefault();
    e.stopPropagation();
    console.log('checked = ', e.target.checked);
    this.props.select_file(this.props.file.file_id, e.target.checked);
  };

  onEdit = e => {
    e.preventDefault();
    this.setState({
      edit: !this.state.edit
    })
  };

  deleteFile = e => {
    e.preventDefault();
    let list = [];
    let file = {
      file_id: this.props.file.file_id,
      type: this.props.file.type
    }
    list.push(file);
    console.log(list);

    this.props.delete_files(list);
  }

  downloadFile = e =>{
    e.preventDefault();
    linkDownload(this.props.file.file_id)
  }

  inputFileName = e => {
    e.preventDefault();
    this.setState({
      file_name: e.target.value
    })
  }

  render() {
    const file = this.props.file;
    return (
      <Row className={file.type === 1 ? 'folderCell' : 'fileCell'} type="flex" justify="space-around" align="middle">
        <Col span={1} className={"checkBox"}>
          <Checkbox
            checked={file.checked}
            onClick={this.onCheck}
          >
          </Checkbox>
        </Col>
        <Col span={1}>
          <Icon type={file.suffix} style={{ fontSize: '28px' }} />
        </Col>
        <Col span={11}>
          {this.state.edit ?
            <Input value={this.state.file_name} onChange={this.inputFileName} /> :
            this.state.file_name
          }</Col>
        <Col span={4} offset={1} className="fileCellOption">
          {file.type === 1 ?
            OptionFile(file, this.onEdit, this.deleteFile) :
            OptionFolder(file, this.onEdit, this.deleteFile,this.downloadFile)
          }
        </Col>
        <Col span={2} offset={1}>{file.size === '-' ? '-' : formatSize(file.size)}</Col>
        <Col span={3}>{file.update}</Col>
      </Row >
    );
  }
}

FIleCell.defaultProps = {
  edit: false
};

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    select_file: bindActionCreators(select_file, dispatch),
    delete_files: bindActionCreators(delete_files, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FIleCell);