import React from 'react';
import MessageComposer from './MessageComposer.react';
import MessageListItem from './MessageListItem.react';

export default class MessageSection extends React.Component {

  componentDidMount() {
    this._scrollToBottom();
  }

  render() {
    const {currentThread, messages, threadMessages} = this.props;

    if (currentThread) {
      let messageListItems = threadMessages(currentThread.id)
        .map(message => {
          return (
            <MessageListItem
              key={message.id}
              message={message}
            />
          );
        });

      return (
        <div className="message-section">
          <h3 className="message-thread-heading">{currentThread.threadName}</h3>
          <ul className="message-list" ref="messageList">
            {messageListItems}
          </ul>
          <MessageComposer
            threadID={currentThread.id}
            actions={this.props.actions}
          />
        </div>
      );
    } else {
      return <div className="message-section"></div>;
    }
  }

  componentDidUpdate() {
    this._scrollToBottom();
  }

  _scrollToBottom() {
    let ul = this.refs.messageList;
    if (ul) {
      ul.scrollTop = ul.scrollHeight;
    }
  }

};
