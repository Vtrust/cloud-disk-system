import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Icon } from "antd";
import { bindActionCreators } from 'redux';
import { actions as MoveFilesActions } from "../../reducers/moveFiles";

const { select_folder } = MoveFilesActions;


const FolderCell = (folder) => {
  return (
    <Row key={folder.file_id}>
      <Col>{folder.file_name}</Col>
    </Row>
  )
}


class MoveFiles extends Component {
  componentDidMount() {
    this.props.select_folder(1);
  }

  render() {
    let list = this.props.list;
    return (
      <div>
        <Row>
          <Col><Icon type="arrow-left" />返回上级</Col>
          <Col>当前目录</Col>
        </Row>
        {
          list.map(item=>{
            return(
              FolderCell(item)
            );
          })
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.moveFiles.list
  };
}
function mapDispatchToProps(dispatch) {
  return {
    select_folder: bindActionCreators(select_folder, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MoveFiles);