import fs from 'fs';

// json file path
const filePath = 'json/course.json';

// Testing course 
let course={
    "name": "Discrete Structures for Computing",
    "credit": 3,
    "courseNo": "CMPS 205",
    "category": "lab",
    "college": "Computer Science",
    "sections": [
      {
        "sectionID": "L02",
        "instructorID": "133",
        "place": "C235",
        "campus": "male",
        "status": "",
        "studentIDs": [
          {
            "79": "A"
          },
          {
            "80": "B"
          },
          {
            "81": "B+"
          }
        ]
        }
    ]
}

// Fetch data from json file
async function getCourses() {
    const data = fs.readFileSync(filePath, 'utf8');
    const courses = await JSON.parse(data);
    return courses;
}

// Add a new course
async function addCourse(course) {
    // courses list
    const courses= await getCourses();

    // Add new course to the data
    courses.push(course);

    // update json file
    fs.writeFileSync(filePath, JSON.stringify(courses, null, 2), 'utf8');
}

// Add a section
async function addSection(course) {
    // Courses list
    const courses= await getCourses();
    
    // Check if the course exist 
    if (!courses.find((c)=>c.courseNo==course.courseNo && c.category==course.category)){
        addCourse(course);
    }else{
        const sections=courses.find((c)=>c.courseNo==course.courseNo && c.category==course.category).sections;
        sections.push(...course.sections);
    }

    // update json file
    fs.writeFileSync(filePath, JSON.stringify(courses, null, 2), 'utf8');
}

// Delete section
async function deleteSection(course){
    // Courses list
    const courses= await getCourses();

    // find sections list
    const sections=courses.find((c)=>c.courseNo==course.courseNo && c.category==course.category).sections;
    
    // section index
    const sectionIndex=sections.findIndex((s)=>s.sectionID==course.sections.sectionID);

    //delete from sections list 
    sections.splice(sectionIndex,1);

    // update json file
    fs.writeFileSync(filePath, JSON.stringify(courses, null, 2), 'utf8'); 
}

// Approve section
async function approveSection(course) {
    // Courses list
    const courses= await getCourses();

    // find section list
    const sections=courses.find((c)=>c.courseNo==course.courseNo && c.category==course.category).sections;

    // find section
    const section = sections.find((s)=> s.sectionID==course.sections[0].sectionID);
    
    //new status value
    section.status="approved";

    // update json file
    fs.writeFileSync(filePath, JSON.stringify(courses, null, 2), 'utf8');
}

