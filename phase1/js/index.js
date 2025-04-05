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
        console.log(section);
        // get instructor
        const instructor= await fetch('http://localhost:3000/api/instructors/1001').then (res => res.json());
        // display course
        document.querySelector(".content").innerHTML += `
            <section class="course-cotainer">
                <p id="courseNumber">${course.courseNo}</p>
                <p id="courseName">${course.name}</p>
                <p id="status">${s.status}</p>
                <p id="instructor">${instructor.name}</p>
            </section>`;
    }
    
}



