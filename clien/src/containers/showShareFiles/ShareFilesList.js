import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Row, Col, Modal, message, Icon, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import ShareFileCell from './ShareFileCell';
import { actions as ShareFilesActions } from '../../reducers/shareFiles';
import FileMdal from './FileMdal';
import { previewFileTypeByName,linkDownload } from '../../util/files';

const { get_share_files } = ShareFilesActions

function mapStateToProps(state) {
  return {
    list: state.shareFiles.list
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_share_files: bindActionCreators(get_share_files, dispatch)
  };
}

class ShareFilesList extends Component {
  state = {
    infoVisible: false,
    contentVisible: false,
    shareInfo: {}
  }

  showShareInfoModal = (e, shareInfo) => {
    this.setState({
      infoVisible: true,
      shareInfo: shareInfo
    })
  }

  infoHandleOK = e => {
    //复制链接和提取码
    let origin = window.location.origin;
    let shareInfo = this.state.shareInfo;
    let info = `链接：${origin}/s/${shareInfo.share_id}`;
    if (shareInfo.token) {
      info = `${info}\n提取码：${shareInfo.token}`;
    }
    this.copyInfo(info);
  }

  infoHandleCancel = e => {
    this.setState({
      infoVisible: false
    });
  };

  showContentModal = (e, shareInfo) => {
    console.log('clickshareInfo');

    this.setState({
      contentVisible: true,
      shareInfo: shareInfo
    })
  }

  contentHandCancel = e => {
    this.setState({
      contentVisible: false,
      shareInfo:{}
    });
  }

  copyInfo = (value) => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  }

  render() {
    let list = this.props.list;
    let origin = window.location.origin;
    let shareInfo = this.state.shareInfo;
    return (
      <div>
        {
          list.map(item => {
            return (
              <ShareFileCell
                showContentModal={this.showContentModal}
                linkDownload={linkDownload}
                key={item.share_id}
                shareFile={item}
                showShareInfoModal={this.showShareInfoModal}
                
              />
            )
          })
        }
        <Modal
          title="分享详情"
          visible={this.state.infoVisible}
          onOk={this.infoHandleOK}
          onCancel={this.infoHandleCancel}
          okText="复制分享信息"
          cancelText="取消"
        >
          <Row>
            <Col>
              文件名：{shareInfo.file_name}
            </Col>
            <Col>
              链接：{origin + '/s/' + shareInfo.share_id}
              <Tooltip title="复制链接">
                <Icon type="copy" onClick={this.copyInfo.bind(this, (origin + '/s/' + shareInfo.share_id))} />
              </Tooltip>
            </Col>
            {shareInfo.token ?
              <Row>
                <Col>
                  提取码：{shareInfo.token}
                  <Tooltip title="复制提取码">
                    <Icon type="copy" onClick={this.copyInfo.bind(this, (shareInfo.token))} />
                  </Tooltip>
                </Col>
              </Row> :
              <Row>公开的分享</Row>
            }
            <Col>创建时间：{shareInfo.create_time}</Col>
            <Col>过期时间：{shareInfo.expire_time}</Col>
          </Row>
        </Modal>
        <FileMdal
          title={shareInfo.file_name}
          visible={this.state.contentVisible}
          onCancel={this.contentHandCancel}
          url={`/api/disk/preview?file_id=${shareInfo.file_id}`}
          type={shareInfo&&shareInfo.file_name ? previewFileTypeByName(shareInfo.file_name):-1}
        />
      </div>
    );
  }
  componentDidMount() {
    this.props.get_share_files();
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(ShareFilesList);