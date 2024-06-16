'use client'

import { FullMessageType } from "@/app/Types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/lib/pusher";
import { find } from 'lodash'
import config from "@/app/helpers/config";

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

  useEffect(() => {

    axios.post(`/api/${conversationId}/seen`,{}, config)
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    // bottomRef?.current?.scrollIntoView({ behavior: "smooth" })
    bottomRef?.current?.scrollIntoView()

    const hadleMessage = (message: FullMessageType) => {
      axios.post(`/api/${conversationId}/seen`,{}, config)
      
      setMessages((current) => {
        if (find(current, {id: message.id})){
          return current;
        }
        
        return [...current, message]
      })

      // bottomRef?.current?.scrollIntoView({ behavior: "smooth" })
      bottomRef?.current?.scrollIntoView()
    }

    const updateHandleMessage = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage
        }
        return currentMessage
      }))
    }

    pusherClient.bind('messages:new', hadleMessage)
    pusherClient.bind('message:update', updateHandleMessage)
    
    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', hadleMessage)
    }
  }, [conversationId])

  return (
    <div className='rounded-[10px] hide-scrollbar overflow-y-auto  md:h-full bg-white'>
      { messages.map((message, i) => (
        <MessageBox 
          key={message.id}
          data={message}
          isLast = {i === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} className="pt-[100px]"/>
    </div>
  )
}

export default Body