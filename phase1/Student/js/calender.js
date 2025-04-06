const calendarBody = document.getElementById("calendarBody");
const monthYear = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let today = date.getDate();
let todayMonth = date.getMonth();
let todayYear = date.getFullYear();

const specialEvents = {
    "2025-04-05": "Meeting",
    "2025-04-10": "Birthday",
    "2025-04-20": "Holiday"
};

function generateCalendar(month, year) {
    calendarBody.innerHTML = "";
    monthYear.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        let emptyDiv = document.createElement("div");
        calendarBody.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dayDiv = document.createElement("div");
        dayDiv.textContent = day;

        let formattedDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

        if (day === today && month === todayMonth && year === todayYear) {
            dayDiv.classList.add("today");
        }

        if (specialEvents[formattedDate]) {
            dayDiv.classList.add("event");
            dayDiv.setAttribute("title", specialEvents[formattedDate]); // Tooltip for event name
        }

        calendarBody.appendChild(dayDiv);
    }
}

prevMonthBtn.addEventListener("click", () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    generateCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener("click", () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    generateCalendar(currentMonth, currentYear);
});

generateCalendar(currentMonth, currentYear);