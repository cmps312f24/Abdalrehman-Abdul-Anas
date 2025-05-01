displayHome();
displayNav();

async function displayNav() {
    const user= JSON.parse(localStorage.user);
    document.getElementById("user-Name").innerHTML=user.name;
    document.getElementById("user-username").innerHTML=user.email.split("@")[0];
}

const baseUrl = "http://localhost:3000/api/";


//Display Nav-mobile
async function showMobileNav(){
    document.querySelector('.nav').classList.add("show");
}
//Closing Nav-mobile
async function hideMobileNav() {
    document.querySelector('.nav').classList.remove("show");
}

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



async function loadSubPage(pageUrl, button) {
    const page = await fetch(pageUrl);
    const data = await page.text();
    document.querySelector(".container").innerHTML = data;
    if (button) {
        // Remove 'active' class from all buttons
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        // Add 'active' class to the clicked button
        button.classList.add('active');
    }
}
async function logout() {
    window.location.href = "/Login/index.html";
    localStorage.clear();
}

function searchInObject(obj, keyword) {
    const lowerKeyword = keyword.toLowerCase();

    function recursiveSearch(value) {
        if (typeof value === 'string') {
            return value.toLowerCase().includes(lowerKeyword);
        } else if (Array.isArray(value)) {
            return value.some(item => recursiveSearch(item));
        } else if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(val => recursiveSearch(val));
        }
        return false;
    }

    return recursiveSearch(obj);
}

async function getInstructorName(id) {
    let instructor = await fetch(baseUrl + `instructors/${id}`).then(res => res.json());
    if (instructor == "none") {
        instructor = await fetch(baseUrl + `admins/${id}`).then(res => res.json());
    }
    return instructor.name;
}


// Display courses
async function displayCourses(button) {
    //load the courses page
    await loadPage('/Student/courses.html', button);
    // get user
    const user = JSON.parse(localStorage.user);
    //get userr sections
    const sections = user.sections.sort((a, b) => b.status.localeCompare(a.status));

    document.querySelector(".content").innerHTML = "";

    for (const s of sections) {
        // Fetch course data
        const data = await fetch(baseUrl + `courses/${s.courseNo}`);
        const course = await data.json();
        // get section
        const section = course.sections.find((sc) => sc.sectionID == s.section);

        // display course
        document.querySelector(".content").innerHTML += `
            <section class="course-cotainer">
                <p id="courseNumber">${course.courseNo}</p>
                <p id="courseName">${course.name}</p>
                <p id="status">${s.status}</p>
                <p id="instructor">${await getInstructorName(section.instructorID)}</p>
            </section>`;
    }

}


async function displayRegisteration(button) {
    await loadPage('/Student/Registeration.html', button);
    const data = await fetch(baseUrl + `courses?status=pending`);
    const courses = await data.json();

    // button handler
    regbuttons(courses);

    document.getElementById("college-input").addEventListener("keyup", () => { displayRegisterCourses(courses) });
    document.getElementById("id-input").addEventListener("keyup", () => { displayRegisterCourses(courses) });
    document.getElementById("keyword-input").addEventListener("keyup", () => { displayRegisterCourses(courses) });
    document.querySelector(".search-button").addEventListener("click", (e) => { e.preventDefault(); displayRegisterCourses(courses) });
    await displayRegisterCourses(courses);
}
async function displayRegister(button) {
    await loadSubPage('/Student/Search.html', button);
    const data = await fetch(baseUrl + `courses?status=pending`);
    const courses = await data.json();

    // button handler
    regbuttons(courses);

    document.getElementById("college-input").addEventListener("keyup", () => { displayRegisterCourses(courses) });
    document.getElementById("id-input").addEventListener("keyup", () => { displayRegisterCourses(courses) });
    document.getElementById("keyword-input").addEventListener("keyup", () => { displayRegisterCourses(courses) });
    document.querySelector(".search-button").addEventListener("click", (e) => { e.preventDefault(); displayRegisterCourses(courses) });
    await displayRegisterCourses(courses);
}

async function displayRegisterCourses(courses) {
    const student = JSON.parse(localStorage.user);
    const college = document.getElementById("college-input").value;
    const id = document.getElementById("id-input").value;
    const keyword = document.getElementById("keyword-input").value;

    document.querySelector(".tbody").innerHTML = "";
    let html = '';
    for (const c of courses) {
        const sections = c.sections.filter((section) => student.pendingSections.find((s) => s.courseNo == c.courseNo && s.section == section.sectionID) == undefined);
        for (const s of sections) {
            const instructorName = await getInstructorName(s.instructorID);
            if (c.college.toLowerCase().includes(college.toLowerCase()) && c.courseNo.toLowerCase().includes(id.toLowerCase()) && (searchInObject(c, keyword) || instructorName.toLowerCase().includes(keyword.toLowerCase()) || s.sectionID.toLowerCase().includes(keyword.toLowerCase())) && (getSelectedCampus() == s.campus || getSelectedCampus() == null)) {
                html += `
                    <tr class="table-body-row">
                        <td>${c.courseNo}</td>
                        <td>${c.name}</td>
                        <td>${s.sectionID}</td>
                        <td>${c.credit}</td>
                        <td>${instructorName}</td>
                        <td>${c.college}</td>
                        <td>${s.timing}/${s.place}</td>
                        <td>${s.students.length}/${s.capacity}</td>
                        <td>${s.campus}</td>
                        <td class="add-box"><button class="add-button" onclick="registerCourse('${c.courseNo}','${s.sectionID}')">+</button></td>
                    </tr>
                `;
            }
        }
    }
    document.querySelector(".tbody").innerHTML = html;
}


async function displaySchedule(button) {
    await loadSubPage('/Student/Schedule.html', button);
    //a map to find the child index to be modified
    const hoursIndex={"8:00am":1,"9:00am":2,"10:00am":3,"11:00am":4,"12:00pm":5,"1:00pm":6,"2:00pm":7,"3:00pm":8,"4:00pm":9,"5:00pm":10,"6:00pm":11,"7:00pm":12,"8:00pm":13}
    //get user
    const user = JSON.parse(localStorage.user);
    //get user sections
    const sections = user.pendingSections;
    for (const s of sections) {
        // Fetch course data
        const data = await fetch(baseUrl + `courses/${s.courseNo}`);
        const course = await data.json();
        // get section
        const section = course.sections.find((sc) => sc.sectionID == s.section);
        const timing = section.timing.substring(0,6);
        const days = section.dow;
        if (course.category == "Lecture") {            
            //select the days columns 
            if(days.length=="sun/tue/thu"){     
                const cells = document.querySelectorAll(`tbody tr:nth-child(${hoursIndex[timing]}) .sun, tbody tr:nth-child(${hoursIndex[timing]}) .tue, tbody tr:nth-child(${hoursIndex[timing]}) .thu`);
                cells.forEach(cell => {
                cell.classList.add("schedualed-cell"); //To add styling
                cell.innerHTML = `${course.name}`; //Add course name
            });
            }
            else{
                const cells = document.querySelectorAll(`tbody tr:nth-child(${hoursIndex[timing]}) .mon, tbody tr:nth-child(${hoursIndex[timing]}) .wed`);
                cells.forEach(cell => {
                    cell.classList.add("schedualed-cell"); //To add styling
                    cell.innerHTML = `${course.name}`; //Add course name
                });
            }
        } else {
            const cell = document.querySelector(`tbody tr:nth-child(${hoursIndex[timing]}) .${days}`);
            //removing the next 2 rows to prevent overflow
            document.querySelector(`tbody tr:nth-child(${hoursIndex[timing]+1}) .${days}`).remove();
            document.querySelector(`tbody tr:nth-child(${hoursIndex[timing]+2}) .${days}`).remove();
            cell.classList.add("schedualed-cell");
            //the lab duration is 3 hours
            cell.setAttribute('rowspan', '3');
            cell.innerHTML = `${course.name}`;
        }
    }

}



async function displaySummary(button) {
    loadSubPage('/Student/Summary.html', button);
    const data = await fetch(baseUrl + `courses`);
    const courses = await data.json();
    const user = JSON.parse(localStorage.user);
    const sections = user.pendingSections;
    document.querySelector(".tbody").innerHTML = "";
    for (const s of sections) {
        // Fetch course data
        const course = await courses.find((c) => c.courseNo == s.courseNo);
        // get section
        const index = await course.sections.findIndex((sc) => sc.sectionID == s.section);
        const section = course.sections[index];
        // display course
        document.querySelector(".tbody").innerHTML += `
            <tr class="table-body-row">
                    <td>${course.courseNo}</td>
                    <td>${course.name}</td>
                    <td>${section.sectionID}</td>
                    <td>${course.credit}</td>
                    <td>${await getInstructorName(section.instructorID)}</td>
                    <td>${course.college}</td>
                    <td>${section.timing}/${section.place}</td>
                    <td>${section.students.length}/${section.capacity}</td>
                    <td>${section.campus}</td>
                    <td class="add-box"><button class="add-button" onclick="WithdrawCourse('${course.courseNo}','${index}')">-</button></td>
            </tr>
            `;
    }
}




function regbuttons(courses) {
    // Toggle expand/collapse functionality
    const toggleButton = document.getElementById('toggle-expand');
    const expandIcon = document.getElementById('expand-icon');
    const collapseIcon = document.getElementById('collapse-icon');
    const expandableSection = document.querySelectorAll('.expandable-section');

    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        clearSelectedCampus();
        document.getElementById("keyword-input").value = "";
        displayRegisterCourses(courses);

        expandableSection.forEach(section => {
            const isExpanded = section.style.display != 'none';
            section.style.display = isExpanded ? 'none' : 'block';
            expandIcon.style.display = isExpanded ? 'block' : 'none';
            collapseIcon.style.display = isExpanded ? 'none' : 'block';
        });
    });

    // Campus selection functionality
    const campusButtons = document.querySelectorAll('.campus-button');

    campusButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            displayRegisterCourses(courses);

            // If already selected, unselect it
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
            } else {
                // Deselect all, then select this one
                campusButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
}

function clearSelectedCampus() {
    const campusButtons = document.querySelectorAll('.campus-button');
    campusButtons.forEach(btn => btn.classList.remove('selected'));
}

function getSelectedCampus() {
    const selectedButton = document.querySelector('.campus-button.selected');
    return selectedButton ? selectedButton.dataset.campus : null;
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


async function registerCourse(courseNo, sectionID) {
    const studentsUrl = baseUrl + "students/";
    // getting section by index
    const courses=await fetch(`${baseUrl}courses`).then(res => res.json());
    const course = await courses.find((c) => c.courseNo == courseNo);
    const section = course.sections.find((sc) => sc.sectionID == sectionID);
    //getting student from local storage(user)
    const student = JSON.parse(localStorage.user);
    //Check if student already registered in same course --> checking if same course and same category
    let inSections = student.sections.find((sec) => sec.courseNo == course.courseNo && sec.section[0] == section.sectionID[0]) ? true : false;
    let inPendingSection = student.pendingSections.find((sec) => sec.courseNo == course.courseNo && sec.section[0] == section.sectionID[0]) ? true : false;
    if (inSections || inPendingSection) {
        alert("Course is already registered");
        return;
    }
    // Check if time conflict with other courses
    let CH=0;
    const timeConflict = student.pendingSections.some((s) => {
        const course = courses.find((c) => c.courseNo == s.courseNo);
        const sc = course.sections.find((sc) => sc.sectionID == s.section);
        CH+=Number(course.credit);
        return (sc.timing==section.timing && sc.dow === section.dow );
    })
    if (timeConflict) {
        alert("Time conflict with other courses");
        return;
    }
    if(CH+Number(course.credit)>18){
        alert("You can't register more than 18 CH");
        return;
    }
    // check gender with campus
    if (student.gender!=section.campus){
        alert("You are not allowed to register in this section");
        return;
    }

    // check prerequit
    const data= await fetch(baseUrl + `uni/paths/${student.major.replace(/\s+/g, '')}`);
    const pre= await (await data.json()).courses.find((c)=> c.courseNo==course.courseNo).prerequests;
    if(pre && pre.find((p)=> student.sections.find((s)=> s.courseNo==p && s.status=="completed")==undefined)){
        alert("You have to register the prerequest first");
        return;
    }

    if (section.capacity <= section.students.length) {
        alert("Section is full");
        return;
    }

    // Add student to section
    section.students.push({ "id": student.id, "grade": "" });

    // Add section to student pendding sections
    student.pendingSections.push({ "courseNo": course.courseNo, "section": section.sectionID });

    //update course in API
    await fetch(baseUrl + `courses/${course.courseNo}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
    });

    //update user in API
    await fetch(`${studentsUrl}${student.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });
    //update user in local storage
    localStorage.user = JSON.stringify(student);
    alert("Course has registered successfully");
    displayRegister(document.querySelector(".nav-button.active"));
}

async function WithdrawCourse(courseNo, sectionIndex) {
    const studentsUrl = baseUrl + "students/";
    // getting section by index
    const course = await fetch(`${baseUrl}courses/${courseNo}`).then(res => res.json());
    const section = course.sections[sectionIndex]
    //getting student from local storage(user)
    const student = JSON.parse(localStorage.user);
    //Find the index of the section to remove
    const index = student.pendingSections.findIndex((sec) => sec.courseNo == course.courseNo && sec.section == section.sectionID);

    if (index === -1) {
        alert("Course is not registered");
        return;
    }

    // Remove student from section
    section.students = section.students.filter((s) => s.id != student.id);

    // Remove section from student pendding sections
    student.pendingSections.splice(index, 1);

    //update course in API
    await fetch(baseUrl + `courses/${course.courseNo}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
    });

    //update user in API
    await fetch(`${studentsUrl}${student.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });

    //update user in local storage
    localStorage.user = JSON.stringify(student);

    alert("Course has withdrawn successfully");


    displaySummary(document.querySelector(".nav-button.active"));

}



// path implementation
async function displayPath(button){
    await loadPage('/Student/Path.html', button);
    const student = JSON.parse(localStorage.user);
    const data =await fetch(baseUrl + `uni/paths/${student.major.replace(/\s+/g, '')}`);
    const courses= await (await data.json()).courses;

    const content= document.querySelector("#Flowchart-content");

    let index=1;
    for (const c of courses){

        const section= student.sections.find((s)=> s.courseNo==c.courseNo) || (student.pendingSections.find((s)=> s.courseNo==c.courseNo)? {"status":"pending","grade":"N/A"}:{"status":"uncompleted","grade":"N/A"});
        const mapColor={
            "completed": "#359A6C",
            "pending": "#E9DC78",
            "current": "#F19A2F",
            "uncompleted": "#101820"
        }
        if (c.name!="empty"){
            content.innerHTML += `
            <span class="course" id="c${index}" style="background-color: ${mapColor[section.status]};">
                ${c.name}<br>${c.courseNo}
                <div class="course-details">
                    <div>Credits: ${c.credit}</div>
                    <div>Status: ${section.status}</div>
                    <div>Grade: ${section.grade}</div>
                </div>
            </span>
            `;
            index++;
        }
        
    }
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
