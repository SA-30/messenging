import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest)  {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/'
  const token = request.cookies.get('token')?.value || ''

  // if(isPublicPath && token) {
  //   return NextResponse.redirect(new URL('/chatter', request.nextUrl))
  // }

  if(!isPublicPath && !token) {
    console.log("no token");
    
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }
}

export const config = {
  matcher: [
    '/',
    '/chatter/:path*',
    '/dashboard/:path*',
  ]
}