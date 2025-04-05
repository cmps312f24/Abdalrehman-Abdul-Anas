const baseUrl = "http://localhost:3000/api/";

async function loadPage(pageUrl,button) {
    const page = await fetch(pageUrl);
    const data = await page.text();
    document.querySelector(".content-area").innerHTML = data;

    // Remove 'selected' class from all buttons
    document.querySelectorAll('.menu-element').forEach(btn => btn.classList.remove('selected'));
    // Add 'selected' class to the clicked button
    button.classList.add('selected');
}

async function loadSubPage(pageUrl,button){
    const page = await fetch(pageUrl);
    const data = await page.text();
    document.querySelector(".container").innerHTML = data;

    // Remove 'active' class from all buttons
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    // Add 'active' class to the clicked button
    button.classList.add('active');
}


async function getInstructorName(id){
    const instructor= await fetch((baseUrl+`instructors/${id}`) || await fetch(baseUrl+`admins/${id}`)).then (res => res.json());
    return instructor.name;
}



// Display courses
async function displayCourses(button){
    //load the courses page
    await loadPage('/Student/courses.html',button);
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
            <section class="course-cotainer">
                <p id="courseNumber">${course.courseNo}</p>
                <p id="courseName">${course.name}</p>
                <p id="status">${s.status}</p>
                <p id="instructor">${await getInstructorName(section.instructorID)}</p>
            </section>`;
    }
    
}


async function displayRegisteration(button){
    await loadPage('/Student/Registeration.html',button);
    const data = await fetch(baseUrl+`courses`);
    const courses = await data.json();
    displayallCourses(courses);
}

function displayallCourses(courses){
    document.getElementsByTagName("tbody").innerHTML=courses.forEach((c)=>{c.sections.map((s)=>{
        return `
            <tr class="table-body-row">
                <td>${c.courseNo}</td>
                <td>${c.name}</td>
                <td>${s.sectionID}</td>
                <td>${c.credit}</td>
                <td>${getInstructorName(s.instructorID)}</td>
                <td>${c.college}</td>
                <td>${s.timing}/${s.place}</td>
                <td>${s.status}</td>
                <td>${s.campus}</td>
                <td class="add-box"><button class="add-button">+</button></td>
            </tr>
        `
    })});
}





async function displaySchedule(button){
    loadSubPage('/Student/Schedule.html',button);

}



async function displaySummary(button){
    loadSubPage('/Student/Summary.html',button);
    const user= JSON.parse(localStorage.user);
    const sections= user.pendingSections;
    document.getElementsByTagName("tbody").innerHTML="";
    for (const s of sections) {
        // Fetch course data
        const data = await fetch(baseUrl+`courses/${s.courseNo}`);
        const course = await data.json();
        // get section
        const section = course.sections.find((sc)=> sc.sectionID==s.section);
        
        
        //
        console.log(section)
        console.log(course)
        //
        
        
        
        // display course
        document.getElementsByTagName("tbody").innerHTML += `
            <tr class="table-body-row">
                    <td>${course.courseNo}</td>
                    <td>${course.name}</td>
                    <td>${section.sectionID}</td>
                    <td>${course.credit}</td>
                    <td>${getInstructorName(section.instructorID)}</td>
                    <td>${course.college}</td>
                    <td>${section.timing}/${s.place}</td>
                    <td>${section.status}</td>
                    <td>${section.campus}</td>
                    <td class="add-box"><button class="add-button">+</button></td>
            </tr>
            `;
    }
}




