// pages/api/chat/accessChat.js
import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "../../adminMiddleware";
import prisma from '../../../lib/prisma'
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: NextRequest) {
  const { userId, isGroup, members, name } = await req.json();

  try {
    const decodedToken: any = await authenticateToken(req);

    if (!decodedToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!userId && !isGroup) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (isGroup && (!members || members.length < 1 || !name)) {
      return NextResponse.json("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member : { value: string }) => ({
                id: member.value
              })),
              {
                id: decodedToken.id
              }
            ]
          }
        },
        include: {
          users: true
        }
      })

      newConversation.users.forEach((user) => {
        if(user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation)
        }
      })

      return NextResponse.json(newConversation)
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [decodedToken.id, userId]
            }
          },
          {
            userIds: {
              equals: [userId, decodedToken.id]
            }
          }
        ]
      }
    })

    const singleConversation = existingConversations[0]

    if (singleConversation){
      return NextResponse.json(singleConversation)
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: decodedToken.id,
            },
            {
              id: userId,
            }
          ]
        }
      },
      include: {
        users: true
      }
    })

    newConversation.users.map((user) => {
      if(user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation)
      }
    })

    return NextResponse.json(newConversation)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
