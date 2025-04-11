displayHome(document.getElementById("home-btn"));

const baseUrl = "http://localhost:3000/api/";

async function loadPage(pageUrl, button) {
    const page = await fetch(pageUrl);
    const data = await page.text();
    document.querySelector(".content-area").innerHTML = data;

    if (button) {
        // Remove 'selected' class from all buttons
        document.querySelectorAll('.menu-element').forEach(btn => btn.classList.remove('selected'));
        // Add 'selected' class to the clicked button
        button.classList.add('selected');
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

async function getStudentName(id) {
    let student = await fetch(baseUrl + `students/${id}`).then(res => res.json());
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
    hideMobileNav()
    //load the courses page
    await loadPage('/Instructor/courses.html', button);
    // get user
    const user = JSON.parse(localStorage.user);
    //get userr sections
    const sections = user.sections;

    document.querySelector(".content").innerHTML = "";

    for (const s of sections) {
        // Fetch course data
        const data = await fetch(baseUrl + `courses/${s.courseNo}`);
        const course = await data.json();
        // get section
        const section = (course.sections.find((sc) => sc.sectionID == s.section));
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

    document.querySelector(".page-header").innerHTML = `<h1>${course.name} ${course.courseNo}</h1>`;
    let html = '';
    for (const s of section.students) {
        const studentName = await getStudentName(s.id);
        html += `
            <tr class="student-grade">
                    <td>${studentName}</td>
                    <td>${s.id}</td>
                    <td><input type="text" class="grade-input" value="${s.grade}" onchange="changeGrade('${s.id}', this.value, '${courseNo}','${sectionID}')"></td>
                </tr>
        `;
    }
    document.querySelector(".tbody").innerHTML = html;
    document.getElementById("name-input").addEventListener("keyup", () => { sortGrade(courseNo, sectionID) });
    document.getElementById("id-input").addEventListener("keyup", () => { sortGrade(courseNo, sectionID) });
    document.querySelector(".search-button").addEventListener("click", (e) => { e.preventDefault(); sortGrade(courseNo, sectionID) });
}


async function sortGrade(courseNo, sectionID) {
    const data = await fetch(baseUrl + `courses/${courseNo}`);
    const course = await data.json();
    const section = course.sections.find((s) => s.sectionID == sectionID);

    document.querySelector(".page-header").innerHTML = `<h1>${course.name} ${course.courseNo}</h1>`;
    let html = '';
    const students = section.students.filter((s) => s.id.includes(document.getElementById("id-input").value));
    for (const s of students) {
        const studentName = await getStudentName(s.id);
        if (studentName.toLowerCase().includes(document.getElementById("name-input").value.toLowerCase())) {
            html += `
            <tr class="student-grade">
                    <td>${studentName}</td>
                    <td>${s.id}</td>
                    <td><input type="text" class="grade-input" value="${s.grade}" onchange="changeGrade('${s.id}', this.value, '${courseNo}','${sectionID}')"></td>
                </tr>
        `;
        }
    }
    document.querySelector(".tbody").innerHTML = html;

}





// Display pending courses
async function displayRegisteration(button) {
    hideMobileNav()
    await loadPage('/Admin/Registeration.html', button);
    const data = await fetch(baseUrl + `courses?status=pending`);
    const courses = await data.json();
    document.getElementById("college-input").addEventListener("keyup", () => { displayPendingCourses(courses) });
    document.getElementById("id-input").addEventListener("keyup", () => { displayPendingCourses(courses) });
    document.querySelector(".search-button").addEventListener("click", (e) => { e.preventDefault(); displayPendingCourses(courses) });
    await displayPendingCourses(courses);
}
async function displaypending(button) {
    await loadSubPage('/Admin/pending.html', button);
    const data = await fetch(baseUrl + `courses?status=pending`);
    const courses = await data.json();
    document.getElementById("college-input").addEventListener("keyup", () => { displayPendingCourses(courses) });
    document.getElementById("id-input").addEventListener("keyup", () => { displayPendingCourses(courses) });
    document.querySelector(".search-button").addEventListener("click", (e) => { e.preventDefault(); displayPendingCourses(courses) });
    await displayPendingCourses(courses);
}

async function displayPendingCourses(courses) {
    await courses;
    // filters
    const college = document.getElementById("college-input").value;
    const id = document.getElementById("id-input").value;
    document.querySelector(".tbody-pending").innerHTML= "loading...";
    let html = '';
    for (const c of courses) {
        for (const s of c.sections) {
            const instructorName = await getInstructorName(s.instructorID);
            if (c.college.toLowerCase().includes(college.toLowerCase()) && c.courseNo.toLowerCase().includes(id.toLowerCase()) ) {
                html+= `
                    <tr class="table-body-row">
                        <td>${c.courseNo}</td>
                        <td>${c.name}</td>
                        <td>${s.sectionID}</td>
                        <td>${c.credit}</td>
                        <td>${instructorName}</td>
                        <td>${c.college}</td>
                        <td>${s.timing}/${s.place}</td>
                        <td>${s.status}</td>
                        <td>${c.category}</td>
                        <td class="add-box"><button class="add-button" onclick="approveCourse('${c.courseNo}','${s.sectionID}')">+</button></td>
                    </tr>
                `;
            }
        }
    }
    document.querySelector(".tbody-pending").innerHTML= html;
}

// Display approved courses
async function displayApproved(button) {
    await loadSubPage('/Admin/approved.html', button);
    const data = await fetch(baseUrl + `courses?status=current`);
    const courses = await data.json();

    document.getElementById("college-input").addEventListener("keyup", () => { displayApprovedCourses(courses) });
    document.getElementById("id-input").addEventListener("keyup", () => { displayApprovedCourses(courses) });
    document.querySelector(".search-button").addEventListener("click", (e) => { e.preventDefault(); displayApprovedCourses(courses) });
    await displayApprovedCourses(courses);
}



async function displayApprovedCourses(courses) {
    await courses;
    // filters
    const college = document.getElementById("college-input").value;
    const id = document.getElementById("id-input").value;
    document.querySelector(".tbody-approved").innerHTML = "loading...";
    let html = '';
    for (const c of courses) {
        for (const s of c.sections) {
            const instructorName = await getInstructorName(s.instructorID);
            if (c.college.toLowerCase().includes(college.toLowerCase()) && c.courseNo.toLowerCase().includes(id.toLowerCase())) {    
                html += `
                    <tr class="table-body-row">
                        <td>${c.courseNo}</td>
                        <td>${c.name}</td>
                        <td>${s.sectionID}</td>
                        <td>${c.credit}</td>
                        <td>${instructorName}</td>
                        <td>${c.college}</td>
                        <td>${s.timing}/${s.place}</td>
                        <td>${s.status}</td>
                        <td>${c.category}</td>
                        <td class="add-box"><button class="complete-button" onclick="completeCourse('${c.courseNo}','${s.sectionID}')">complete</button></td>
                    </tr>
                `;
            }
        }
    }
    document.querySelector(".tbody-approved").innerHTML = html;
}


// Add new course or section :
async function displayAddCourse(pageUrl, button) {
    //Load add course screeen
    await loadSubPage(pageUrl, button);
    // adding course
    document.querySelector(".form-container").addEventListener("submit", async function (event) {
        event.preventDefault(); // Stop submitting
        const formData = new FormData(event.target);
        // retrieve the course if it exist
        const courseResponse = (await fetch(baseUrl + `courses/${formData.get("courseNumber")}`));

        // creating the section
        const section = {
            sectionID: formData.get("courseSection"),
            instructorID: formData.get("instructorID"),
            place: formData.get("place"),
            timing: formData.get("timing"),
            dow: formData.get("category") == "lecture" ? "sun/tue/thu" : "mon/wed",
            campus: formData.get("campus"),
            status: "pending",
            students: []
        };
        // if the course already exist => add the new section
        if (courseResponse.ok) {
            const course = await courseResponse.json();
            course.sections.push(section);
            await fetch(baseUrl + `courses/${course.courseNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(course)
            });
        }
        // if the course doesn't exist => create new course
        else {
            const course = {
                name: formData.get("courseName"),
                credit: formData.get("credit"),
                courseNo: formData.get("courseNumber"),
                category: formData.get("category"),
                college: formData.get("college"),
                sections: [section]
            };
            await fetch(baseUrl + `courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(course)
            });
        }
        alert("The course has been added successfully");
        displaypending(document.getElementById("pending-button"));
    });

}

async function approveCourse(courseNo, sectionID) {
    const courseResponse = await fetch(baseUrl + `courses/${courseNo}`);
    const course = await courseResponse.json();
    const section = course.sections.find(s => s.sectionID == sectionID);
    section.status = "current";
    for (std of section.students) {
        const studentResponse = await fetch(baseUrl + `students/${std.id}`);
        const student = await studentResponse.json();
        student.sections.push(
            {
            "courseNo": courseNo,
            "section": sectionID,
            "status": "current",
            "grade": ""
        }
    );
        await fetch(baseUrl + `students/${std.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });
    }
    await fetch(baseUrl + `courses/${courseNo}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
    });
    alert(`${courseNo}_${sectionID} has been approved`);
    displaypending(document.getElementById("pending-button"));
}

async function completeCourse(courseNo, sectionID) {
    const courseResponse = await fetch(baseUrl + `courses/${courseNo}`);
    const course = await courseResponse.json();
    const section = course.sections.find(s => s.sectionID == sectionID);
    section.status = "complete";
    for (std of section.students) {
        const studentResponse = await fetch(baseUrl + `students/${std.id}`);
        const student = await studentResponse.json();
        student.sections.find(s=> s.courseNo == courseNo).status="completed";
        await fetch(baseUrl + `students/${std.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });
    }
    await fetch(baseUrl + `courses/${courseNo}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
    });
    alert(`${courseNo}_${sectionID} is now completed`);
    displayApproved(document.getElementById("approved-button"));
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
    hideMobileNav()
    await loadPage('/others/settings.html', button);
    displayProfile();
    document.getElementById("changePassword").addEventListener("click", (e) => { e.preventDefault(); changePassword() });
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
    hideMobileNav()
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
