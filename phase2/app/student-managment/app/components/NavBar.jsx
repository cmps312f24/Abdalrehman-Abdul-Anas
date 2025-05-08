import { cookies } from 'next/headers'
import { verifyToken } from '@/app/utils/jwt'
import { getUserFromToken } from '@/app/actions/server-actions'
import NavbarClient from './NavbarClient'

export default async function Navbar () {
  const token = (await cookies()).get('token')?.value
  let user = null

  if (token) {
    try {
      const decoded = verifyToken(token)
      user = await getUserFromToken(decoded)
    } catch {}
  }

  return <NavbarClient user={user} />
}