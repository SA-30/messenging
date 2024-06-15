'use client'

import React, { useEffect, useState } from 'react'
import { FullConversationType } from '../Types'
import PeopleIcon from '@mui/icons-material/People';
import ConversationBox from './ConversationBox';
import { usePathname } from 'next/navigation';

interface ConversationListProps {
    initialItems: FullConversationType[]
}

const ConversationList: React.FC<ConversationListProps> = ({initialItems}) => {
    const [items, setItems] = useState<FullConversationType[]>(initialItems)

    const pathname = usePathname()
    const chat_id = pathname.split('/').pop()

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
    )
}

export default ConversationList