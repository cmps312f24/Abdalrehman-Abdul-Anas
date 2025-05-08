import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const roleProtectedPaths = {
  ADMIN: ['/admin'],
  INSTRUCTOR: ['/instructor'],
  STUDENT: ['/student'],
};

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userRole = payload.role;

    if (pathname.startsWith('/statistics')) {
      return NextResponse.next();
    }

    for (const [role, paths] of Object.entries(roleProtectedPaths)) {
      if (paths.some(path => pathname.startsWith(path))) {
        if (userRole !== role) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/instructor/:path*',
    '/student/:path*',
    '/statistics'
  ],
};