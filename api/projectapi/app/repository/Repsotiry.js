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

  //To update the course if there is any update on its sections
  async updateCourse(course) {
    const courses = await this.getCourses();

    const index = courses.findIndex(course => course.accountNo == course.courseNo);

    if (index < 0) {
        return { error: 'Course not found' };
    }
    courses[index] = { ...courses[index], ...course};

    await this.saveCourses(courses);
    return courses[index];
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

async updateStudent(student) {
  const students = await this.getStudents();

  const index = students.findIndex((s) => s.id == student.id);

  if (index < 0) {
      return { error: 'Course not found' };
  }
  students[index] = { ...students[index], ...student};

  await this.saveCourses(students);
  return students[index];
}

///           Instructor           ///

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

  async updateinstructor(instructor) {
    const instructors = await this.getInstructors();
  
    const index = instructors.findIndex((i) => i.id == instructor.id);
  
    if (index < 0) {
        return { error: 'Course not found' };
    }
    instructors[index] = { ...instructors[index], ...instructor};
  
    await this.saveInstructors(instructors);
    return instructors[index];
  }
  
///           LOGIN           ///

async getUsers(){
  const logins = await fse.readJSON(this.loginFilePath)
  return logins; 
}

// get user info
async getUser(email,pass) {
  // login list
  const logins = await this.getCourses();

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





