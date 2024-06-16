'use client'

import { getCookie } from '@/app/helpers/cookieHelpers';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Skeleton } from '@mui/material';
import Header, { HeaderProps } from './components/Header';
import Body from './components/Body';
import Form from './components/Form'

interface IParams {
  conversationId: string;
}

const Conversation = ({ params }: { params: IParams }) => {
  const [conversation, setConversation] = useState<HeaderProps['conversation'] | null>(null);
  const [messages, setMessages] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { conversationId } = params;

  useEffect(() => {
    if (!conversationId) return;

    const fetchConversation = async () => {
      const token = getCookie("token");
      
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.post("/api/fetchChatById", { chatId: conversationId }, config);
        const response2 = await axios.post("/api/fetchAllMessages", { chatId: conversationId }, config);
        setConversation(response.data);
        
        setMessages(response2.data)
      } catch (err: any) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  if (loading) return (
      <div
        className="h-full"
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    )
  if (error) return <div></div>;

  return (
    <div className="w-full flex flex-col justify-between gap-[10px] p-[12px] md:h-[90vh]">
      {conversation && <Header conversation={conversation}/>}
      <Body initialMessages={messages} conversationId={conversationId}/>
      <div className='h-[60px]'>
        <Form conversationId={conversationId}/>
      </div>
    </div>
  );
};

export default Conversation;
