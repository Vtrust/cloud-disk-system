import React, { Component } from 'react';
import { connect } from 'react-redux';
import TaskCell from './TaskCell'

class UploadList extends Component {
  render() {
    let tasks = this.props.tasks;
    return (
      <div>
        {
          tasks.map((task) => {
            return (
             <TaskCell style={{marginTop:'5px'}} key={task.uid} task={task} />
            );
          })
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tasks: state.uploadFiles.list,
  };
}

export default connect(mapStateToProps, {})(UploadList);