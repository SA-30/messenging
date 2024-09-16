import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "../../adminMiddleware";
import Prisma from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  const decodedToken: any = await authenticateToken(req);
  const search = req.nextUrl.searchParams.get("search") || "";

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
        AND: [
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              // { email: { contains: search, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        image: true,
      },
    });

    return NextResponse.json({ data: users, status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
