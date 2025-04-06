const baseUrl = "http://localhost:3000/api/";

async function loadPage(pageUrl,button) {
    const page = await fetch(pageUrl);
    const data = await page.text();
    document.querySelector(".content-area").innerHTML = data;

    if (button){
        // Remove 'selected' class from all buttons
        document.querySelectorAll('.menu-element').forEach(btn => btn.classList.remove('selected'));
        // Add 'selected' class to the clicked button
        button.classList.add('selected');
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


// Display courses
async function displayCourses(button){
    //load the courses page
    await loadPage('/Instructor/courses.html',button);
    // get user
    const user= JSON.parse(localStorage.user);
    //get userr sections
    const sections= user.sections;

    document.querySelector(".content").innerHTML="";
    
    for (const s of sections) {
        // Fetch course data
        const data = await fetch(baseUrl+`courses/${s.courseNo}`);
        const course = await data.json();
        // get section
        const section = course.sections.find((sc)=> sc.sectionID==s.section);

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

async function displayGrades(courseNo,sectionID){
    const data = await fetch(baseUrl+`courses/${courseNo}`);
    const course = await data.json();
    const section = course.sections.find((s)=> s.sectionID==sectionID);

    await loadSubPage('/Instructor/Grade.html');
   
    document.querySelector(".page-header").innerHTML=`<h1>${course.name} ${course.courseNo}</h1>`;
    let html = '';
    for (const s of section.students) {
        const studentName = await getStudentName(s.id);
        html += `
            <tr class="student-grade">
                    <td>${studentName}</td>
                    <td>${s.id}</td>
                    <td><input type="text" class="grade-input" value="${s.grade}" onchange="changeGrade('${s.id}', this.value)"></td>
                </tr>
        `;
    }
    document.querySelector(".tbody").innerHTML = html;
}







async function displayRegisteration(button){
    await loadPage('/Admin/Registeration.html',button);
    const data = await fetch(baseUrl+`courses`);
    const courses = await data.json();
    await displayPendingCourses(courses);
}
async function displaypending(button){
    await loadSubPage('/Admin/pending.html',button);
    const data = await fetch(baseUrl+`courses`);
    const courses = await data.json();
    await displayPendingCourses(courses);
}


async function displayPendingCourses(courses){
    document.querySelector(".tbody").innerHTML="";
    let html='';
    for (const c of courses) {
        for (const s of c.sections) {
            const instructorName = await getInstructorName(s.instructorID);
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
                    <td class="add-box"><button class="add-button">+</button></td>
                </tr>
            `;
        }
    }
    document.querySelector(".tbody").innerHTML=html;
}


async function displayApproved(button){
    await loadSubPage('/Admin/approved.html',button);
    const data = await fetch(baseUrl+`courses`);
    const courses = await data.json();
    await displayApprovedCourses(courses);
}

async function displayApprovedCourses(courses){
    document.querySelector(".tbody").innerHTML="";
    let html='';
    for (const c of courses) {
        for (const s of c.sections) {
            const instructorName = await getInstructorName(s.instructorID);
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
                    <td class="add-box"><button class="add-button">-</button></td>
                </tr>
            `;
        }
    }
    document.querySelector(".tbody").innerHTML=html;
}

// Adding new course
document.querySelector("#addCourse").addEventListener("click",()=>{
    const form = document.querySelector(".form-container");
    const formData = new FormData(form);
    
})



