// pages/api/chat/accessChat.js
import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "../../adminMiddleware";
import prisma from '../../../lib/prisma'

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  try {
    const decodedToken: any = await authenticateToken(req);
    if (!decodedToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const decodedUserId = parseInt(decodedToken.id, 10);

    const existingChat = await prisma.chat.findFirst({
      where: {
        isGroupChat: false,
        AND: [
          {
            users: {
              some: {
                userId: decodedUserId
              }
            }
          },
          {
            users: {
              some: {
                userId: userId
              }
            }
          }
        ]
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (existingChat) {
      return NextResponse.json(existingChat, { status: 200 });
    }

    // Generate a random chatId
    const randomChatId = Math.floor(Math.random() * 1000000);

    const newChat = await prisma.chat.create({
      data: {
        chatName: `Chat between ${decodedToken.name} and User ${userId}`,
        isGroupChat: false,
        users: {
          create: [{ userId: decodedUserId }, { userId }],
        },
      },
      include: {
        users: true,
        messages: true,
      },
    });

    await prisma.userChat.createMany({
      data: [
        { userId: decodedUserId, chatId: newChat.id },
        { userId, chatId: newChat.id },
      ],
    });

    return NextResponse.json(newChat, { status: 200 });
    // return NextResponse.json("sss", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
