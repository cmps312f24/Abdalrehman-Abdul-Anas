'use client';

import { useEffect } from 'react';
import { uniInfoAction } from '../actions/server-actions';

export default function Calendar() {
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const uni = await uniInfoAction();
        const raw = uni.events || '';
        const events = {};
        raw.split(',').forEach(entry => {
          const [date, desc] = entry.split(':');
          if (date && desc) events[date.trim()] = desc.trim();
        });

        const calendarBody = document.getElementById('calendarBody');
        const monthYear = document.getElementById('monthYear');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');

        let date = new Date();
        let currentMonth = date.getMonth();
        let currentYear = date.getFullYear();
        const today = new Date();

        function generateCalendar(month, year) {
          calendarBody.innerHTML = '';
          monthYear.textContent = new Date(year, month).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          });

          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();

          for (let i = 0; i < firstDay; i++) {
            calendarBody.appendChild(document.createElement('div'));
          }

          for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(
              day
            ).padStart(2, '0')}`;

            if (
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear()
            ) {
              dayDiv.classList.add('today');
            }

            if (events[formattedDate]) {
              dayDiv.classList.add('event-calender');
              dayDiv.title = events[formattedDate];
            }

            calendarBody.appendChild(dayDiv);
          }
        }

        function renderEventList() {
          const container = document.querySelector('.event-container');
          container.innerHTML = '';
          Object.keys(events)
            .sort()
            .forEach(date => {
              const p = document.createElement('p');
              p.textContent = `${date}: ${events[date]}`;
              p.classList.add('event');
              container.appendChild(p);
            });
        }

        prevMonthBtn.onclick = () => {
          if (--currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
          }
          generateCalendar(currentMonth, currentYear);
        };

        nextMonthBtn.onclick = () => {
          if (++currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
          }
          generateCalendar(currentMonth, currentYear);
        };

        renderEventList();
        generateCalendar(currentMonth, currentYear);
      } catch (err) {
        console.error('Failed to fetch or render events:', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="calendar content-home">
      <div className="header-calendar">
        <button id="prevMonth">◀</button>
        <h2 id="monthYear"></h2>
        <button id="nextMonth">▶</button>
      </div>
      <div className="days">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div id="calendarBody" className="dates"></div>
      <div className="legend">
        <div className="legend-item">
          <span className="legend-box today"></span> Today
        </div>
        <div className="legend-item">
          <span className="legend-box event-calender"></span> Event
        </div>
      </div>
      <span id="events">
        <div className="event-container"></div>
      </span>
    </div>
  );
}