import { User } from '@prisma/client';
import Image from 'next/image';
import React from 'react'

interface AvatarProps {
    user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  return (
    <div className='relative flex'>
        <div
            className={`
                inline-block
                bg-white
                rounded-full
                relative
                overflow-hidden
                size-9 md:size-11
            `}
        >
            <Image 
                alt='Avatar'
                src={user?.image || '/images/avatar.png'}
                fill
            />
        </div>
    </div>
  )
}

export default Avatar