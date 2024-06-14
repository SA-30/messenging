import React from 'react'

interface IParams {
  conversationId: string
}

const conversationId = async ({params} : { params: IParams}) => {
  return (
    <div>
      Conversation ID
    </div>
  )
}

export default conversationId