import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/lib/prisma';
import { authenticateToken } from '../../adminMiddleware';

export async function POST(req: NextRequest) {
    const decodedToken: any = authenticateToken(req);
    if (!decodedToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { content, chatId, receiverId } = await req.json();

    if (!content || !chatId || !receiverId) {
        return NextResponse.json({ message: 'Content, Chat ID, and Receiver ID are required' }, { status: 400 });
    }

    try {
        const newMessage = await prisma.message.create({
            data: {
                senderId: decodedToken.userId,
                receiverId: receiverId,
                content: content,
                chatId: Number(chatId),
            },
            include: {
                sender: {
                    select: {
                        name: true,
                    },
                },
                chat: true,
                receiver: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        await prisma.chat.update({
            where: { id: Number(chatId) },
            data: { latestMessageId: newMessage.id }, // Update the chat with the latest message ID
        });

        return NextResponse.json(newMessage, { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
