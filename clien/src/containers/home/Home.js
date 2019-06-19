import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal,Icon,Row,Col } from 'antd';

import axios from 'axios';
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});
const instance = axios.create({
  timeout: 1000,
});
function mapStateToProps(state) {
  return {

  };
}
const Test = (click) =>{
  return (
    <Col span={4} onClick={click}>测试</Col>
  )
}

class Home extends Component {
  download = e => {
    axios.post('/api/disk/download', {
      hello: 'hello'
    }, {
        responseType: 'blob'
      }).then(res => {
        console.log(res);

        const content = res.data
        const blob = new Blob([content])

        let fileName = res.headers['content-disposition'].split("filename=")[1].split("\"")[1];

        console.log(fileName);

        if (!fileName) {
          fileName = 'unknow'
        }

        if ('download' in document.createElement('a')) { // 非IE下载
          console.log('非IE');

          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          // URL.revokeObjectURL(elink.href) // 释放URL 对象
          // document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      });
  }

  state = { visible: false };

  showModal = (e) => {
    console.log('click 3',e.target);
    
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  click2 = e=>{
    console.log('click 2',e.target);
    e.stopPropagation();
  }

  click1 = e=>{
    console.log('click 1',e.target);
  }
  render() {
    return (
      <div>
        <Button onClick={this.download}>下载</Button>
        <Button type="primary" >
          Open Modal
        </Button>
        <Row onClick={this.showModal}>
          <Row onClick={this.click2}>
          {Test(this.click2)}
          <Col span={4}>测试</Col>
          <Col span={4} onClick={this.click1}>测试</Col>
          </Row>
        </Row>

        <Modal
          title="文档"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width={'80vw'}
          centered={true}
        >
          {/* <img src={"/api/disk/preview"} style={{ width: '100%' }} /> */}
          {/* <video src="/api/disk/download" style={{ width: '100%' }} controls="controls">
            您的浏览器不支持 video 标签。
          </video> */}
          {/* <iframe src="https://view.officeapps.live.com/op/embed.aspx?src=https://tank.eyeblue.cn/api/alien/preview/af0890ff-3b6e-4b2f-6918-97a4d888a2f0/购销合同书范本_xiawenku.cn.docx?downloadTokenUuid=cf36b2c1-7688-41aa-572a-172e0b8b1c6b" style={{ width: '100%', height: '80vh' }} frameborder="0"></iframe> */}

        </Modal>

        <div className="icons-list">
          <IconFont type="icon-tuichu" />
          <IconFont type="icon-facebook" />
          <IconFont type="icon-twitter" />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(Home);
