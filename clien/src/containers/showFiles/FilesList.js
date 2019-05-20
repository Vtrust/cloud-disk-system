import React, { Component } from 'react';
import { Link } from "react-router-dom";
import FileCell from "./FileCell";

class FilesList extends Component {
  render() {
    let files = this.props.files;
    return (
      <div>
        {
          files.map((file) => {
            if (file.type === 'folder') {
              return (
                <Link key={file.file_id} to={`/disk/folder/${file.file_id}`} style={{textDecoration:'none' ,color:'rgba(0, 0, 0, 0.65)'}}>
                  <FileCell  file={file} />
                </Link>
              );
            } else {
              return (
                <FileCell key={file.file_id} file={file} />
              );
            }
          })
        }
      </div>
    );
  }
}

export default FilesList;