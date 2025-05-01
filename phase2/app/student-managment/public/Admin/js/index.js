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
        </tr>`;
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





// Display pending courses
async function displayRegisteration(button) {
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
                        <td>${s.students.length}/${s.capacity}</td>
                        <td>${c.category=="Lecture"&&s.sectionID[0]=="L"?c.category:"Lab"}</td>
                        <td class="add-box"><button class="add-button" onclick="removeCourse('${c.courseNo}','${s.sectionID}')">-</button></td>
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
                        <td>${c.category=="Lecture"&&s.sectionID[0]=="L"?c.category:"Lab"}</td>
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
    addCourse();
}

async function addCourse() {
    document.querySelector(".form-container").addEventListener("submit", async function (event) {
        event.preventDefault(); // Stop submitting
        const formData = new FormData(event.target);
        // retrieve the course if it exist
        const courseResponse = await fetch(baseUrl + `courses/${formData.get("courseNumber")}`);

        //Check the Instructor
        let instructor = await fetch(baseUrl + `instructors/${formData.get("instructorID")}`).then(res => res.json());
                
        if (instructor == "none") {
            instructor = await fetch(baseUrl + `admins/${formData.get("instructorID")}`).then(res => res.json());
            
            if (instructor == "none") {
                
            alert("Instructor not found.\n Please enter valid instructor ID");
            return;
            }
        }
        //section timing
        let startTiming = Number(formData.get("timing"))>=12 ? `${Number(formData.get("timing"))-12}:00pm` : `${formData.get("timing")}:00am`;
        let LectureEndTiming = Number(formData.get("timing"))+1>=12 ? `${Number(formData.get("timing"))+1-12}:00pm` : `${Number(formData.get("timing"))+1}:00am`;
        let LabEndTiming = Number(formData.get("timing"))+3 >=12 ? `${Number(formData.get("timing"))+3-12}:00pm` : `${Number(formData.get("timing"))+3}:00am`;
        startTiming = startTiming=="0:00pm" ? "12:00pm" : startTiming;
        LectureEndTiming = LectureEndTiming=="0:00pm" ? "12:00pm" : LectureEndTiming;
        LabEndTiming = LabEndTiming=="0:00pm" ? "12:00pm" : LabEndTiming;

        // creating the section
        const section = {
            sectionID: `${formData.get("category")=="Lecture"?"L":"B"}${formData.get("courseSection").length == 1 ? "0" + formData.get("courseSection") : formData.get("courseSection")}`,
            instructorID: formData.get("instructorID"),
            place: formData.get("place"),
            timing: `${startTiming}-${formData.get("category") == "Lecture" ? LectureEndTiming : LabEndTiming}`,
            dow: formData.get("days"),
            campus: formData.get("campus"),
            capacity: formData.get("capacity"),
            status: "pending",
            students: []
        };
        // if the course already exist => add the new section
        const course = await courseResponse.json();
        if (course!="none") {
            //check if the section already exist
            const sectionExist = course.sections.find(s => s.sectionID == section.sectionID);
            if (sectionExist) {
                alert("This section already exist. Change the section ID.");
                return;
            }
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

        //Assign the new section to the instructor
        instructor.sections.push({"courseNo": course.courseNo, "section": section.sectionID});
        await fetch(baseUrl + `${instructor.role}s/${instructor.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(instructor)
        });

        alert("The course has been added successfully");
        displaypending(document.getElementById("pending-button"));
    });
}

async function categoryChange(value) {
        if (value == "Lecture") {
            document.querySelector(".prefix").innerHTML = "L";
            document.querySelector("#days").innerHTML =`
            <option value="sun/tue/thu" selected>Sunday-Tuesday-Thursday</option>
            <option value="mon/wed">Monday-Wednesday</option>
            `
        }
        else if (value == "Lab") {
            document.querySelector(".prefix").innerHTML = "B";
            document.querySelector("#days").innerHTML =`
            <option value="sun" selected>Sunday</option>
            <option value="mon">Monday</option>
            <option value="tue">Tuesday</option>
            <option value="wed">Wednesday</option>
            <option value="thu">Thursday</option>
            `
        }
}

//--- Approve Course ---
async function approveCourse(courseNo, sectionID) {
    const courseResponse = await fetch(baseUrl + `courses/${courseNo}`);
    const course = await courseResponse.json();
    const section = course.sections.find(s => s.sectionID == sectionID);
    section.status = "current";
    for (std of section.students) {
        const studentResponse = await fetch(baseUrl + `students/${std.id}`);
        const student = await studentResponse.json();
        student.pendingSections.splice(student.pendingSections.findIndex(s=>s.section==sectionID&&s.courseNo==courseNo),1);
        student.sections.push(
            {
            "courseNo": courseNo,
            "section": sectionID,
            "status": "current",
            "grade": "F"
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
//--- Remove Course ---
async function removeCourse(courseNo, sectionID) {
    const course = await fetch(baseUrl + `courses/${courseNo}`).then(res => res.json());
    const sectionIndex = course.sections.findIndex(s => s.sectionID == sectionID);
    const section = course.sections[sectionIndex];
    let instructor = await fetch(baseUrl + `instructors/${section.instructorID}`).then(res => res.json());     
    if (instructor == "none") {
        instructor = await fetch(baseUrl + `admins/${formData.get("instructorID")}`).then(res => res.json());
    }
    const indexi=instructor.sections.findIndex(s => s.section == sectionID && s.courseNo == courseNo);
    instructor.sections.splice(indexi,1);

    course.sections.splice(sectionIndex, 1);
    for (std of section.students) {
        const student = await fetch(baseUrl + `students/${std.id}`).then(res => res.json());
        const index=student.pendingSections.findIndex(s => s.courseNo == courseNo);
        student.pendingSections.splice(index,1);
        await fetch(baseUrl + `students/${std.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });
    }

    await fetch(baseUrl + `${instructor.role}s/${instructor.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(instructor)
    });
    
    await fetch(baseUrl + `courses/${courseNo}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
    });


    alert(`${courseNo}_${sectionID} has been removed`);
    displaypending(document.getElementById("pending-button"));
}

// --- complete course ---
async function completeCourse(courseNo, sectionID) {
    const courseResponse = await fetch(baseUrl + `courses/${courseNo}`);
    const course = await courseResponse.json();
    const section = course.sections.find(s => s.sectionID == sectionID);
    section.status = "complete";
    for (std of section.students) {
        const studentResponse = await fetch(baseUrl + `students/${std.id}`);
        const student = await studentResponse.json();
        student.sections.find(s=> s.courseNo == courseNo).status="completed";
        const gradeMap = {
            "A": 4.0,
            "B+": 3.5,
            "B": 3.0,
            "C+": 2.5,
            "C": 2.0,
            "D+": 1.5,
            "D": 1.0,
            "F": 0.0
        };
        const grade=gradeMap[student.sections.find(s=> s.courseNo == courseNo).grade];
        const currentgpa=student.gpa[student.gpa.length-1];
        if (currentgpa){
            const credit=sectionID[0]=="B"&&course.credit==3? currentgpa.CH : currentgpa.CH+course.credit;   
            credit!=currentgpa.CH? student.gpa.push({
                "CH": credit,
                "gpa": Number((((currentgpa.gpa*currentgpa.CH)+(grade*course.credit))/(credit)).toFixed(2))
            }):"";
        }else{
            student.gpa.push({
                "CH": course.credit,
                "gpa":grade
            });
        }
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
