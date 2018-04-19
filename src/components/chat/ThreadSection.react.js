import React, { Component } from 'react';
import ThreadListItem from './ThreadListItem.react';

export default class ThreadSection extends Component {


  render() {
    let threadListItems = Object.keys(this.props.threads).map(id => {
      let thread = this.props.threads[id];
      let lastMessage = this.props.messages[thread.lastMessage];
      return (
        <ThreadListItem
          key={id}
          thread={thread}
          lastMessage={lastMessage}
          currentThreadID={this.props.currentThreadID}
          actions={this.props.actions}
        />
      );
    });

    return (
      <div className="thread-section">
        <ul className="thread-list">
          {threadListItems}
          </ul>
      </div>
    );
  }

};
