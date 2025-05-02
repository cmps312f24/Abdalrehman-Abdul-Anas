'use client';
import Plotly from 'plotly.js-dist';
import repo from '@/app/repository/Repo'; // Only if used client-side correctly


export async function uniInfoAction() {
  return await repo.getUni();
}


export async function displayHomeClient() {
  displayUserInfo();
  await displayUniInfo();
  await calendar();
}

function displayUserInfo() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;

  if (user.role === 'admin' || user.role === 'instructor') {
    document.getElementById("stu-info").style.display = "none";
  } else {
    drawGraph(user.gpa);
    const last = user.gpa[user.gpa.length - 1];
    document.getElementById("stu-info-text").innerHTML = `Major : ${user.major} <br>GPA : ${last.gpa} <br>CH : ${last.CH}`;
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



async function calendar() {
  const events = await fetch('/api/uni').then(res => res.json()).then(data => data.events);
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
