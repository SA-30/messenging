import { NextRequest, NextResponse } from "next/server";
import prisma from '../../lib/prisma'
import { authenticateToken } from "../adminMiddleware";

export async function POST(req: NextRequest) {
    try {
        const {name, image} = await req.json()

        const decodedToken: any = await authenticateToken(req);
        if (!decodedToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: decodedToken.id
            },
            data: {
                name,
                image
            }
        })

        return NextResponse.json(updatedUser)
    } catch (err: any) {
        return NextResponse.json("Internal Server Error", {status: 500})
    }
}