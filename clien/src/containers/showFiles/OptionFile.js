import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import copy from 'copy-to-clipboard';
import { Row, Col, Icon, Tooltip, Modal, Radio, message } from "antd";
import { actions as FilesActions } from '../../reducers/files';
import { actions as ShareFilesActions } from '../../reducers/shareFiles';
import { linkDownload } from '../../util/files';

const { delete_files } = FilesActions;
const { share_file } = ShareFilesActions;
const RadioGroup = Radio.Group;

function mapStateToProps(state) {
  return {
    shareInfo: state.shareFiles.shareInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    delete_files: bindActionCreators(delete_files, dispatch),
    share_file: bindActionCreators(share_file, dispatch),
  };
}

const Folder = ({ renameFile, deleteFile }) => {
  return (
    <Row>
      <Col span={4} offset={16} onClick={renameFile}>
        <Tooltip title="重命名">
          <Icon type="edit" className={"fileCellOptionBtn"} />
        </Tooltip>
      </Col>
      <Col span={4} onClick={deleteFile}>
        <Tooltip title="删除">
          <Icon type="delete" className={"fileCellOptionBtn"} />
        </Tooltip>
      </Col>
    </Row>
  );
}

const File = ({ renameFile, deleteFile, downloadFile, showShareModal }) => {
  return (
    <Row>
      <Col span={4}>
      </Col>
      <Col span={4}>
        {/* <Tooltip title="文件信息">
          <Icon type="info-circle" className={"fileCellOptionBtn"} />
        </Tooltip> */}
      </Col>
      <Col span={4} onClick={renameFile}>
        <Tooltip title="重命名">
          <Icon type="edit" className={"fileCellOptionBtn"} />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="分享" onClick={showShareModal}>
          <Icon type="share-alt" className={"fileCellOptionBtn"} />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="下载" onClick={downloadFile}>
          <Icon type="download" className={"fileCellOptionBtn"} />
        </Tooltip>
      </Col>
      <Col span={4}>
        <Tooltip title="删除" onClick={deleteFile}>
          <Icon type="delete" className={"fileCellOptionBtn"} />
        </Tooltip>
      </Col>
    </Row>
  );
}

class OptionFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: "",
      visible: false,
      duration: 1,
      security: 1,
      okText: ""
    }
  }

  downloadFile = e => {
    linkDownload(this.props.file.file_id)
  }

  deleteFile = e => {
    let list = [];
    let file = {
      file_id: this.props.file.file_id,
      type: this.props.file.type
    }
    list.push(file);
    this.props.delete_files(list);
  }

  showShareModal = e => {
    this.setState({
      visible: true,
      action: "setting",
      okText: "确定"
    })
  }

  handleOk = e => {
    if (this.state.action === "setting") {
      this.props.share_file(this.props.file.file_id, this.state.duration, this.state.security);
    } else if (this.state.action === "result") {
      //复制链接和提取码
      let origin = window.location.origin;
      let shareInfo = this.props.shareInfo;
      let info = `链接：${origin}/s/${shareInfo.share_id}`;
      if (shareInfo.token) {
        info = `${info}\n提取码：${shareInfo.token}`;
      }
      this.copyInfo(info);
    }
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  chooseDuration = e => {
    this.setState({
      duration: e.target.value,
    });
  };

  chooseSecurity = e => {
    this.setState({
      security: e.target.value,
    });
  };

  copyInfo = (value) => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  }

  render() {
    let origin = window.location.origin;

    return (
      <div>
        {
          this.props.file.type === 1 ?
            <Folder
              renameFile={this.props.renameFile}
              deleteFile={this.deleteFile}
            /> :
            <File
              renameFile={this.props.renameFile}
              deleteFile={this.deleteFile}
              downloadFile={this.downloadFile}
              showShareModal={this.showShareModal}
            />
        }
        <Modal
          title="分享"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={this.state.okText}
          cancelText="取消"
        >
          {
            this.state.action === 'setting' &&
            <Row>
              <Col>分享时长</Col>
              <Col>
                <RadioGroup onClick={e => e.stopPropagation} onChange={this.chooseDuration} value={this.state.duration}>
                  <Radio value={1} onClick={e => e.stopPropagation}>1天</Radio>
                  <Radio value={7} onClick={e => e.stopPropagation}>7天</Radio>
                  <Radio value={30} onClick={e => e.stopPropagation}>30天</Radio>
                  <Radio value={-1} onClick={e => e.stopPropagation}>永久</Radio>
                </RadioGroup>
              </Col>
              <Col>分享形式</Col>
              <Col>
                <RadioGroup onClick={e => e.stopPropagation} onChange={this.chooseSecurity} value={this.state.security}>
                  <Radio value={1}>公开的</Radio>
                  <Radio value={2}>私密的</Radio>
                </RadioGroup>
              </Col>
            </Row>
          }
          {
            this.state.action === 'result' &&
            <Row>
              <Col>
                链接：{origin + '/s/' + this.props.shareInfo.share_id}
                <Icon type="copy" onClick={this.copyInfo.bind(this, (origin + '/s/' + this.props.shareInfo.share_id))} />
              </Col>
              {this.props.shareInfo.token ?
                <Row>
                  <Col>
                    提取码：{this.props.shareInfo.token}
                    <Icon type="copy" onClick={this.copyInfo.bind(this, (this.props.shareInfo.token))} />
                  </Col>
                </Row> :
                <Row>公开的分享</Row>
              }
            </Row>
          }
        </Modal>
      </div>
    )
  }
  componentWillReceiveProps() {
    if (this.props.shareInfo !== {}) {
      this.setState({
        action: "result",
        okText: "复制分享信息"
      });
    }
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(OptionFile);