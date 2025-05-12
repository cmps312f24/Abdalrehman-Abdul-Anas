'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies       from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import {
  getCoursesRegisterationAction,
  getUserFromToken
} from '@/app/actions/server-actions';

import RegisterationTable from '@/app/components/RegisterationTable';
import ScheduleTable       from '@/app/components/ScheduleTable';

export default function RegisterationPage () {
  const router = useRouter();

  const [courses,   setCourses]   = useState([]);
  const [page,      setPage]      = useState('register');
  const [expanded,  setExpanded]  = useState(false);
  const [user,      setUser]      = useState(null);
  const [campus,    setCampus]    = useState('');

  const loadCourses = async (filter = { status: 'pending' }) => {
    const data = await getCoursesRegisterationAction(filter);
    setCourses(data);
  };

  const changeCampus = value => {
    const next = campus === value ? '' : value;
    setCampus(next);
    loadCourses({ status:'pending', campus: next });
  };

  useEffect(() => {
    (async () => {
      const token = Cookies.get('token');
      if (!token) return router.push('/login');

      const decoded  = jwtDecode(token);
      const fullUser = await getUserFromToken(decoded);
      setUser(fullUser);

      await loadCourses();
    })();
  }, [router]);

  if (!user) return <h1>Loading…</h1>;
  
  return (
    <>
      <div className="nav-tabs">
        {['register','schedule','summary'].map(p => (
          <button
            key={p}
            className={`nav-button ${page===p ? 'active' : ''}`}
            onClick={() => setPage(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="container registration-container">
        {page === 'register' && (
          <>
            <div className="search-container">
              <form className="form-student-search">
                <div className="form-group">
                  <label className="form-label">College:</label>
                  <div className="input-wrapper">
                    <input
                      type="search"
                      className="form-input with-icon"
                      placeholder="College name"
                      onChange={e =>
                        loadCourses({ status:'pending', college:e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Course Number:</label>
                  <div className="input-wrapper">
                    <input
                      type="search"
                      className="form-input"
                      placeholder="Course number"
                      onChange={e =>
                        loadCourses({ status:'pending', courseNo:e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="button-container">
                  <button
                    type="button"
                    className="toggle-button"
                    onClick={() => setExpanded(v => !v)}
                  >
                    {expanded ? '−' : '+'}
                  </button>
                  <button type="button" className="search-button" onClick={() => loadCourses()}>
                    Search
                  </button>
                </div>

                {expanded && (
                  <div className="form-group">
                    <label className="form-label">Campus:</label>
                    <div className="campus-options">
                      <button
                        type="button"
                        className={`campus-button male   ${campus==='male'   ? 'selected' : ''}`}
                        onClick={() => changeCampus('male')}
                      >Male</button>
                      <button
                        type="button"
                        className={`campus-button female ${campus==='female' ? 'selected' : ''}`}
                        onClick={() => changeCampus('female')}
                      >Female</button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <RegisterationTable
              user={user}
              initCourses={courses}
              pageType="register"
            />
          </>
        )}

        {page === 'schedule' && <ScheduleTable user={user} />}


        {page === 'summary' && (
          <RegisterationTable
            user={user}
            initCourses={courses}
            pageType="summary"
          />
        )}
      </div>
    </>
  );
}