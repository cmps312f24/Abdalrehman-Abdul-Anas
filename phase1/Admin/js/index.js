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
        const section = course.sections.find((sc) => sc.sectionID == s.section);

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
                    <td><input type="text" class="grade-input" value="${s.grade}" onchange="changeGrade('${s.id}', this.value)"></td>
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
                    <td><input type="text" class="grade-input" value="${s.grade}" onchange="changeGrade('${s.id}', this.value)"></td>
                </tr>
        `;
        }
    }
    document.querySelector(".tbody").innerHTML = html;

}






async function displayRegisteration(button) {
    await loadPage('/Admin/Registeration.html', button);
    const data = await fetch(baseUrl + `courses?status=pending`);
    const courses = await data.json();
    await displayPendingCourses(courses);
}
async function displaypending(button) {
    await loadSubPage('/Admin/pending.html', button);
    const data = await fetch(baseUrl + `courses?status=pending`);
    const courses = await data.json();
    await displayPendingCourses(courses);
}


async function displayPendingCourses(courses) {
    document.querySelector(".tbody-pending").innerHTML = "";
    for (const c of courses) {
        for (const s of c.sections) {
            const instructorName = await getInstructorName(s.instructorID);
            document.querySelector(".tbody-pending").innerHTML+= `
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


async function displayApproved(button) {
    await loadSubPage('/Admin/approved.html', button);
    const data = await fetch(baseUrl + `courses?status=current`);
    const courses = await data.json();
    await displayApprovedCourses(courses);
}

async function displayApprovedCourses(courses) {
    await courses;
    document.querySelector(".tbody-approved").innerHTML = "";
    for (const c of courses) {
        for (const s of c.sections) {
            const instructorName = await getInstructorName(s.instructorID);
            document.querySelector(".tbody-approved").innerHTML += `
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
    // document.querySelector(".tbody").innerHTML = html;
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
        console.log(courseResponse);

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
 