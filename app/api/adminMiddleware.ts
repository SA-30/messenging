import { verifyToken } from "../utils/auth";
import { NextRequest, NextResponse } from "next/server";

export const authenticateToken = async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Token missing' }, { status: 401 });
    }

    try {
        const decodedToken = await verifyToken(token);
        return decodedToken;
    } catch (error) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
}

export const checkSuperAdminRole = (decodedToken: any) => {
    if(decodedToken.role !== 'superadmin'){
        return NextResponse.json({ message: 'Forbidden', status: 403 });
    }
}
