import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "../../adminMiddleware";
import prisma from '../../../lib/prisma'

export async function GET(req: NextRequest) {
  const decodedToken: any = await authenticateToken(req);
  if (!decodedToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  // const decodedUserId = parseInt(decodedToken.id, 10);

  if(!decodedToken.id) {
    return NextResponse.json([]);
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: decodedToken.id
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true
          }
        }
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}