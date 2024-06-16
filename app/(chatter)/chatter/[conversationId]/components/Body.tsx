'use client'

import { FullMessageType } from "@/app/Types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox";
import axios from "axios";
import { getCookie } from "@/app/helpers/cookieHelpers";

interface IBody {
  initialMessages: FullMessageType[];
  conversationId: string;
}

const Body: React.FC<IBody> = ({ 
  initialMessages, 
  conversationId
 }) => {
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  const userData = getCookie("token")

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData}`,
      },
    };

    axios.post(`/api/${conversationId}/seen`,{}, config)
  }, [conversationId, userData])

  return (
    <div className='rounded-[10px] hide-scrollbar overflow-y-auto  md:h-full bg-white'>
      { messages.map((message, i) => (
        <MessageBox 
          key={message.id}
          data={message}
          isLast = {i === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} className="pt-10"/>
    </div>
  )
}

export default Body