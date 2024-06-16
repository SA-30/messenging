'use client'

import React, { useEffect, useState } from 'react'
import { FullConversationType } from '../Types'
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { IconButton } from "@mui/material";
import ConversationBox from './ConversationBox';
import { usePathname } from 'next/navigation';
import GroupChatModel from './GroupChatModel';
import { User } from '@prisma/client';

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

    const pathname = usePathname()
    const chat_id = pathname.split('/').pop()

    useEffect(() => {
        if (initialItems.length > 0) {
            setItems(initialItems)
        }
    }, [initialItems])

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