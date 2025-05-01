

export default async function displayHome(){
    await loadPage('/others/Home.html', button);
    displayUserInfo();
    displayUniInfo()
    calender();
}



async function displayUniInfo() {
    const data= await fetch(baseUrl+'uni');
    const info= await (await data.json()).info;
    document.querySelector("#uni-info-text").innerHTML=info.join("<br>");
}

async function displayUserInfo() {
    const user= JSON.parse(localStorage.user);
    if (user.role=="admin" || user.role=="instructor"){
        document.getElementById("stu-info").style="display:none";
    }else{
        graph();
        document.getElementById("stu-info-text").innerHTML=`Major : ${user.major} <br>GPA : ${user.gpa[user.gpa.length-1].gpa} <br>CH : ${user.gpa[user.gpa.length-1].CH}`;
    }
}

function graph() {
    const usergpa = JSON.parse(localStorage.user).gpa;
    const gpaList = [];
    const CHList = [];
    usergpa.forEach((gpa) => {
        gpaList.push(gpa.gpa);
        CHList.push(gpa.CH);
    });
    // Define the data
    var data = [
        {
            x: CHList,  // CH values
            y: gpaList,  // gpa values
            mode: 'lines+markers',
            type: 'scatter'
        }
    ];

    // Define the layout
    var layout = {
        title: 'GPA Graph',
        xaxis: { title: 'Credit Hours' },
        yaxis: { title: 'GPA' }
    };
    var config = {
        displayModeBar: true,
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'autoScale2d', 'resetScale2d']
    };
    // Render the graph
    Plotly.newPlot('myGraph', data, layout, config);
}

// calender 
async function calender() {
    const data= await fetch(baseUrl+'uni');
    const events= await (await data.json()).events;
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
    const specialEvents = events;

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
                dayDiv.classList.add("event-calender");
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
    function renderEventList(events) {
        document.querySelector(".event-container").innerHTML = ""; // Clear previous content
        const sortedDates = Object.keys(events).sort(); // Sort dates
        for (const date of sortedDates) {  
            const eventParagraph = document.createElement("p");
            eventParagraph.textContent = `${date}: ${events[date]}`;
            eventParagraph.classList.add("event");
            document.querySelector(".event-container").appendChild(eventParagraph);
            
        }
    }
    renderEventList(events);
    generateCalendar(currentMonth, currentYear);
}