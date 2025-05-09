'use client'

import { useRouter, usePathname } from 'next/navigation'
import Cookies                     from 'js-cookie'
import Link                        from 'next/link'
import { useState }                from 'react'

export default function NavbarClient ({ user }) {
  const router     = useRouter()
  const pathname   = usePathname()
  const [open, mobileMenu] = useState(false)            // mobile drawer toggle

  if (!user) return null

  const role     = user.role.toLowerCase()
  const root     = `/${role}`
  const active   = (p) => pathname === p

  const hide     = () => mobileMenu(false)
  const logout   = () => {
    Cookies.set('token', '', { path: '/', maxAge: 0 })
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* mobile header button */}
      <header className='mobile-header'>
        <i className='fas fa-bars nav-button-mobile' onClick={() => mobileMenu(true)}></i>
        <h2>{role.charAt(0).toUpperCase() + role.slice(1)}</h2>
        <img id='mobile-img-user' src={role === 'student' ? '/img/student.png' : '/img/profile.png'} alt='' />
      </header>

      <nav className={`nav ${open ? 'show' : ''}`} onClick={(e)=>e.stopPropagation()}>
        <i className='fa-mobileMenulid fa-arrow-left back-button-mobile' onClick={hide}></i>

        {/* top / user block */}
        <Link id='user-info' href={`${root}/settings`} onClick={hide}>
          <img id='img-user' src={role === 'student' ? '/img/student.png' : '/img/profile.png'} alt='' />
          <h2 id='user-Name'      className='user-text'>{user.name || user.id}</h2>
          <p  id='user-username'  className='user-text'>{user.email || ''}</p>
        </Link>

        <hr className='nav-lines' />

        {/* main menu */}
        <ul id='main-menu'>
          <li>
            <Link href={root}
                  className={`menu-element ${active(root, true) ? 'selected' : ''}`}
                  onClick={hide}>
              <img src='/img/famicons_home.png'         alt='' />
              <p  className='menu-text'>Home</p>
            </Link>
          </li>

          <li>
            <Link href={`${root}/courses`}
                  className={`menu-element ${active(`${root}/courses`) ? 'selected' : ''}`}
                  onClick={hide}>
              <img src='/img/tdesign_course-filled.png' alt='' />
              <p  className='menu-text'>Courses</p>
            </Link>
          </li>

          {(role === 'student' || role === 'admin') && (
            <li>
              <Link href={`${root}/registeration`}
                    className={`menu-element ${active(`${root}/registeration`) ? 'selected' : ''}`}
                    onClick={hide}>
                <img src='/img/game-icons_archive-register.png' alt='' />
                <p  className='menu-text'>Registeration</p>
              </Link>
            </li>
          )}

          {role === 'student' && (
            <li>
              <Link href={`${root}/path`}
                    className={`menu-element ${active(`${root}/path`) ? 'selected' : ''}`}
                    onClick={hide}>
                <img src='/img/ph_path-bold.png' alt='' />
                <p  className='menu-text'>Path</p>
              </Link>
            </li>
          )}
        </ul>

        <hr className='nav-lines' />

        {/* secondary menu */}
        <ul id='secondry-menu'>
          <li>
            <Link href={`${root}/settings`}
                  className={`menu-element ${active(`${root}/settings`) ? 'selected' : ''}`}
                  onClick={hide}>
              <img src='/img/material-symbols_settings.png' alt='' />
              <p  className='menu-text'>Settings</p>
            </Link>
          </li>

          <li>
            <Link href='/help&support'
                  className={`menu-element ${active('/help&support') ? 'selected' : ''}`}
                  onClick={hide}>
              <img src='/img/clarity_help-info-solid.png' alt='' />
              <p  className='menu-text'>Help & Support</p>
            </Link>
          </li>

          <li>
            <button onClick={logout} className='menu-element'>
              <img src='/img/tabler_logout.png' alt='' />
              <p  className='menu-text'>Logout</p>
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}
