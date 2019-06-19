import React, { Component } from 'react';
import ShareFilesList from './ShareFilesList';
import {PageHeader} from 'antd'


class ShowShareFiles extends Component {
  render() {
    return (
      <div>
        <PageHeader title="全部分享" />
        <ShareFilesList />
      </div>
    );
  }
}

export default ShowShareFiles;