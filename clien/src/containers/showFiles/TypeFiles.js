import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import Toolbar from '../toolbar/Toolbar';
import FilesList from './FilesList';
import style from './style.css';
import { actions as  FileActions} from '../../reducers/files';
const { get_type_files } = FileActions;

class TypeFiles extends Component {
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
    let fileType = this.props.match.params.fileType;
    let userId = this.props.userInfo.id;
    if (userId) {
      this.props.get_type_files(fileType);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.history.location !== this.props.location) {
      const fileType = nextProps.match.params.fileType;
      let userId = this.props.userInfo.id;
      if (userId) {
        this.props.get_type_files(fileType);
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
    get_type_files: bindActionCreators(get_type_files, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TypeFiles);