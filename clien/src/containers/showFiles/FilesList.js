import React, { Component } from 'react';
import { Link } from "react-router-dom";
import FileCell from "./FileCell";
import { Modal } from 'antd';
import { previewFileType } from '../../util/files';

class FilesList extends Component {
  state = {
    visible: false,
    file_id: "",
    file_name: "",
    type: "",
  };

  showFileModal = (file) => {
    this.setState({
      visible: true,
      file_id: file.file_id,
      file_name: file.file_name,
      type: previewFileType(file.suffix)
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
      file_id: "",
      file_name: "",
      type: ""
    });
  };

  render() {
    let files = this.props.files;
    let type = this.state.type;
    //console.log(this.state);

    let url = `/api/disk/preview?file_id=${this.state.file_id}`
    return (
      <div>
        {
          files.map((file) => {
            if (file.type === 1) {
              return (
                <Link key={file.file_id} to={`/disk/folder/${file.file_id}`} style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.65)' }}>
                  <FileCell file={file} />
                </Link>
              );
            } else {
              return (
                <FileCell showFileModal={this.showFileModal} key={file.file_id} file={file} />
              );
            }
          })
        }
        <Modal
          title={this.state.file_name}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width={'80vw'}
          centered={true}
        >
          {type === -1 && "暂时不支持文件显示"}
          {type === 1 && <iframe src={url} style={{ width: '100%', height: '80vh', border: 0 }} ></iframe>}
          {type === 2 && <img src={url} style={{ width: '100%' }} />}
          {type === 3 && <iframe src={url} style={{ width: '100%', height: '80vh', border: 0 }} ></iframe>}
          {type === 4 && <iframe src="https://view.officeapps.live.com/op/embed.aspx?src=https://tank.eyeblue.cn/api/alien/preview/6ac88cb4-5bf8-40ae-6e28-2250e5773143/大连理工大学本科毕业设计（论文）模板（2018年10月修订）.doc" style={{ width: '100%', height: '80vh', border: 0 }}></iframe>}
        </Modal>
      </div>
    );
  }
}

export default FilesList;