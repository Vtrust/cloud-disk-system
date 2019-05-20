import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom'
import FolderFiles from './FolderFiles'

class ShowFiles extends Component {
  render() {
    if (this.props.userInfo && this.props.userInfo.level) {
      const { path } = this.props.match;
      return (
        <div>
          <Switch>
            <Route path={`${path}/star`} />
            <Route path={`${path}/folder/:folderId`} component={FolderFiles} />
            <Route path={`${path}/fileType/:fileType`} />
            <Redirect to={`${path}/folder/root`} />
          </Switch>
        </div>
      );
    } else {
      return <Redirect to='/login' />
    }

  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.user.userInfo
  };
}

export default connect(
  mapStateToProps,
)(ShowFiles);