import React, { PropTypes } from 'react';

class MessageListItem extends React.Component {

  render() {
    let {message} = this.props;
    console.log('message', message);
    return (
      <li className="message-list-item">
        <h5 className="message-author-name">{message.from.name}</h5>
        <div className="message-time">
          {message.timestamp}
        </div>
        <div className="message-text">{message.message}</div>
      </li>
    );
  }

};

MessageListItem.propTypes = {
  message: PropTypes.object
};

export default MessageListItem;
