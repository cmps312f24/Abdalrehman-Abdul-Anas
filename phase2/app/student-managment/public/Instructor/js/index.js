displayHome();
displayNav();

async function displayNav() {
    const user= JSON.parse(localStorage.user);
    document.getElementById("user-Name").innerHTML=user.name;
    document.getElementById("user-username").innerHTML=user.email.split("@")[0];
}

const baseUrl = "http://localhost:3000/api/";

async function loadPage(pageUrl, button) {
    const page = await fetch(pageUrl);
    const data = await page.text();
    hideMobileNav();
    document.querySelector(".content-area").innerHTML = data;

    if (button) {
        // Remove 'selected' class from all buttons
        document.querySelectorAll('.menu-element').forEach(btn => btn.classList.remove('selected'));
        // Add 'selected' class to the clicked button
        button.classList.add('selected');
        document.querySelector(".header-page-name").innerHTML=button.querySelector("p").innerHTML;
    }
}



async function loadSubPage(pageUrl,button){
    const page = await fetch(pageUrl);
    const data = await page.text();
    document.querySelector(".container").innerHTML = data;
    if(button){
        // Remove 'active' class from all buttons
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        // Add 'active' class to the clicked button
        button.classList.add('active');
    }
}

async function logout(){
    window.location.href="/Login/index.html";
    localStorage.clear();
}

async function getInstructorName(id){
    let instructor= await fetch(baseUrl+`instructors/${id}`).then (res => res.json());
    if(instructor=="none"){
        instructor=await fetch(baseUrl+`admins/${id}`).then (res => res.json());
    }
    return instructor.name;
}

async function getStudentName(id){
    let student= await fetch(baseUrl+`students/${id}`).then (res => res.json());
    return await student.name;
}

//Display Nav-mobile
async function showMobileNav(){
    document.querySelector('.nav').classList.add("show");
}
//Closing Nav-mobile
async function hideMobileNav() {
    document.querySelector('.nav').classList.remove("show");
}


// Display courses
async function displayCourses(button) {
    //load the courses page
    await loadPage('/Instructor/courses.html', button);
    // get user
    const user = JSON.parse(localStorage.user);
    //get userr sections
    const sections = user.sections.sort((a, b) => b.courseNo.localeCompare(a.courseNo));

    document.querySelector(".content").innerHTML = "";

    for (const s of sections) {
        // Fetch course data
        const data = await fetch(baseUrl + `courses/${s.courseNo}`);
        const course = await data.json();
        // get section
        const section = course.sections.find((sc) => sc.sectionID == s.section);
        if (section.status=="pending") {
            continue;
        }
        // display course
        document.querySelector(".content").innerHTML += `
            <section class="course-cotainer" onclick="displayGrades('${s.courseNo}', '${s.section}')">
                <p id="courseNumber">${course.courseNo}</p>
                <p id="courseName">${course.name}</p>
                <p id="status">${section.status}</p>
                <p id="instructor">${await getInstructorName(section.instructorID)}</p>
            </section>`;
    }

}

async function displayGrades(courseNo, sectionID) {

    const data = await fetch(baseUrl + `courses/${courseNo}`);
    const course = await data.json();
    const section = course.sections.find((s) => s.sectionID == sectionID);

    if (section.status == "pending" || section.status == "completed") {
        return alert("You can't grade this course");
    }

    await loadSubPage('/Admin/Grade.html');

    document.querySelector(".page-header").innerHTML = `
    <i class="fa-solid fa-arrow-left back-button" onclick="displayCourses()"></i>
    <h1 id="grade-h">${course.name} ${course.courseNo}</h1>
    `;
    let html = '';
    for (const s of section.students) {
        const studentName = await getStudentName(s.id);
        html += `
        <tr class="student-grade">
            <td>${studentName}</td>
            <td>${s.id}</td>
            <td>
                <select class="grade-input" onchange="changeGrade('${s.id}', this.value, '${courseNo}', '${sectionID}')">
                    <option value="A" ${s.grade === 'A' ? 'selected' : ''}>A</option>
                    <option value="B+" ${s.grade === 'B+' ? 'selected' : ''}>B+</option>
                    <option value="B" ${s.grade === 'B' ? 'selected' : ''}>B</option>
                    <option value="C+" ${s.grade === 'C+' ? 'selected' : ''}>C+</option>
                    <option value="C" ${s.grade === 'C' ? 'selected' : ''}>C</option>
                    <option value="D+" ${s.grade === 'D+' ? 'selected' : ''}>D+</option>
                    <option value="D" ${s.grade === 'D' ? 'selected' : ''}>D</option>
                    <option value="F" ${s.grade === 'F' ? 'selected' : ''}>F</option>
                </select>
            </td>
        </tr>`;;
    }
    document.querySelector(".tbody").innerHTML = html;
    document.getElementById("name-input").addEventListener("keyup", () => { sortGrade(courseNo, sectionID) });
    document.getElementById("id-input").addEventListener("keyup", () => { sortGrade(courseNo, sectionID) });
    document.querySelector(".search-button").addEventListener("click", (e) => { e.preventDefault(); sortGrade(courseNo, sectionID) });
}


async function sortGrade(courseNo,sectionID){
    const data = await fetch(baseUrl+`courses/${courseNo}`);
    const course = await data.json();
    const section = course.sections.find((s)=> s.sectionID==sectionID);

    document.querySelector(".page-header").innerHTML=`<h1>${course.name} ${course.courseNo}</h1>`;
    let html = '';
    const students= section.students.filter((s)=> s.id.includes(document.getElementById("id-input").value));
    for (const s of students) {
        const studentName = await getStudentName(s.id);
        if(studentName.toLowerCase().includes(document.getElementById("name-input").value.toLowerCase())){
        html += `
            <tr class="student-grade">
                <td>${studentName}</td>
                <td>${s.id}</td>
                <td>
                    <select class="grade-input" onchange="changeGrade('${s.id}', this.value, '${courseNo}', '${sectionID}')">
                        <option value="A" ${s.grade === 'A' ? 'selected' : ''}>A</option>
                        <option value="B+" ${s.grade === 'B+' ? 'selected' : ''}>B+</option>
                        <option value="B" ${s.grade === 'B' ? 'selected' : ''}>B</option>
                        <option value="C+" ${s.grade === 'C+' ? 'selected' : ''}>C+</option>
                        <option value="C" ${s.grade === 'C' ? 'selected' : ''}>C</option>
                        <option value="D+" ${s.grade === 'D+' ? 'selected' : ''}>D+</option>
                        <option value="D" ${s.grade === 'D' ? 'selected' : ''}>D</option>
                        <option value="F" ${s.grade === 'F' ? 'selected' : ''}>F</option>
                    </select>
                </td>
            </tr>`;
        }
    }
    document.querySelector(".tbody").innerHTML = html;
}




// change grade
async function changeGrade(id, grade, courseNo, sectionID) {
    const studentResponse = await fetch(baseUrl + `students/${id}`);
    const student = await studentResponse.json();
    student.sections.find((s) => s.courseNo == courseNo && s.section==sectionID).grade = grade;
    const courseResponse = await fetch(baseUrl + `courses/${courseNo}`);
    const course = await courseResponse.json();
    const section = course.sections.find((s) => s.sectionID == sectionID);
    section.students.find((s) => s.id == id).grade = grade;
    await fetch(baseUrl + `students/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });
    await fetch(baseUrl + `courses/${courseNo}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
    });
    alert("The grade has been changed successfully");
}





//settings

async function displaytSettings(button) {
    await loadPage('/others/settings.html', button);
    displayProfile();
    displayGpa();
    document.getElementById("changePassword").addEventListener("click", (e) => { e.preventDefault(); changePassword() });
}

async function displayGpa() {
    const user= JSON.parse(localStorage.user);
    if (user.role=="admin" || user.role=="instructor"){
        document.getElementById("gpa-section").style="display:none";
        return;
    }
    document.getElementById("gpa-bar").innerHTML+=`: ${user.gpa[user.gpa.length-1].gpa}`;
    document.querySelector(".progress-bar").style.width=`${((user.gpa[user.gpa.length-1].gpa)/4)*100}%`;
}


async function displayProfile() {
    const user = JSON.parse(localStorage.user);
    document.querySelector("#fullName").value=user.name;
    document.querySelector("#phone").value=user.phoneNo;
    document.querySelector("#id").value=user.id;
    document.querySelector("#email").value=user.email;
    if (user.role=="admin" || user.role=="instructor"){
        document.querySelector("#gpa-section").style="display:none";
        document.querySelector("#collageMajor").value=user.collage;
    }else{
        document.querySelector("#collageMajor").value=user.major;
    }

}

async function changePassword() {
    const user= JSON.parse(localStorage.user);
    const data= await fetch(baseUrl+'logins');
    const logins=await data.json();
    const userPass= logins.find((u)=> u.id==user.id).password;
    const newPass= document.getElementById("newPassword").value;
    const oldPass= document.getElementById("oldPassword").value;
    if(userPass==oldPass){
        user.password=newPass;
        const response = await fetch(baseUrl+`logins/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (response.ok) {
            alert("Password changed successfully");
        } else {
            alert("Failed to change password");
        }
    }
    else{
        alert("Old password is incorrect");
    }
    document.getElementById("oldPassword").value="";
    document.getElementById("newPassword").value="";
}




async function displayHome(button) {
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
        document.getElementById("content-home").style.gridTemplateAreas = `
        "uni-info calendar"
        "uni-info calendar"
      `;
        document.getElementById("uni-info").style="align-self:center";
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
    console.log(gpaList);
    console.log(CHList);
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
    console.log(events);
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