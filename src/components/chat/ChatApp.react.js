import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';
import MessageSection from './MessageSection.react';
import ThreadSection from './ThreadSection.react';

class ChatApp extends Component {
  render() {
    const { threads, messages, currentThreadID, dispatch } = this.props;
    const actions = bindActionCreators(Actions, dispatch);
    return (
      <div className="chatapp">
        <ThreadSection
          threads={threads}
          messages={messages}
          currentThreadID={currentThreadID}
          actions={actions}
        />
        <MessageSection
          threadMessages={this.props.threadMessages}
          currentThread={threads[currentThreadID]}
          messages={messages}
          actions={actions}
        />
      </div>
    );
  }

};

function mapStateToProps(state) {
  return {
    threads: state.thread,
    messages: state.message,
    currentThreadID: state.currentThreadID,
    threadMessages: (threadId)=>Object.keys(state.message).map((messageID) => state.message[messageID]).filter(m=>m.threadId==threadId)
  };
}

export default connect(mapStateToProps)(ChatApp);
