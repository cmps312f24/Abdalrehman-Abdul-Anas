'use client'

import { useEffect } from 'react'

export default function Calendar ({ rawEvents }) {
  useEffect(() => {
    const events = {}
    rawEvents.split(',').forEach(e => {
      const [d, t] = e.split(':')
      if (d && t) events[d.trim()] = t.trim()
    })

    const body = document.getElementById('calendarBody')
    const header = document.getElementById('monthYear')
    const prev = document.getElementById('prevMonth')
    const next = document.getElementById('nextMonth')
    const today = new Date()
    let m = today.getMonth()
    let y = today.getFullYear()

    const paint = () => {
      body.innerHTML = ''
      header.textContent = new Date(y, m).toLocaleString('default', { month: 'long', year: 'numeric' })
      const first = new Date(y, m, 1).getDay()
      const days  = new Date(y, m + 1, 0).getDate()
      body.append(...Array(first).fill('').map(() => document.createElement('div')))
      for (let d = 1; d <= days; d++) {
        const div = document.createElement('div')
        div.textContent = d
        const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        if (d === today.getDate() && m === today.getMonth() && y === today.getFullYear()) div.classList.add('today')
        if (events[iso]) { div.classList.add('event-calender'); div.title = events[iso] }
        body.appendChild(div)
      }
    }

    prev.onclick = () => { if (--m < 0) { m = 11; y-- } ; paint() }
    next.onclick = () => { if (++m > 11) { m = 0 ; y++ } ; paint() }

    paint()

    const list = document.querySelector('.event-container')
    list.innerHTML = ''
    Object.keys(events).sort().forEach(k => {
      const p = document.createElement('p')
      p.className = 'event'
      p.textContent = `${k}: ${events[k]}`
      list.appendChild(p)
    })
  }, [rawEvents])

  return (
    <div className='calendar content-home'>
      <div className='header-calendar'>
        <button id='prevMonth'>◀</button>
        <h2 id='monthYear' />
        <button id='nextMonth'>▶</button>
      </div>

      <div className='days'>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div id='calendarBody' className='dates' />

      <div className='legend'>
        <div className='legend-item'><span className='legend-box today'/> Today</div>
        <div className='legend-item'><span className='legend-box event-calender'/> Event</div>
      </div>

      <span id='events'><div className='event-container'/></span>
    </div>
  )
}