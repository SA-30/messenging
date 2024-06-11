import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/lib/prisma';
import { authenticateToken } from '../../adminMiddleware';

export async function GET(req: NextRequest) {
    const decodedToken: any = authenticateToken(req);
    if (!decodedToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const chatId = req.nextUrl.searchParams.get('chatId');
    if (!chatId) {
        return NextResponse.json({ message: 'Chat ID is required' }, { status: 400 });
    }

    try {
        const messages = await prisma.message.findMany({
            where: { chatId: Number(chatId) },
            include: {
                sender: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                receiver: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                chat: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
