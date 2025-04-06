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

async function getInstructorName(id){
    let instructor= await fetch(baseUrl+`instructors/${id}`).then (res => res.json());
    if(instructor=="none"){
        instructor=await fetch(baseUrl+`admins/${id}`).then (res => res.json());
    }
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
    const data = await fetch(baseUrl+`courses?status=pending`);
    const courses = await data.json();
    await displayRegisterCourses(courses);
}
async function displayRegister(button){
    await loadSubPage('/Student/Search.html',button);
    const data = await fetch(baseUrl+`courses?status=pending`);
    const courses = await data.json();
    await displayRegisterCourses(courses);
}

async function displayRegisterCourses(courses){
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
                    <td>${s.campus}</td>
                    <td class="add-box"><button class="add-button">+</button></td>
                </tr>
            `;
        }
    }
    document.querySelector(".tbody").innerHTML=html;
    
    // button handler
    regbuttons()

    document.getElementById("college-input").addEventListener("keyup",()=>{sortRegisteration(courses)});
    document.getElementById("id-input").addEventListener("keyup",()=>{sortRegisteration(courses)});
    document.getElementById("keyword-input").addEventListener("keyup",()=>{sortRegisteration(courses)});
    document.querySelector(".search-button").addEventListener("click",(e)=>{e.preventDefault();sortRegisteration(courses)});
}

async function sortRegisteration(courses){
    
    const college= document.getElementById("college-input").value;
    const id= document.getElementById("id-input").value;
    const keyword= document.getElementById("keyword-input").value;

    document.querySelector(".tbody").innerHTML="";
    let html='';
    for (const c of courses) {
        for (const s of c.sections) {
            const instructorName = await getInstructorName(s.instructorID);
            if (c.college.toLowerCase().includes(college.toLowerCase()) && c.courseNo.toLowerCase().includes(id.toLowerCase()) && (searchInObject(c,keyword) || instructorName.toLowerCase().includes(keyword.toLowerCase()) || s.sectionID.toLowerCase().includes(keyword.toLowerCase()))) {
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
                        <td>${s.campus}</td>
                        <td class="add-box"><button class="add-button">+</button></td>
                    </tr>
                `;
            }
        }
    }
    document.querySelector(".tbody").innerHTML=html;
}





async function displaySchedule(button){
    loadSubPage('/Student/Schedule.html',button);

}



async function displaySummary(button){
    loadSubPage('/Student/Summary.html',button);
    const data = await fetch(baseUrl+`courses`);
    const courses = await data.json();
    const user= JSON.parse(localStorage.user);
    const sections= user.pendingSections;
    document.querySelector(".tbody").innerHTML="";
    for (const s of sections) {
        // Fetch course data
        const course=await courses.find((c)=>c.courseNo==s.courseNo); 
        // get section
        const section = await course.sections.find((sc)=> sc.sectionID==s.section);

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
                    <td>${section.status}</td>
                    <td>${section.campus}</td>
                    <td class="add-box"><button class="add-button">+</button></td>
            </tr>
            `;
    }
}




function regbuttons(){
    // Toggle expand/collapse functionality
    const toggleButton = document.getElementById('toggle-expand');
    const expandIcon = document.getElementById('expand-icon');
    const collapseIcon = document.getElementById('collapse-icon');
    const expandableSection = document.querySelectorAll('.expandable-section');
    
    toggleButton.addEventListener('click', (e)=> {
        e.preventDefault();
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
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove selected class from all buttons
            campusButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
        });
    }); 
}