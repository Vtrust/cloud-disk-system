import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Checkbox, Icon, Input } from "antd";
import { bindActionCreators } from 'redux';
import { actions } from '../../reducers/files';
import { formatSize } from '../../util/files';
import OptionFiles from './OptionFile';

const { select_file, rename_file } = actions;

class FIleCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: this.props.edit,
      file_name: this.props.file.file_name,
    }
  }

  checkFile = e => {
    e.stopPropagation();
    this.props.select_file(this.props.file.file_id, e.target.checked);
  };

  renameFile = e => {
    e.stopPropagation();
    e.preventDefault();
    //console.log('adadadadadsa');

    this.setState({
      edit: !this.state.edit
    });
    //console.log(this.state.edit)
    if(this.state.edit&&this.props.file.file_name!==this.state.file_name){
      this.props.rename_file(this.props.file.file_id,this.state.file_name)
    }
  };

  clickFile = e => {
    const showFileModal = this.props.showFileModal;
    showFileModal && showFileModal(this.props.file);
  }

  inputFileName = e => {
    e.preventDefault();
    this.setState({
      file_name: e.target.value
    })
  }

  inputClick = e => {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const file = this.props.file;
    return (
      <div onClick={this.clickFile} >
        <Row id={"fileCell-" + file.file_id} className={file.type === 1 ? 'folderCell' : 'fileCell'} type="flex" justify="space-around" align="middle">
          <Col span={1} className={"checkBox"}>
            <Checkbox
              checked={file.checked}
              onClick={this.checkFile}>
            </Checkbox>
          </Col>
          <Col span={1}>
            <Icon type={file.icon} style={{ fontSize: '28px' }} />
          </Col>
          <Col span={11}>
            {this.state.edit ?
              <Input value={this.state.file_name} onChange={this.inputFileName} onClick={this.inputClick} /> :
              this.state.file_name
            }</Col>
          <Col span={4} offset={1} className="fileCellOption" onClick={e => { e.stopPropagation();e.preventDefault(); }}>
            <OptionFiles file={file} renameFile={this.renameFile} />
          </Col>
          <Col span={2} offset={1}>{file.size === '-' ? '-' : formatSize(file.size)}</Col>
          <Col span={3}>{file.update}</Col>
        </Row >
      </div>
    );
  }
}

FIleCell.defaultProps = {
  edit: false
};

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    select_file: bindActionCreators(select_file, dispatch),
    rename_file: bindActionCreators(rename_file, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FIleCell);