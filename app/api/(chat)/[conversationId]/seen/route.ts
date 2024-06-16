import { authenticateToken } from "../../../adminMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../lib/prisma'
import { pusherServer } from "@/app/lib/pusher";

interface IParams {
    conversationId?: string;
}

export async function POST (
    req: NextRequest,
    { params }: {params: IParams}
) {
    const val = await req.json()
    const decodedToken: any = await authenticateToken(req);
    if (!decodedToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if(!decodedToken.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { conversationId } = params;
        
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        })

        if (!conversation) {
            return NextResponse.json({ message: 'Invalid Id' }, { status: 400 });
        }

        const lastMessage = conversation.messages[conversation.messages.length - 1]
        
        if(!lastMessage) return NextResponse.json(conversation)
        
        const updateMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: decodedToken.id
                    }
                }
            }
        })

        await pusherServer.trigger(decodedToken.email, 'conversation:update', {
            id: conversationId,
            messages: [updateMessage],
        })

        if (lastMessage.seenIds.indexOf(decodedToken.id) !== -1) {
            return NextResponse.json(conversation)
        }

        await pusherServer.trigger(conversationId!, 'message:update', updateMessage)

        return NextResponse.json(updateMessage)
    } catch (error) {
        return NextResponse.json("Internal Error", {status: 500})
    }
}