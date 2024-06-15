import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "../../adminMiddleware";
import prisma from '../../../lib/prisma'

export async function POST(req: NextRequest) {
  const { chatId } = await req.json();
  
  const decodedToken: any = await authenticateToken(req);
  if (!decodedToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if(!decodedToken.id) {
    return NextResponse.json([]);
  }

  if(!decodedToken?.email) {
    return NextResponse.json("No email address provided", {status: 401});
  }

  try {
    const conversation = await prisma.conversation.findUnique({
        where:{
            id: chatId
        },
        include: {
            users: true
        }
    })

    return NextResponse.json(conversation);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}