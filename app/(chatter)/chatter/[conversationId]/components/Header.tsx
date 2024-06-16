'use client'

import useOtherUser from '@/app/hooks/useOtherUser'
import { Conversation, User } from '@prisma/client'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';
import ProfileDrawer from './ProfileDrawer';

export interface HeaderProps {
    conversation: Conversation & {
      users: User[]
    }
}

const Header: React.FC<HeaderProps> = ({ 
    conversation
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const otherUser = useOtherUser(conversation)
  
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
        return `${conversation.users.length} members `
    }

    return 'Unknown'
  }, [conversation])

  return (
   <>
    <ProfileDrawer 
      data={conversation}
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    />
    <div
      className='
        bg-white w-full flex
        border-b sm:px-4 py-2
        rounded-md box-shadow1
        px-4 lg:px-6 justify-between
        items-center shadow-sm
      '
    >
        <div className='flex gap-3 items-center'>
            <Link 
                className='
                    md:hidden block text-sky-500
                    hover:text-sky-600
                    transition cursor-pointer
                '
                href='/chatter'
            >
                <KeyboardArrowLeftIcon />
            </Link>
            {conversation.isGroup ? 
              <AvatarGroup users={conversation.users} /> :
              <Avatar user={otherUser} size="small"/>
            }
            <div
              className='flex flex-col'
            >
              <div>
                { conversation.name || otherUser.name}
              </div>
              <div
                className='
                  text-xs
                  font-light
                  text-neutral-500
                '
              >
                {statusText}
              </div>
            </div>
        </div>
        <MoreHorizIcon 
          onClick={() => setDrawerOpen(true)}
          className='
            size-8 transition 
            text-gray-500 
            cursor-pointer 
            hover:text-sky-600
          '
        />
    </div>
   </>
  )
}

export default Header