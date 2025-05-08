'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getUserFromToken } from '../actions/server-actions';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        const decoded = jwtDecode(token);
        const user = await getUserFromToken(decoded);
        setUser(user);
        setRole(user.role);
      } else {
        router.push('/login');
      }
    };
  
    fetchUser();
  }, []);

  const logout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <nav className="nav">
      <i className="fa-solid fa-arrow-left back-button-mobile" onClick={hideMobileNav}></i>

      <Link id="user-info" href='/settings'>
        <img
          src={role === 'STUDENT' ? '/img/student.png' : '/img/profile.png'}
          alt="User"
          id="img-user"
        />
        <h2 id="user-Name" className="user-text">{user.name || user.id}</h2>
        <p id="user-username" className="user-text">{user.email || ''}</p>
      </Link>

      <hr className="nav-lines" />

      <ul id="main-menu">
        <li>
          <Link href={`/${role.toLowerCase()}`} className="menu-element selected">
            <img src="/img/famicons_home.png" alt="Home" />
            <p className="menu-text">Home</p>
          </Link>
        </li>
        <li>
          <Link href={`/${role.toLowerCase()}/courses`} className="menu-element">
            <img src="/img/tdesign_course-filled.png" alt="Courses" />
            <p className="menu-text">Courses</p>
          </Link>
        </li>
        {(role === 'STUDENT' || role === 'ADMIN') && (
          <li>
            <Link href="/registeration" className="menu-element">
              <img src="/img/game-icons_archive-register.png" alt="Registeration" />
              <p className="menu-text">Registeration</p>
            </Link>
          </li>
        )}
        {role === 'STUDENT' && (
          <li>
            <Link href={`/${role.toLowerCase()}/path`} className="menu-element">
              <img src="/img/ph_path-bold.png" alt="Path" />
              <p className="menu-text">Path</p>
            </Link>
          </li>
        )}
      </ul>

      <hr className="nav-lines" />

      <ul id="secondry-menu">
        <li>
          <Link href="/settings" className="menu-element" id="Settings-btn">
            <img src="/img/material-symbols_settings.png" alt="Settings" />
            <p className="menu-text">Settings</p>
          </Link>
        </li>
        <li>
          <Link href="/help&support" className="menu-element">
            <img src="/img/clarity_help-info-solid.png" alt="Help" />
            <p className="menu-text">Help & Support</p>
          </Link>
        </li>
        <li>
          <button onClick={logout} className="menu-element">
            <img src="/img/tabler_logout.png" alt="Logout" />
            <p className="menu-text">Logout</p>
          </button>
        </li>
      </ul>
    </nav>
  );
}

function hideMobileNav() {
  const nav = document.querySelector('.nav');
  if (nav) nav.style.display = 'none';
}