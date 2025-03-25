import fs from 'fs';

/// Json to lists for: students,course,admin,instructor ///

// Courses
const courseFilePath = 'json/course.json';
async function getCourses() {
  const data = fs.readFileSync(courseFilePath, 'utf8');
  const courses = await JSON.parse(data);
  return courses;
}

// Students
const studentFilePath = 'json/student.json';
async function getStudents() {
  const data = fs.readFileSync(studentFilePath, 'utf8');
  const students = await JSON.parse(data);
  return students;
}

// Admins
const adminFilePath = 'json/admin.json';
async function getAdmins() {
  const data = fs.readFileSync(adminFilePath, 'utf8');
  const admins = await JSON.parse(data);
  return admins;
}

// Instructors
const instructorFilePath = 'json/course.json';
async function getInstructors() {
  const data = fs.readFileSync(instructorFilePath, 'utf8');
  const instructors = await JSON.parse(data);
  return instructors;
}



///           COURSE            ///

// Testing course 
let courseT={
  "name": "Data Structures",
  "credit": 4,
  "courseNo": "CMPS 303",
  "category": "lecture",
  "college": "Computer Science",
  "sections": [
    {
      "sectionID": "L01",
      "instructorID": "134",
      "place": "C237",
      "timing": "9:00-10:00",
      "dow": "sun/tue/thu",
      "campus": "male",
      "status": "approved",
      "studentIDs": [
        {
          "85": "A"
        },
        {
          "86": "B"
        },
        {
          "87": "B+"
        }
      ]
    }
  ]
}

// Add a new course
async function addCourse(course) {
    // courses list
    const courses= await getCourses();

    // Add new course to the data
    courses.push(course);

    // update json file
    fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
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
    fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
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
    fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8'); 
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
    fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
}

// Find section
async function findSection(course) {
     

      // Return section
      return section;
}


///           STUDENT           ///

// Register course
async function registerCourse(id,course) {
    // Student list
    const students=await getStudents();
    
    // Find student by id
    const student=students.find((s)=>s.id==id);

    // Courses list
    const courses= await getCourses();

    // find section list
    const sections=courses.find((c)=>c.courseNo==course.courseNo && c.category==course.category).sections;

    // find section
    const section = sections.find((s)=> s.sectionID==course.sections[0].sectionID);
    
    // Add student to section
    section.students.push({"id":student.id,"grade":""});

    // Add section to student pendding sections
    student.pendingSections.push({"courseNo":course.courseNo,"section":section.sectionID});

    // update json file
    fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
    fs.writeFileSync(studentFilePath, JSON.stringify(students, null, 2), 'utf8');
}

// Withdraw from a pending course
async function WithdrawCourse(id,course) {
   // Student list
   const students=await getStudents();
    
   // Find student by id
   let student=students.find((s)=>s.id==id);

   // Courses list
   const courses= await getCourses();

   // find section list
   const sections=courses.find((c)=>c.courseNo==course.courseNo && c.category==course.category).sections;

   // find section
   let section = sections.find((s)=> s.sectionID==course.sections[0].sectionID);
   
   // Remove student from section
   section.students=section.students.filter((s)=> s.id!=id);

   // Remove section from student pendding sections
   student.pendingSections=student.pendingSections.filter((s)=> !(s.courseNo==course.courseNo && s.section==section.sectionID));

   // update json file
   fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
   fs.writeFileSync(studentFilePath, JSON.stringify(students, null, 2), 'utf8');
}


