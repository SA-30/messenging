import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "../../adminMiddleware";
import prisma from '../../../lib/prisma'
export async function GET(req: NextRequest) {
    const decodedToken: any = await authenticateToken(req);
    if (!decodedToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedUserId = parseInt(decodedToken.id, 10);
  
    try {
      const chats = await prisma.chat.findMany({
        where: {
          users: {
            some: {
              userId: decodedUserId,
            },
          },
        },
        include: {
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          messages: {
            include: {
              sender: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1, // To get the latest message
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
  
      return NextResponse.json(chats, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }