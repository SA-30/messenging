import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/lib/prisma';
import { authenticateToken } from '../../adminMiddleware';

export async function POST(req: NextRequest) {
    const { ChatId } = await req.json()
    
    const decodedToken: any = authenticateToken(req);
    if (!decodedToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: ChatId,
            },
            include: {
                sender: true,
                seen: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        })
        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
// const chatId = req.nextUrl.searchParams.get('chatId');