import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "../../adminMiddleware";
import Prisma from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  const decodedToken: any = await authenticateToken(req);

  if (!decodedToken) {
    return;
  }

  try {
    const users = await Prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          id: decodedToken.id,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
