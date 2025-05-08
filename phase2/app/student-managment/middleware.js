import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const MAP = {
  ADMIN: ['/admin'],
  INSTRUCTOR: ['/instructor'],
  STUDENT: ['/student']
}

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl
  const token = request.cookies.get('token')?.value

  if (pathname === '/login' || pathname === '/') {
    if (!token) return NextResponse.next()
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      return NextResponse.redirect(`${origin}/${String(payload.role).toLowerCase()}`)
    } catch {
      return NextResponse.next()
    }
  }

  if (!token) return NextResponse.redirect(`${origin}/login`)

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    const role = String(payload.role)
    if (pathname.startsWith('/statistics')) return NextResponse.next()
    for (const [r, paths] of Object.entries(MAP)) {
      if (paths.some(p => pathname.startsWith(p)) && r !== role)
        return NextResponse.redirect(`${origin}/${role.toLowerCase()}`)
    }
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(`${origin}/login`)
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/instructor/:path*',
    '/student/:path*',
    '/statistics',
    '/',
    '/login'
  ]
}