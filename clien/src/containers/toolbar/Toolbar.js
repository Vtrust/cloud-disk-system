import React, { Component } from 'react';
import { Row, Col, Icon, Button, Input, Breadcrumb, Modal } from "antd";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import style from './style.css'
import { actions } from '../../reducers/files';
import MyUpload from '../upload/MyUpload';
import UploadList from '../upload/UploadList';

const { select_all_file, unselect_all_file, create_folder, delete_files } = actions;

const ButtonGroup = Button.Group;
const Search = Input.Search;

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.selectAll = this.selectAll.bind(this);
    this.deleteFiles = this.deleteFiles.bind(this);
    this.state = {
      size: 'default',
      visible: false,
      newfolder: "",
    }
  }


  selectAll() {
    this.setState({
      select_all: !this.state.select_all
    })
    if (!this.props.select_all) {
      this.props.select_all_file();
    } else {
      this.props.unselect_all_file();
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.props.create_folder(this.state.newfolder, this.props.path);
    this.setState({
      visible: false,
      newfolder: ""
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  inputNewFolder = e => {
    console.log(e.target.value);
    this.setState({
      newfolder: e.target.value
    })
  }

  deleteFiles = e => {
    let files = [];
    this.props.files.forEach(element => {
      if (element.checked === true) {
        files.push({
          file_id: element.file_id,
          type: element.type
        })
      }
    })
    console.log(files);
    this.props.delete_files(files);
    this.props.unselect_all_file();

  }

  render() {
    const size = this.state.size;
    const paths = this.props.paths;
    const checkeNum = this.props.checkeNum;
    const select_all = this.props.select_all;
    return (
      <div>
        <Row className={"link"}>
          <Col span={24}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/disk/folder/root">
                  <Icon type="home" />
                  <span>  全部文件</span>
                </Link>
              </Breadcrumb.Item>
              {
                paths.map((path) => {
                  return (
                    <Breadcrumb.Item key={path.file_id}>
                      <Link to={`/disk/folder/${path.file_id}`}>
                        <span>{path.file_name}</span>
                      </Link>
                    </Breadcrumb.Item>
                  );
                })
              }
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <ButtonGroup>
              {select_all ?
                <Button type="primary" icon="minus-square" size={size} onClick={this.selectAll}>
                  取消全选
                </Button> :
                <Button type="primary" icon="check-square" size={size} onClick={this.selectAll}>
                  全选
                </Button>
              }

              {checkeNum > 0 &&
                <Button type="primary" icon="delete" size={size} onClick={this.deleteFiles}>
                  删除
                </Button>
              }
              {checkeNum > 0 &&
                <Button type="primary" icon="arrow-right" size={size}>
                  移动
                </Button>
              }
              <MyUpload>
                上传文件
              </MyUpload>
              <Button type="primary" icon="folder-add" size={size} onClick={this.showModal}>
                创建文件夹
              </Button>
              <Modal
                title="创建文件夹"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="确认"
                cancelText="取消"
              >
                <Input placeholder="输入名称" value={this.state.newfolder} onChange={this.inputNewFolder} />
              </Modal>
            </ButtonGroup>
          </Col>
          <Col span={8}>
            <Search placeholder="查找文件" onSearch={value => console.log(value)} enterButton />
          </Col>
        </Row>
        <UploadList />
      </div>
    );
  }
}
function mapStateToProps(state) {
  let select_all = true;
  for (let i = 0; i < state.files.list.length; i++) {
    if (state.files.list[i].checked === false) {
      select_all = false;
      break;
    }
  }
  if (state.files.list.length == 0) select_all = false;
  return {
    path: state.files.path,
    paths: state.files.paths,
    checkeNum: state.files.checkeNum,
    select_all: select_all,
    files: state.files.list
  }
}
function mapDispatchToProps(dispatch) {
  return {
    select_all_file: bindActionCreators(select_all_file, dispatch),
    unselect_all_file: bindActionCreators(unselect_all_file, dispatch),
    create_folder: bindActionCreators(create_folder, dispatch),
    delete_files: bindActionCreators(delete_files, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);