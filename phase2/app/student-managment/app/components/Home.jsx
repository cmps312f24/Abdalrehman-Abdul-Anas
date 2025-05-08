import { cookies } from 'next/headers'
import { verifyToken } from '@/app/utils/jwt'
import { getUserFromToken, uniInfoAction } from '@/app/actions/server-actions'
import HomeClient from './HomeClient'

export default async function HomePage () {
  const token = (await cookies()).get('token')?.value
  if (!token) return null

  const decoded = verifyToken(token)
  const [user, uni] = await Promise.all([
    getUserFromToken(decoded),
    uniInfoAction()
  ])

  return <HomeClient user={user} uni={uni} />
}