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

    document.querySelector(".page-header").innerHTML = `<h1>${course.name} ${course.courseNo}</h1>`;
    let html = '';
    for (const s of section.students) {
        const studentName = await getStudentName(s.id);
        html += `
            <tr class="student-grade">
                    <td>${studentName}</td>
                    <td>${s.id}</td>
                    <td><input type="text" class="grade-input" value="${s.grade}" onchange="changeGrade('${s.id}', this.value, ${courseNo},${sectionID})"></td>
                </tr>
        `;
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
                    <td><input type="text" class="grade-input" value="${s.grade}" onchange="changeGrade('${s.id}', this.value, ${courseNo},${sectionID})"></td>
                </tr>
        `;
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
