import React from "react";

const MessageOthers = (props) => {
  return (
    <div className="other-message-container">
      <div className="conversation-container">
        <p className="con-icon">{props.sender.name[0]}</p>
        <div className="other-text-content">
          <p className="con-title">{props.sender.name}</p>
          <p className="con-lastmessage">{props.content}</p>
          <p className="self-timestamp">11:45 pm</p>
        </div>
      </div>
    </div>
  );
};

export default MessageOthers;
