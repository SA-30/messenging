import { NextRequest, NextResponse } from "next/server";
import { hashedPassword } from "../../../utils/auth";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const name = data.name;
    const email = data.email;
    const password = data.password;


    console.log(name, email, password);
    
    
    if (!email || !password) {
        return NextResponse.json({ message: 'Username and password are required', status: 400 });
    }

    if (email.length < 3) {
        return NextResponse.json({ message: 'Username must be at least 3 characters long', status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Admin already exists', status: 400 });
    }

    const hashPassword = await hashedPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hashPassword,
      }
    });
    
    return NextResponse.json({ message: 'Registration Successful' , user: newUser}, { status: 201 });
    // return NextResponse.json({ message: 'Registration Successful'}, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error during Registration', status: 500 });
  }
}
