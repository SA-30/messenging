import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "../adminMiddleware";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export async function GET(req: NextRequest){
    const decodedToken = await authenticateToken(req);
    if (!decodedToken) {
        return;
    }

    try {
        const users = await Prisma.user.findMany()
        return NextResponse.json(users, {status: 200})
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}