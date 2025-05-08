'use client'

import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Graph from '@/app/components/Graph'
import Calendar from '@/app/components/Calendar'

export default function HomeClient ({ user, uni }) {
  const router = useRouter()
  if (!user) {
    Cookies.set('token', '', { path: '/', maxAge: 0 })
    router.push('/login')
    return null
  }

  const infoLines = (uni.info ?? '')
    .split(/(?=\d-)/)
    .map(t => t.trim())
    .filter(Boolean)

  const last = user.gpa?.at(-1) ?? {}
  const gpa = last.gpa ?? 0
  const ch  = last.CH  ?? 0

  return (
    <div id='Home-box'>
      <div className='backgroud-home' />

      <section id='content-home'>
        <span id='uni-info' className='content-home'>
          <h2 className='header-home'>Information</h2>
          <p id='uni-info-text'>
            {infoLines.map((l, i) => <span key={i}>{l}<br/></span>)}
          </p>
        </span>

        {user.role === 'STUDENT' && (
          <span id='stu-info' className='content-home'>
            <span id='student-text'>
              <h2 className='header'>Student Information</h2>
              <p id='stu-info-text'>
                Major&nbsp;: {user.major}<br/>
                GPA&nbsp;&nbsp;&nbsp;: {gpa}<br/>
                CH&nbsp;&nbsp;&nbsp;&nbsp;: {ch}
              </p>
            </span>
            <Graph gpaList={user.gpa} />
          </span>
        )}

        <Calendar rawEvents={uni.events ?? ''} />
      </section>
    </div>
  )
}