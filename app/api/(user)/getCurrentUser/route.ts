import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || "thisisverystrongpassword";

export async function GET(req: NextRequest){
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    

    try {
        const decodedToken: any = jwt.verify(token, jwtSecret);

        const User = await prisma.user.findUnique({
            where: {
                id: decodedToken?.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
            },
            
        })
        
        return NextResponse.json({ data: User }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
}