import React, { Component } from 'react';
import { Modal } from 'antd';

class FileMdal extends Component {
  render() {
    let { url, visible, handleOk, onCancel, title, type } = this.props;
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={handleOk}
          onCancel={onCancel}
          footer={null}
          width={'80vw'}
          centered={true}
          destroyOnClose={true}
        >
          {type === -1 && "暂时不支持文件显示"}
          {type === 1 && <iframe title={"pdf"} src={url} style={{ width: '100%', height: '80vh', border: 0 }} ></iframe>}
          {type === 2 && <img alt={"预览图"} src={url} style={{ width: '100%' }} />}
          {type === 3 && <iframe  title={"video"}  src={url} style={{ width: '100%', height: '80vh', border: 0 }} ></iframe>}
          {type === 4 && <iframe  title={"office"}  src="https://view.officeapps.live.com/op/embed.aspx?src=https://tank.eyeblue.cn/api/alien/preview/6ac88cb4-5bf8-40ae-6e28-2250e5773143/大连理工大学本科毕业设计（论文）模板（2018年10月修订）.doc?downloadTokenUuid=b74fa22a-6857-4f2d-5fc9-1e0cf88ba631" style={{ width: '100%', height: '80vh', border: 0 }}></iframe>}
        </Modal>
      </div>
    );
  }
}

export default FileMdal;