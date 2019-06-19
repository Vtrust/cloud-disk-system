import React, { Component } from 'react';
import { Row, Col, Icon, Button, Input, Breadcrumb, Modal } from "antd";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../reducers/files';
import MyUpload from '../upload/MyUpload';
import UploadList from '../upload/UploadList';
import MoveFiles from './MoveFiles';
import style from './style.css'

const { select_all_file, unselect_all_file, create_folder, delete_files,search_files } = actions;

const ButtonGroup = Button.Group;
const Search = Input.Search;

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.selectAll = this.selectAll.bind(this);
    this.deleteFiles = this.deleteFiles.bind(this);
    this.state = {
      action: '',
      size: 'default',
      visible: false,
      newfolder: "",
      title:'',
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

  showNewFolderModal = () => {
    this.setState({
      action: 'newFolder',
      visible: true,
      title:'新建文件夹'
    });
  };

  
  showMoveFilesModal = () => {
    this.setState({
      action: 'moveFiles',
      visible: true,
      title:'移动文件'
    });
  };

  handleOk = e => {
    //console.log(e);
    let action = this.state.action;
    if(action==='newFolder'){
      this.props.create_folder(this.state.newfolder, this.props.path);
      this.setState({
        visible: false,
        newfolder: ""
      });
    }else if(action === 'moveFiles'){

    }

  };

  handleCancel = e => {
    //console.log(e);
    this.setState({
      visible: false,
    });
  };

  inputNewFolder = e => {
    //console.log(e.target.value);
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
    //console.log(files);
    this.props.delete_files(files);
    this.props.unselect_all_file();

  }

  render() {
    const size = this.state.size;
    const paths = this.props.paths;
    const select_all = this.props.select_all;
    const select = this.props.select;
    return (
      <div>
        <Row className={"link"}>
          <Col span={24}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/disk/folder/root">
                  <Icon type="home" />
                  <span>  Root</span>
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
              {
                select_all ?
                <Button type="primary" icon="minus-square" size={size} onClick={this.selectAll}>
                  取消全选
                </Button> :
                <Button type="primary" icon="check-square" size={size} onClick={this.selectAll}>
                  全选
                </Button>
              }

              {
                select &&
                <Button type="primary" icon="delete" size={size} onClick={this.deleteFiles}>
                  删除
                </Button>
              }
              {
                false &&
                <Button type="primary" icon="arrow-right" size={size} onClick={this.showMoveFilesModal}>
                  移动
                </Button>
              }
              <MyUpload>
                上传文件
              </MyUpload>
              <Button type="primary" icon="folder-add" size={size} onClick={this.showNewFolderModal}>
                创建文件夹
              </Button>
            </ButtonGroup>
          </Col>
          <Col span={8}>
            <Search placeholder="查找文件" onSearch={value => value!==''&&this.props.search_files(value)} enterButton />
          </Col>
        </Row>
        <UploadList />
        <Modal
          title={this.state.title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
         {this.state.action ==='newFolder'&& <Input placeholder="输入名称" value={this.state.newfolder} onChange={this.inputNewFolder} />}
         {this.state.action ==='moveFiles'&& <MoveFiles/>}
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let select_all = true;
  let select = false;
  for (let i = 0; i < state.files.list.length; i++) {
    if (state.files.list[i].checked === false) {
      select_all = false;
      break;
    }
  }
  for (let i = 0; i < state.files.list.length; i++) {
    if (state.files.list[i].checked === true) {
      select = true;
      break;
    }
  }
  if (state.files.list.length === 0) {
    select_all = false;
    select = false;
  }
  return {
    path: state.files.path,
    paths: state.files.paths,
    select_all: select_all,
    files: state.files.list,
    select:select
  }
}

function mapDispatchToProps(dispatch) {
  return {
    select_all_file: bindActionCreators(select_all_file, dispatch),
    unselect_all_file: bindActionCreators(unselect_all_file, dispatch),
    create_folder: bindActionCreators(create_folder, dispatch),
    delete_files: bindActionCreators(delete_files, dispatch),
    search_files:bindActionCreators(search_files, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);