'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { FullConversationType } from '../Types'
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { IconButton } from "@mui/material";
import ConversationBox from './ConversationBox';
import { usePathname, useRouter } from 'next/navigation';
import GroupChatModel from './GroupChatModel';
import { User } from '@prisma/client';
import { pusherClient } from '../lib/pusher';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../helpers/config';
import { find } from 'lodash';

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
    initialItems,
    users
}) => {
    const [items, setItems] = useState<FullConversationType[]>(initialItems)
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [user, setUser] = useState<any>()

    const router = useRouter()
    const pathname = usePathname()
    const chat_id = pathname.split('/').pop()

    useEffect(() => {
        if (initialItems.length > 0) {
            setItems(initialItems)
        }

        axios
        .get("/api/getCurrentUser", config)
        .then((response) => {
            setUser(response.data.data)
        })
        .catch((error) => {
            toast.error("Error fetching conversations")
        });
    }, [initialItems])

    const pusherKey = useMemo(() => {
        return user?.email
    }, [user?.email])

    useEffect(() => {
        if(!pusherKey) return

        const newHandler = (conversation: FullConversationType) => {
            setItems(current => {
              if(find(current, {id: conversation.id}))  {
                return current;
              }

              return [conversation, ...current]
            })
        }

        const updateHandler = (conversation: FullConversationType) => {
            setItems(current => current.map(currentConversation => {
                if(currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: conversation.messages,
                    }
                }

                return currentConversation
            }))
        }

        const removeHandler = (conversation: FullConversationType) => {
            setItems(current => 
                current.filter(currentConversation => 
                    currentConversation.id !== conversation.id
                )
            )

            if(chat_id === conversation.id){
                router.push('/chatter')
            }
        }
        
        pusherClient.subscribe(pusherKey)
        pusherClient.bind('conversation:new', newHandler)
        pusherClient.bind('conversation:update', updateHandler)
        pusherClient.bind('conversation:remove', removeHandler)

        return () => {
            pusherClient.unsubscribe(pusherKey)
            pusherClient.unbind('conversation:new', newHandler)
            pusherClient.unbind('conversation:update', updateHandler)
            pusherClient.unbind('conversation:remove', removeHandler)
        }
    }, [pusherKey, chat_id, router])

    return (
        <>
            <GroupChatModel
                users={users}
                isOpen={isModelOpen}
                onClose={() => setIsModelOpen(false)}
            />
            <div className={"sb-users dark:dark"}>
                <div className=' text-sm text-[#808080] flex justify-between items-center pb-5'>
                    <p className='font-semibold'>Close Friends</p>
                    <IconButton onClick={() => setIsModelOpen(true)}>
                        <GroupAddIcon />
                    </IconButton>
                </div>
                <div className='flex flex-col gap-2'>
                    {items.map((item) => (
                        <ConversationBox 
                            key={item.id}
                            data={item}
                            selected={chat_id === item.id}
                        />
                    ))}
                </div>
            </div> 
        </>
    )
}

export default ConversationList