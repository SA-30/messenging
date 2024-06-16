'use client'

import { User } from '@prisma/client'
import Image from 'next/image';
import React from 'react'

interface IAvatarGroup {
    users: User[];
} 

const AvatarGroup: React.FC<IAvatarGroup> = ({
    users = [],
}) => {
  const cutUsers = users.slice(0,4)

  const positionMap2 = {
    0: 'top-0 right-[12px]',
    1: 'bottom-0 right-[12px]',
  }
  const positionMap3 = {
    0: 'top-0 right-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0',
  }
  const positionMap4 = {
    0: 'top-0 right-0',
    1: 'top-0',
    2: 'bottom-0',
    3: 'bottom-0 right-0',
  }

  return (
    <div className={`relative size-11`}>
        {/* For 2 people group */}
        {cutUsers.length === 2 && 
            <>
                {cutUsers.map((user, index) => (
                    <div 
                        key={user.id}
                        className={`absolute inline-block 
                            rounded-full overflow-hidden 
                            size-[21px]
                            ${positionMap2[index as keyof typeof positionMap2]}
                        `}
                    >
                        <Image
                            alt='Avatar'
                            fill
                            src={user?.image || '/images/avatar.png'}
                        />
                    </div>
                ))}
            </>
        }
        {/* For 3 people group */}
        {cutUsers.length === 3 && 
            <>
                {cutUsers.map((user, index) => (
                    <div 
                        key={user.id}
                        className={`absolute inline-block 
                            rounded-full overflow-hidden 
                            size-[21px]
                            ${positionMap3[index as keyof typeof positionMap3]}
                        `}
                    >
                        <Image
                            alt='Avatar'
                            fill
                            src={user?.image || '/images/avatar.png'}
                        />
                    </div>
                ))}
            </>
        }
        {/* For more than 3 people group */}
        {cutUsers.length > 3 && 
            <>
                {cutUsers.map((user, index) => (
                    <div 
                        key={user.id}
                        className={`absolute inline-block 
                            rounded-full overflow-hidden 
                            size-[21px]
                            ${positionMap4[index as keyof typeof positionMap4]}
                        `}
                    >
                        <Image
                            alt='Avatar'
                            fill
                            src={user?.image || '/images/avatar.png'}
                        />
                    </div>
                ))}
            </>
        }
    </div>
  )
}

export default AvatarGroup