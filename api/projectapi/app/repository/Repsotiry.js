import fse from 'fs-extra';
import path from 'path';

class Repo {
  constructor() {
    this.adminFilePath = path.join(process.cwd(), 'app/data/admin.json');
    this.courseFilePath = path.join(process.cwd(), 'app/data/course.json');
    this.instructorFilePath = path.join(process.cwd(), 'app/data/instructor.json');
    this.loginFilePath = path.join(process.cwd(), 'app/data/login.json');
    this.studentFilePath = path.join(process.cwd(), 'app/data/student.json');
    this.uni = path.join(process.cwd(), 'app/data/uni.json');  
  }

  // Saving Methods 
  async saveAdmins(admins) {
    await fse.writeJson(this.adminFilePath, admins);
  }
  async saveCourses(courses) {
    await fse.writeJson(this.courseFilePath, courses);
  }
  async saveInstructors(instructors) {
    await fse.writeJson(this.instructorFilePath, instructors);
  }
  async savelogins(logins) {
    await fse.writeJson(this.loginFilePath, logins);
  }
  async saveStudents(students) {
    await fse.writeJson(this.studentFilePath, students);
  }
  async saveUni(unis) {
    await fse.writeJson(this.uniFilePath, unis);
  }

  // Admins
  async getAdmins() {
    const admins = await fse.readJSON(adminFilePath);
    return admins;
  }
  
  async getAdmin(id) {
    const admins = await this.getAdmins();
    const admin = admins.find((admin)=> admin.id == id);
    if(!admin){
      return { error: 'Admin not found' };
    }
    return admin;
  }

  //Courses
  async getCourses() {
    const courses = await fse.readJSON(this.courseFilePath);
    return courses;
  }
  
  async getcourse(courseNo) {
    const courses = await this.getCourses();
    const course = courses.find((course)=> course.courseNo == courseNo);
    if(!course){
      return { error: 'Course not found' };
    }
    return course;
  }

  async addCourse(course) {
    const courses = await this.getCourses();
    courses.push(course);
    await this.saveAccounts(courses);
    return course;
  }

  async addSection(course) {
  // Courses list / Instructors list / admin list
  const courses= await getCourses();
  const instructors=await getInstructors();
  const admins=await getAdmins();
  
  // Find instructor
  const instructor= instructors.find((i)=> i.id==course.instructorID) || admins.find((a)=> a.id==course.instructorID);

  // Add section to instructor TODO: 
  instructor.sections.push({"courseNo":course.courseNo,"section":course.sections[0].sectionID});

  // Check if the course exist 
  if (!courses.find((c)=>c.courseNo.toLowerCase()==course.courseNo.toLowerCase() && c.category.toLowerCase()==course.category.toLowerCase())){
      addCourse(course);
  }else{
      const sections=courses.find((c)=>c.courseNo.toLowerCase()==course.courseNo.toLowerCase() && c.category.toLowerCase()==course.category.toLowerCase()).sections;
      sections.push(...course.sections);
  }

  // update json file
  await this.saveAdmins(admins);
  await this.saveInstructors(instructors);
  await this.saveCourses(courses);
}

// Delete section
async deleteSection(nums){
  // Courses list
  const courses= await getCourses();
  //Define IDs
  const courseNo = nums[0];
  const sectionID = nums[1];

  // find sections list
  const sections=courses.find((c)=>c.courseNo.toLowerCase()==courseNo.toLowerCase()).sections;
  if (sections < 0) {
    return { error: 'Course not found' };
  }
  // section index
  const sectionIndex=sections.findIndex((s)=>s.sectionID.toLowerCase()==sectionID.toLowerCase());
  if (index < 0) {
    return { error: 'Section not found' };
  }
  //delete from sections list 
  sections.splice(sectionIndex,1);

  // update json file
  await this.saveCourses();
  return { message: 'Account deleted successfully' }; 
}




// Student

async getStudents(){
  const students = await fse.readJSON(this.studentFilePath);
  return students;
}

async getStudent(id){
  const students = this.getStudents();
  const student = students.find((s)=> s.id == id);
    if(!student){
      return { error: 'Admin not found' };
    }
    return student;
}

// Register course
async registerCourse(id,course) {
  // Student list
  const students=await this.getStudents();
  
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
  await this.saveCourses();
  await this.saveStudents();
}

// Withdraw from a pending course
async WithdrawCourse(id,course) {
  // Student list
  const students=await this.getStudents();
   
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
  await this.saveCourses();
  await this.saveStudents();
}







  async updateAccount(accountNo, account) {
    const accounts = await this.getAccounts();

    const index = accounts.findIndex(account => account.accountNo == accountNo);

    if (index < 0) {
        return { error: 'Account not found' };
    }
    accounts[index] = { ...accounts[index], ...account };

    await this.saveAccounts(accounts);
    return accounts[index];
  }

  async deleteAccount(accountNo) {
    const accounts = await this.getAccounts();
    const index = accounts.findIndex(account => account.accountNo == accountNo);
    if (index < 0) {
        return { error: 'Account not found' };
    }
    accounts.splice(index, 1);
    await this.saveAccounts(accounts);
    return { message: 'Account deleted successfully' };
  }

  // Instructor

  async getInstructors() {
    const instructors = await fse.readJSON(this.instructorFilePath);
    return instructors;
  }
  
  async getInstructor(id) {
    const instructors = await this.getInstructors();
    const instructor = instructors.find((instructor)=> instructor.id == id);
    if(!instructor){
      return { error: 'Instructor not found' };
    }
    return instructor;
  }

  // Submit grade
async submitGrade(id,course,grade) {
  // Student list
  const students=await this.getStudents();
    
  // Find student by id
  let student=students.find((s)=>s.id==id);

  // Courses list
  const courses= await this.getCourses();

  // find section list
  const sections=courses.find((c)=>c.courseNo==course.courseNo && c.category==course.category).sections;

  // find section
  let section = sections.find((s)=> s.sectionID==course.sections[0].sectionID);
  
  // Add grade to section
  section.students.find((s)=> s.id==id).grade=grade;

  // Add grade to student
  student.currentSections.find((s)=>s.courseNo==course.courseNo && s.section==section.sectionID).grade=grade;

  // update json file
  fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
  fs.writeFileSync(studentFilePath, JSON.stringify(students, null, 2), 'utf8');
}

  
///           LOGIN           ///

// get user info
async getUser(email,pass) {
  // login list
  const logins = await fse.readJSON(this.loginFilePath) 

  // user login info
  const login= logins.find((u)=> u.email==email && u.password==pass);

  let user;
  if (login){
      switch (login.role){
          case "admin": {
              const admins=await this.getAdmins();
              user= admins.find((a)=>a.id==login.id);
              break;
          } 
          case "instructor":{
              const instructors=await getInstructors();
              user= instructors.find((i)=>i.id==login.id);
              break;
          }
          case "student":{
              const students=await getStudents();
              user=students.find((s)=>s.id==login.id)
              break;
          }
          default: user=null;
      }
  }else{user=null}
  
  return user;
}

}







// ///           INSTRUCTOR            ///





// ///           ADMIN           ///

// // Add section
// async function addSection(course) {
//   // Courses list
//   const courses= await getCourses();

//   // Instructors list / admin list
//   const instructors=await getInstructors();
//   const admins=await getAdmins();
  
//   // Find instructor
//   const instructor= instructors.find((i)=> i.id==course.instructorID) || admins.find((a)=> a.id==course.instructorID);

//   // Add section to instructor
//   instructor.sections.push({"courseNo":course.courseNo,"section":course.sections[0].sectionID});

//   // Check if the course exist 
//   if (!courses.find((c)=>c.courseNo==course.courseNo && c.category==course.category)){
//       addCourse(course);
//   }else{
//       const sections=courses.find((c)=>c.courseNo==course.courseNo && c.category==course.category).sections;
//       sections.push(...course.sections);
//   }

//   // update json file
//   fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
// }



// // Approve section
// async function approveSection(course) {
//   // Courses list
//   const courses= await getCourses();

//   // find section list
//   const sections=courses.find((c)=>c.courseNo==course.courseNo && c.category==course.category).sections;

//   // find section
//   const section = sections.find((s)=> s.sectionID==course.sections[0].sectionID);
  
//   // All students list
//   const students=await getStudents();
    
//   // Find students have this course pendding
//   let student=students.filter((s)=> s.pendingSections.find((s)=> s.courseNo==course.courseNo && s.section==section.sectionID));

//   //new status value
//   section.status="approved";

//   // Transfrom the course from pendding list to current
//   student.forEach((temp)=> {
//     let index=temp.pendingSections.findIndex((s)=> s.courseNo==course.courseNo && s.section==section.sectionID);
//     temp.currentSections.push({...temp.pendingSections[index],"grade":""});
//     temp.pendingSections.splice(index,1);
//   })

//   // update json file
//   fs.writeFileSync(courseFilePath, JSON.stringify(courses, null, 2), 'utf8');
//   fs.writeFileSync(studentFilePath, JSON.stringify(students, null, 2), 'utf8');
// }





