import React from "react";
import { useNavigate } from "react-router-dom";

const ConversationsItem = (props) => {
  const navigate = useNavigate();
  return (
    <div
      className="conversation-container"
      onClick={() => {
        navigate("chat");
      }}
    >
      <p className="con-icon">{props.convo.name[0]}</p>
      <p className="con-title">{props.convo.name}</p>
      <p className="con-lastmessage">{props.convo.lastMessage}</p>
      <p className="con-timestamp">{props.convo.timeStamp}</p>
    </div>
  );
};

export default ConversationsItem;
