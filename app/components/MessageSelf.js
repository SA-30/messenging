import React from "react";

const MessageSelf = (props) => {
  console.log(props.message.content);
  return (
    <div className="self-message-container">
      <div className="message-box">
        <p className="con-lastmessage">{props.message.content}</p>
        <p className="self-timestamp">11:50 pm</p>
      </div>
    </div>
  );
};

export default MessageSelf;
