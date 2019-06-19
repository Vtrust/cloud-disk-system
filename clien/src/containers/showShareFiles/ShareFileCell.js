import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Icon, Tooltip, Tag } from 'antd';
import { actions as ShareFilesActions } from '../../reducers/shareFiles';
import { bindActionCreators } from 'redux';

const { delete_share } = ShareFilesActions;

function mapStateToProps(state) {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {
    delete_share: bindActionCreators(delete_share, dispatch)
  }
}

const OptionShareFile = ({ showShareInfo, downloadFile, deleteShare }) => {
  return (
    <Row>
      <Col span={8} onClick={showShareInfo}>
        <Tooltip title="分享详情">
          <Icon type="info-circle" />
        </Tooltip>
      </Col>
      <Col span={8} onClick={downloadFile}>
        <Tooltip title="下载">
          <Icon type="download" />
        </Tooltip>
      </Col>
      <Col span={8} onClick={deleteShare}>
        <Tooltip title="删除分享">
          <Icon type="delete" />
        </Tooltip>
      </Col>
    </Row>
  )
}

class ShareFileCell extends Component {

  showShareInfo = (e) => {
    this.props.showShareInfoModal(e, this.props.shareFile);
  }

  showContent = (e) => {
    console.log('showContent');
    this.props.showContentModal(e, this.props.shareFile);
  }

  downloadFile = () => {
    this.props.linkDownload(this.props.shareFile.file_id);
  }
  deleteShare = () => {
    this.props.delete_share(this.props.shareFile.share_id);
  }
  render() {
    let shareFile = this.props.shareFile;
    return (
      <div onClick={this.showContent} style={{ backgroundColor: "#fff", padding: "10px", marginTop: "2px", cursor: "pointer" }}>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={1}>
            <Icon type={shareFile.icon} style={{ fontSize: '28px' }} />
          </Col>
          <Col span={15}>
            {shareFile.file_name} &nbsp;
            {
              shareFile.expired &&
              <Tag color="red">已过期</Tag>
            }
          </Col>
          <Col span={2} onClick={e => { e.stopPropagation(); }}>
            <OptionShareFile
              showShareInfo={this.showShareInfo}
              downloadFile={this.downloadFile}
              deleteShare={this.deleteShare}
            />
          </Col>
          <Col span={3}>{shareFile.create_time}</Col>
          <Col span={3}>{shareFile.expire_time}</Col>
        </Row >
      </div>
    );
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(ShareFileCell);