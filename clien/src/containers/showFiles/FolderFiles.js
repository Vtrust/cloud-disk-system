import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import Toolbar from '../toolbar/Toolbar';
import FilesList from './FilesList';
import style from './style.css';
import { actions } from '../../reducers/files';
const { get_file_list } = actions;

class AllFiles extends Component {
  render() {
    return (
      <div>
        <Toolbar />
        <div className="fliesList">
          <FilesList files={this.props.files} />
        </div>
      </div>
    );
  }
  componentDidMount() {
    let folderId = this.props.match.params.folderId;
    let userId = this.props.userInfo.id;

    if (userId) {
      this.props.get_file_list(userId, folderId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.history.location !== this.props.location) {
      const folderId = nextProps.match.params.folderId;
      let userId = this.props.userInfo.id;
      if (userId) {
        this.props.get_file_list(userId, folderId);
      }
    }
  }

}

function mapStateToProps(state) {
  return {
    userInfo: state.user.userInfo,
    files: state.files.list
  }
}

function mapDispatchToProps(dispatch) {
  return {
    get_file_list: bindActionCreators(get_file_list, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllFiles);