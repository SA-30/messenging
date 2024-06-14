'use client'

import React, { useEffect, useState } from 'react'
import { FullConversationType } from '../Types'
import PeopleIcon from '@mui/icons-material/People';
import { useRouter, useSearchParams } from 'next/navigation'
import ConversationBox from './ConversationBox';

interface ConversationListProps {
    initialItems: FullConversationType[]
}

const ConversationList: React.FC<ConversationListProps> = ({initialItems}) => {
    const [items, setItems] = useState<FullConversationType[]>(initialItems)

    const router = useRouter()
    const searchParam = useSearchParams();
    const chat_id = searchParam.get("chatId")

    useEffect(() => {
        if (initialItems.length > 0) {
            setItems(initialItems)
        }
    }, [initialItems])

    return (
        <div className={"sb-users dark:dark"}>
            <div className=' text-sm text-[#808080] flex justify-between items-center pb-5'>
                <p className='font-semibold'>Close Friends</p>
                <PeopleIcon />
            </div>
            {items.map((item) => (
                <ConversationBox 
                    key={item.id}
                    data={item}
                    selected={chat_id === item.id}
                />
            ))}
        </div> 
    )
}

export default ConversationList