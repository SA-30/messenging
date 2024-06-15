import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/lib/prisma';
import { authenticateToken } from '../../adminMiddleware';

export async function POST(req: NextRequest) {
    try {
        const { conversationId, message, image } = await req.json();

        const decodedToken: any = await authenticateToken(req);
        if (!decodedToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const newMessage = await prisma.message.create({
            data: {
                body: message,
                image: image,
                conversation: {
                    connect: {
                        id: conversationId,
                    },
                },
                sender: {
                    connect: {
                        id: decodedToken.id
                    }
                },
                seen: {
                    connect: {
                        id: decodedToken.id
                    }
                }
            },
            include: {
                seen: true,
                sender: true,
            },
        });

        const updatedConversation = await prisma.conversation.update({
            where: { id: conversationId },
            data: { 
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id,
                    },
                }
            }, 
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,
                    }
                },
            },
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
