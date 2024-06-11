import { NextRequest, NextResponse } from "next/server";
import { generateToken, verifyPassword } from "../../../utils/auth";
import prisma from "@/app/lib/prisma";

export async function POST (req: NextRequest) {
    try {
        const data = await req.json()
        const email = data.email
        
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        // Verify the password
        const isValid = await verifyPassword(data.password, user.password)
        if (!isValid) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 })
        }

        // Generate token
        const token = generateToken(user)
    
        // Set the token in cookies
        const response = NextResponse.json({ message: 'Login successful', data: {token} })
        response.cookies.set('token', token, { maxAge: 15 * 24 * 60 * 60 })
  
      return response
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error during Login' }, { status: 500 })
    }
}