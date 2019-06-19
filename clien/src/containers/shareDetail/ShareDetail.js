import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Input, PageHeader, Button, message } from 'antd';
import { actions as shareFilesActions } from '../../reducers/shareFiles';
import { bindActionCreators } from 'redux';
import { previewFileTypeByName, linkDownload } from '../../util/files';
import FileMdal from '../showShareFiles/FileMdal';
// import FileCell from './FileCell'
import moment from 'moment';

const Search = Input.Search;
const { get_other_share } = shareFilesActions;

function mapStateToProps(state) {
  console.log(state.shareFiles.otherShare);
  if (state.shareFiles.otherShare.type === 2) {
    message.error('提取码错误！');
  }

  return {
    otherShare: state.shareFiles.otherShare
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_other_share: bindActionCreators(get_other_share, dispatch)
  };
}

class ShareDetail extends Component {
  state = {
    contentVisible: false
  }
  getFile = token => {
    let share_id = this.props.match.params.share_id;
    this.props.get_other_share(share_id, token);
  }
  download = e => {
    linkDownload(this.props.otherShare.fileInfo.file_id);
  }

  showContent = e => {
    this.setState({
      contentVisible: true
    })
  }
  contentHandCancel = e => {
    this.setState({
      contentVisible: false
    })
  }
  /*链接：http://localhost:3000/s/0f5d5a50-814a-11e9-ac39-e151826795a9
  2uPL */
  render() {
    let otherShare = this.props.otherShare;
    let file = otherShare.fileInfo;
    return (
      <div>
        <PageHeader title="分享详情" />
        {
          otherShare && otherShare.type === -2 &&

          <Row style={{ marginTop: "20vh", fontSize: "20px" }}>
            <Col span={10} offset={7}>
              该分享已过期
            </Col>
          </Row>
        }
        {
          otherShare && otherShare.type === -1 &&

          <Row style={{ marginTop: "20vh", fontSize: "20px" }}>
            <Col span={10} offset={7}>
              找不到该分享
            </Col>
          </Row>
        }
        {
          otherShare && (otherShare.type === 1 || otherShare.type === 0 || otherShare.type === 4) &&//输入正确提取码
          <Row style={{ marginTop: "20vh", fontSize: "20px" }}>
            <Col span={10} offset={7}>
              <Col>分享用户：{file.username}</Col>
              <Col>文件名：{file.file_name}</Col>
              <Col>分享时间：{file.create_time}</Col>
              <Col>到期时间：{file.expire_time}</Col>
              <Col>
                <Col span={8}>
                  <Button onClick={this.showContent}>预览</Button>
                </Col>
                <Col span={8}>
                  <Button onClick={this.download}>下载</Button>
                </Col>
              </Col>
            </Col>
            <FileMdal
              title={file.file_name}
              visible={this.state.contentVisible}
              onCancel={this.contentHandCancel}
              url={`/api/disk/preview?file_id=${file.file_id}`}
              type={file && file.file_name ? previewFileTypeByName(file.file_name) : -1}
            />
          </Row>

        }
        {
          otherShare && (otherShare.type === 3 || otherShare.type === 2) &&
          <Row style={{ marginTop: "20vh", fontSize: "20px" }}>
            <Col span={10} offset={7}>
              <Col>分享用户：{otherShare.fileInfo.username}</Col>
              <Col>文件名：{otherShare.fileInfo.file_name}</Col>
              <Col>分享时间：{otherShare.fileInfo.create_time}</Col>
              <Search
                placeholder="输入提取码"
                enterButton="提取文件"
                size="large"
                onSearch={value => this.getFile(value)}
              />
            </Col>
          </Row>
        }
        {

        }

      </div>
    );
  }

  componentDidMount() {
    let share_id = this.props.match.params.share_id;
    this.props.get_other_share(share_id);
    console.log(share_id);

  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(ShareDetail);