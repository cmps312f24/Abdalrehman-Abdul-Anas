import fs from 'fs';

/// URLs ///
const baseUrl = "http://localhost:3000/api/";
const coursesUrl = baseUrl + "courses";
const studentsUrl = baseUrl + "students";
const adminsUrl = baseUrl + "admins"
const instructorsUrl = baseUrl + "instructors";
const loginsUrl = baseUrl + "logins";

/// Json to lists for: students,course,admin,instructor ///

// Courses
async function getCourses() {
  const response = await fetch(coursesUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch courses: ");
  }
  const data = await response.json();
  return data;
}
// Students
async function getStudents() {
  const response = await fetch(studentsUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch students: ");
  }
  const data = await response.json();
  return data;
}

// Admins
async function getAdmins() {
  const response = await fetch(adminsUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch admins: ");
  }
  const data = await response.json();
  return data;
}

// Instructors
async function getInstructors() {
  const response = await fetch(instructorsUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch instructors: ");
  }
  const data = await response.json();
  return data;
}

// Login 
async function getLogins() {
  const response = await fetch(loginsUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch logins: ");
  }
  const data = await response.json();
  return data;
}



///           COURSE            ///

// Testing course 
let courseT = {
  "name": "Experimental General Physics for Engineering II",
  "credit": 1,
  "courseNo": "TEST",
  "category": "lab",
  "college": "Physics",
  "sections": [
    {
      "sectionID": "B02",
      "instructorID": "135",
      "place": "C242",
      "timing": "9:00-10:00",
      "dow": "sun/tue/thu",
      "campus": "female",
      "status": "approved",
      "students": [
        {
          "id": "100",
          "grade": "A-"
        },
        {
          "id": "101",
          "grade": "B"
        },
        {
          "id": "102",
          "grade": "B"
        }
      ]
    }
  ]
}

// Add a new course
function addCourse(course) {
  fetch(coursesUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(course)
  });
}


///           STUDENT           ///
const c = {
  "name": "Experimental General Physics for Engineering II",
  "credit": 1,
  "courseNo": "TEST",
  "category": "lecture",
  "college": "Physics",
  "sections": [
    {
      "sectionID": "L01",
      "instructorID": "135",
      "place": "C242",
      "timing": "9:00-10:00",
      "dow": "sun/tue/thu",
      "campus": "female",
      "status": "approved",
      "students": [
        {
          "id": "100",
          "grade": "A-"
        },
        {
          "id": "101",
          "grade": "B"
        },
        {
          "id": "102",
          "grade": "B"
        }
      ]
    }
  ]
}
//test

// Register course
async function registerCourse(course, sectionIndex) {
  // getting section by index
  const section = course.sections[sectionIndex]
  //getting student from local storage(user)
  const student = JSON.parse(localStorage.user);

  //Check if student already registered in same course --> checking if same course and same category
  let inSections = student.sections.find((sec) => sec.courseNo == course.courseNo && sec.category == section.category) ? true : false;
  let inPendingSection = student.pendingSections.find((sec) => sec.courseNo == course.courseNo && sec.category == section.category) ? true : false;
  if (inSections || inPendingSection) {
    alert("Course is already registered");
    return;
  }

  // Add student to section
  section.students.push({ "id": student.id, "grade": "" });

  // Add section to student pendding sections
  student.pendingSections.push({ "courseNo": course.courseNo, "section": section.sectionID });

  //update course in API
  await fetch(`${coursesUrl}/${course.courseNo}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(course)
  });

  //update user in API
  await fetch(`${studentsUrl}/${student.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(student)
  });
  //update user in local storage
  localStorage.user = JSON.stringify(student);
  alert("Course has registered successfully")
}

// Withdraw from a pending course
async function WithdrawCourse(course, sectionIndex) {
  // getting section by index
  const section = course.sections[sectionIndex]
  //getting student from local storage(user)
  const student = JSON.parse(localStorage.user);

  // Remove student from section
  section.students = section.students.filter((s) => s.id != student.id);

  // Remove section from student pendding sections
  student.pendingSections = student.pendingSections.filter((s) => !(s.courseNo == course.courseNo && s.section == section.sectionID));

  //update course in API
  await fetch(`${coursesUrl}/${course.courseNo}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(course)
  });

  //update user in API
  await fetch(`${studentsUrl}/${student.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(student)
  });
  //update user in local storage
  localStorage.user = JSON.stringify(student);
  alert("Course has withdrawn successfully")
}



///           INSTRUCTOR            ///

// Submit grade -- Not DONE
async function submitGrade(course, section, id, grade) {
  // Student list
  const students = await getStudents();

  // Find student by id
  let student = students.find((s) => s.id == id);

  // Courses list
  const courses = await getCourses();

  // find section list
  const sections = courses.find((c) => c.courseNo == course.courseNo && c.category == course.category).sections;

  // find section
  let section = sections.find((s) => s.sectionID == course.sections[0].sectionID);

  // Add grade to section
  section.students.find((s) => s.id == id).grade = grade;

  // Add grade to student
  student.currentSections.find((s) => s.courseNo == course.courseNo && s.section == section.sectionID).grade = grade;

  // update json file
  fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
  fs.writeFileSync(studentFilePath, JSON.stringify(students, null, 2), 'utf8');
}



///           ADMIN           ///

// Add section
async function addSection(course, sectionIndex) {
  // getting section by index
  const section = course.sections[sectionIndex]
  // Courses list
  const courses = await getCourses();

  // Instructors list / admin list
  const instructors = await getInstructors();
  const admins = await getAdmins();

  // Find instructor
  const instructor = instructors.find((i) => i.id == course.instructorID) || admins.find((a) => a.id == course.instructorID);

  // Add section to instructor
  instructor.sections.push({ "courseNo": course.courseNo, "section": course.sections[0].sectionID });

  // Check if the course exist 
  if (!courses.find((c) => c.courseNo == course.courseNo && c.category == course.category)) {
    addCourse(course);
  } else {
    const sections = courses.find((c) => c.courseNo == course.courseNo && c.category == course.category).sections;
    sections.push(...course.sections);
  }

  // update json file
  fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
}

// Delete section
async function deleteSection(course) {
  // Courses list
  const courses = await getCourses();

  // find sections list
  const sections = courses.find((c) => c.courseNo == course.courseNo && c.category == course.category).sections;

  // section index
  const sectionIndex = sections.findIndex((s) => s.sectionID == course.sections.sectionID);

  //delete from sections list 
  sections.splice(sectionIndex, 1);

  // update json file
  fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
}

// Approve section
async function approveSection(course) {
  // Courses list
  const courses = await getCourses();

  // find section list
  const sections = courses.find((c) => c.courseNo == course.courseNo && c.category == course.category).sections;

  // find section
  const section = sections.find((s) => s.sectionID == course.sections[0].sectionID);

  // All students list
  const students = await getStudents();

  // Find students have this course pendding
  let student = students.filter((s) => s.pendingSections.find((s) => s.courseNo == course.courseNo && s.section == section.sectionID));

  //new status value
  section.status = "approved";

  // Transfrom the course from pendding list to current
  student.forEach((temp) => {
    let index = temp.pendingSections.findIndex((s) => s.courseNo == course.courseNo && s.section == section.sectionID);
    temp.currentSections.push({ ...temp.pendingSections[index], "grade": "" });
    temp.pendingSections.splice(index, 1);
  })

  // update json file
  fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
  fs.writeFileSync(studentFilePath, JSON.stringify(students, null, 2), 'utf8');
}



///           LOGIN           ///

// get user info
export async function getUser(email, pass) {
  // login list
  const logins = await getLogins();

  // user login info
  const login = logins.find((u) => u.email == email && u.password == pass);

  let user;
  if (login) {
    switch (login.role) {
      case "admin": {
        const admins = await getAdmins();
        user = admins.find((a) => a.id == login.id);
        break;
      }
      case "instructor": {
        const instructors = await getInstructors();
        user = instructors.find((i) => i.id == login.id);
        break;
      }
      case "student": {
        const students = await getStudents();
        user = students.find((s) => s.id == login.id)
        break;
      }
      default: user = null;
    }
  } else { user = null }

  // Save user to localStorge
  localStorage.user = user;
}

