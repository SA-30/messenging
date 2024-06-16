import { User } from '@prisma/client';
import Image from 'next/image';
import React from 'react'

interface AvatarProps {
    user?: User;
    size?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, size }) => {
  return (
    <div className='relative flex'>
        <div
            className={`
                inline-block bg-white
                rounded-full relative
                overflow-hidden
                size-9 md:size-11
                ${size === 'small' ? 
                    'md:size-9' : 
                    ''
                }
                ${size === 'smaller' ?
                    'md:size-7' :
                    ''
                }
                ${size === 'profile' ?
                    'md:size-6' :
                    ''
                }
                
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