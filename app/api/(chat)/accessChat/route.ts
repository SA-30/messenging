// pages/api/chat/accessChat.js
import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "../../adminMiddleware";
import prisma from '../../../lib/prisma'

export async function POST(req: NextRequest) {
  const { userId, isGroup, members, name } = await req.json();

  try {
    const decodedToken: any = await authenticateToken(req);
    const decodedUserId = parseInt(decodedToken.id, 10);

    if (!decodedToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return NextResponse.json("Invalid data", { status: 401 });
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
                id: decodedUserId
              }
            ]
          }
        },
        include: {
          users: true
        }
      })

      return NextResponse.json(newConversation)
    }

    const existingConversations = await prisma.conversation.findMany({

    })


    // const existingChat = await prisma.conversation.findFirst({
    //   where: {
    //     isGroup: false,
    //     AND: [
    //       {
    //         users: {
    //           some: {
    //             userId: decodedUserId
    //           }
    //         }
    //       },
    //       {
    //         users: {
    //           some: {
    //             userId: userId
    //           }
    //         }
    //       }
    //     ]
    //   },
    //   include: {
    //     users: true,
    //     messages: {
    //       include: {
    //         sender: {
    //           select: {
    //             name: true,
    //             email: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // if (existingChat) {
    //   return NextResponse.json(existingChat, { status: 200 });
    // }

    // const newChat = await prisma.conversation.create({
    //   data: {
    //     chatName: `Chat between ${decodedToken.name} and User ${userId}`,
    //     isGroupChat: false,
    //     users: {
    //       create: [{ userId: decodedUserId }, { userId }],
    //     },
    //   },
    //   include: {
    //     users: true,
    //     messages: true,
    //   },
    // });

    // await prisma.userChat.createMany({
    //   data: [
    //     { userId: decodedUserId, chatId: newChat.id },
    //     { userId, chatId: newChat.id },
    //   ],
    // });

    // return NextResponse.json(newChat, { status: 200 });
    return NextResponse.json("sss", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
