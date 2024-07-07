"use client";

import { FullMessageType } from "@/app/Types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/lib/pusher";
import { find } from "lodash";
import config from "@/app/helpers/config";
import useUserData from "@/app/hooks/useUserData";

interface IBody {
  initialMessages: FullMessageType[];
  conversationId: string;
}

const Body: React.FC<IBody> = ({ initialMessages, conversationId }) => {
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userData = useUserData();

  useEffect(() => {
    axios.post(`/api/${conversationId}/seen`, {}, config);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const handleMessage = (message: FullMessageType) => {
      axios.post(`/api/${conversationId}/seen`, {}, config);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        // Mark the message as own if it is sent by the current user
        if (message.sender.email === userData?.email) {
          message.isOwn = true;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateHandleMessage = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", handleMessage);
    pusherClient.bind("message:update", updateHandleMessage);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", handleMessage);
    };
  }, [conversationId, userData?.email]);

  return (
    <div className="rounded-[10px] dark:bg-[#333333] hide-scrollbar overflow-y-auto md:h-full bg-white">
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          data={message}
          isLast={i === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} className="pt-[100px]" />
    </div>
  );
};

export default Body;
