'use client'

import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Link from 'next/link'

export default function NavbarClient ({ user }) {
  const router = useRouter()

  if (!user) return null

  const logout = () => {
    Cookies.set('token', '', { path: '/', maxAge: 0 })
    router.push('/login')
    router.refresh()
  }

  const role = user.role.toLowerCase()

  return (
    <nav className='nav'>
      <Link id='user-info' href={`/${role}/settings`}>
        <img src={role === 'student' ? '/img/student.png' : '/img/profile.png'} alt='' id='img-user' />
        <h2 className='user-text'>{user.name || user.id}</h2>
        <p className='user-text'>{user.email || ''}</p>
      </Link>

      <hr className='nav-lines' />

      <ul id='main-menu'>
        <li><Link href={`/${role}`} className='menu-element selected'><img src='/img/famicons_home.png' alt='' /><p className='menu-text'>Home</p></Link></li>
        <li><Link href={`/${role}/courses`} className='menu-element'><img src='/img/tdesign_course-filled.png' alt='' /><p className='menu-text'>Courses</p></Link></li>
        {(role === 'student' || role === 'admin') && (
          <li><Link href='/registeration' className='menu-element'><img src='/img/game-icons_archive-register.png' alt='' /><p className='menu-text'>Registeration</p></Link></li>
        )}
        {role === 'student' && (
          <li><Link href={`/${role}/path`} className='menu-element'><img src='/img/ph_path-bold.png' alt='' /><p className='menu-text'>Path</p></Link></li>
        )}
      </ul>

      <hr className='nav-lines' />

      <ul id='secondry-menu'>
        <li><Link href={`/${role}/settings`} className='menu-element'><img src='/img/material-symbols_settings.png' alt='' /><p className='menu-text'>Settings</p></Link></li>
        <li><Link href='/help&support' className='menu-element'><img src='/img/clarity_help-info-solid.png' alt='' /><p className='menu-text'>Help & Support</p></Link></li>
        <li><button onClick={logout} className='menu-element'><img src='/img/tabler_logout.png' alt='' /><p className='menu-text'>Logout</p></button></li>
      </ul>
    </nav>
  )
}