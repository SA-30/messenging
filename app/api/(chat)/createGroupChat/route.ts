import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "../../adminMiddleware";
import prisma from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
    const decodedToken: any = authenticateToken(req);
    if (!decodedToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { users, name } = await req.json();

    if (!users || !name) {
        return NextResponse.json({ message: 'Data is insufficient' });
    }

    try {
        const userIds = JSON.parse(users);
        userIds.push(decodedToken.userId);
    
        // const groupChat = await prisma.chat.create({
        //   data: {
        //     chatName: name,
        //     isGroupChat: true,
        //     users: {
        //       create: userIds.map((userId: any) => ({ userId })),
        //     },
        //     groupAdmin: {
        //       connect: { id: decodedToken.userId },
        //     },
        //   },
        //   include: {
        //     users: true,
        //     groupAdmin: true,
        //   },
        // });
    
        return Response.json("success", {status: 200});
    } catch (error) {
        return Response.json("Interval Server Error", {status: 500});
    }
}