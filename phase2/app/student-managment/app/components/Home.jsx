'use client';

import { useEffect,useState } from 'react';
import {uniInfoAction} from '../actions/Home-actions'

export default function Home() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setRole(parsed.role);
    }
  }, []);

  return (
    <div id="Home-box">
      <div className="backgroud-home"></div>

      <section id="content-home">
        {displayUniInfo()}

        {displayUserInfo(user)}

        {calendar()}

        <div className="calendar content-home">
          <div className="header-calendar">
            <button id="prevMonth">◀</button>
            <h2 id="monthYear"></h2>
            <button id="nextMonth">▶</button>
          </div>
          <div className="days">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
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
      </section>
    </div>
  );
}

function displayUserInfo(user) {  
    if (user.role === 'admin' || user.role === 'instructor') {
        return
    } else {
      drawGraph(user.gpa);
      const last = user.gpa[user.gpa.length - 1];
      return(
        <span id="stu-info" class="content-home">
                <span id="student-text">
                    <h2 class="header">Student Information</h2>
                    <p id="stu-info-text">Major : {user.major} <br>GPA</br> : {last.gpa} <br>CH</br> : {last.CH}</p>
                </span>
                <div id="myGraph"></div>
        </span>
      );
    }
}

function drawGraph(gpaList) {
    const gpaValues = gpaList.map(e => e.gpa);
    const chValues = gpaList.map(e => e.CH);

    const data = [{
        x: chValues,
        y: gpaValues,
        mode: 'lines+markers',
        type: 'scatter',
    }];

    const layout = {
        title: 'GPA Graph',
        xaxis: { title: 'Credit Hours' },
        yaxis: { title: 'GPA' },
    };

    Plotly.newPlot('myGraph', data, layout);
}

async function displayUniInfo() {
    const uni = uniInfoAction();
    const info=uni.info;

    return(
        <span id="uni-info" class="content-home">
            <h2 class="header-home">Information</h2>
            <p id="uni-info-text">
                info.join(<br></br>);
            </p>
        </span>
    );
}


async function calendar() {
    const events = uniInfoAction().events;
    const calendarBody = document.getElementById("calendarBody");
    const monthYear = document.getElementById("monthYear");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
  
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();
  
    const today = new Date();
  
    function generateCalendar(month, year) {
      calendarBody.innerHTML = "";
      monthYear.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });
  
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
  
      for (let i = 0; i < firstDay; i++) {
        calendarBody.appendChild(document.createElement("div"));
      }
  
      for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.textContent = day;
        const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          dayDiv.classList.add("today");
        }
  
        if (events[formattedDate]) {
          dayDiv.classList.add("event-calender");
          dayDiv.title = events[formattedDate];
        }
  
        calendarBody.appendChild(dayDiv);
      }
    }
  
    function renderEventList(events) {
      const container = document.querySelector(".event-container");
      container.innerHTML = "";
      Object.keys(events).sort().forEach(date => {
        const p = document.createElement("p");
        p.textContent = `${date}: ${events[date]}`;
        p.classList.add("event");
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
  
    renderEventList(events);
    generateCalendar(currentMonth, currentYear);
}
  