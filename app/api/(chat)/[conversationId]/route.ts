import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../lib/prisma'
import { authenticateToken } from "../../adminMiddleware";

interface IParams {
    conversationId: string;
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: IParams}
) {
    try {
        const { conversationId } = params;
        const decodedToken: any = await authenticateToken(req);
        if (!decodedToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })

        if(!existingConversation) {
            return NextResponse.json("Conversation not found", {status: 404})
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [decodedToken.id]
                }
            }
        })

        return NextResponse.json(deletedConversation)
    } catch (err: any) {
        return NextResponse.json("Internal Server Error", {status: 500})
    }
}