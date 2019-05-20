import React, { Component } from 'react';
import { Row, Col, Icon, Button, Input, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import style from './style.css'
import { actions } from '../../reducers/files';
import MyUpload from '../upload/MyUpload';
import UploadList from '../upload/UploadList';

const { select_all_file, unselect_all_file } = actions;

const ButtonGroup = Button.Group;
const Search = Input.Search;

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.selectAll = this.selectAll.bind(this);
    this.state = {
      size: 'default'
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

  render() {
    const size = this.state.size;
    const paths = this.props.paths;
    const checked = this.props.checked;
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

              {checked &&
                <Button type="primary" icon="delete" size={size}>
                  删除
                </Button>
              }
              {checked &&
                <Button type="primary" icon="arrow-right" size={size}>
                  移动
                </Button>
              }
              <MyUpload>
          
                  上传文件
       
              </MyUpload>

              {/* <Upload style={{display:"inline-block"}}>
                <Button type="primary" icon="upload" size={size}>
                上传文件
                </Button>
                </Upload> */}


              <Button type="primary" icon="folder-add" size={size}>
                创建文件夹
            </Button>
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
    paths: state.files.paths,
    checked: state.files.checked,
    select_all: select_all,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    select_all_file: bindActionCreators(select_all_file, dispatch),
    unselect_all_file: bindActionCreators(unselect_all_file, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);