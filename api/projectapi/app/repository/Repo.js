import fse from 'fs-extra';
import path from 'path';

class Repo {
  constructor() {
    this.adminFilePath = path.join(process.cwd(), 'app/data/admin.json');
    this.courseFilePath = path.join(process.cwd(), 'app/data/course.json');
    this.instructorFilePath = path.join(process.cwd(), 'app/data/instructor.json');
    this.loginFilePath = path.join(process.cwd(), 'app/data/login.json');
    this.studentFilePath = path.join(process.cwd(), 'app/data/student.json');
    this.uniFilePath = path.join(process.cwd(), 'app/data/uni.json');
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
    const admins = await fse.readJSON(this.adminFilePath);
    return admins;
  }

  async getAdmin(id) {
    const admins = await this.getAdmins();
    const admin = admins.find((admin) => admin.id == id);
    if (!admin) {
      return { error: 'Admin not found' };
    }
    return admin;
  }

  async updateAdmin(admin) {
    const admins = await this.getAdmins();

    const index = admins.findIndex((a) => a.id == admin.id);

    if (index < 0) {
      return { error: 'Admin not found' };
    }
    admins[index] = { ...admins[index], ...admin };

    await this.saveAdmins(admins);
    return admins[index];
  }

  //Courses
  async getCourses(status, campus) {
    const courses = await fse.readJSON(this.courseFilePath);
    if(status){
      return courses.map(c => ({
        ...c,
        sections: c.sections.filter(s => s.status === status)
      }))
      .filter(c => c.sections.length > 0)
    }
    if(campus){
      return courses.map(c => ({
        ...c,
        sections: c.sections.filter(s => s.campus === campus)
      }))
      .filter(c => c.sections.length > 0)
    }
    return courses;
  }

  async getCourse(courseNo) {
    const courses = await this.getCourses();
    const course = courses.find((course) => course.courseNo.toLowerCase() == courseNo.toLowerCase());
    if (!course) {
      return { error: 'Course not found' };
    }
    return course;
  }

  async addCourse(course) {
    const courses = await this.getCourses();
    courses.push(course);
    await this.saveCourses(courses);
    return course;
  }

  // async getSections(status) {
  //   const courses = await this.getCourses();
  //   return status ? courses.map(c => ({
  //       ...c,
  //       sections: c.sections.filter(s => s.status === status)
  //     }))
  //     .filter(c => c.sections.length > 0) : courses;
  // }

  //To update the course if there is any update on its sections
  async updateCourse(course) {
    const courses = await this.getCourses();

    const index = courses.findIndex((c) => c.courseNo == course.courseNo);

    if (index < 0) {
      return { error: 'Course not found' };
    }
    courses[index] = { ...courses[index], ...course };

    await this.saveCourses(courses);
    return courses[index];
  }

  // Delete section
  // async deleteSection(nums){
  //   // Courses list
  //   const courses= await getCourses();
  //   //Define IDs
  //   const courseNo = nums[0];
  //   const sectionID = nums[1];

  //   // find sections list
  //   const sections=courses.find((c)=>c.courseNo.toLowerCase()==courseNo.toLowerCase()).sections;
  //   if (sections < 0) {
  //     return { error: 'Course not found' };
  //   }
  //   // section index
  //   const sectionIndex=sections.findIndex((s)=>s.sectionID.toLowerCase()==sectionID.toLowerCase());
  //   if (index < 0) {
  //     return { error: 'Section not found' };
  //   }
  //   //delete from sections list 
  //   sections.splice(sectionIndex,1);

  //   // update json file
  //   await this.saveCourses();
  //   return { message: 'Account deleted successfully' }; 
  // }




  // Student

  async getStudents() {
    const students = await fse.readJSON(this.studentFilePath);
    return students;
  }

  async getStudent(id) {
    const students = await this.getStudents();
    const student = students.find((s) => s.id == id);
    if (!student) {
      // return { error: 'Student not found' };
      return id;
    }
    return student;
  }

  async updateStudent(student) {
    const students = await this.getStudents();

    const index = students.findIndex((s) => s.id == student.id);

    if (index < 0) {
      return { error: 'Student not found' };
    }
    students[index] = { ...students[index], ...student };

    await this.saveStudents(students);
    return students[index];
  }

  ///           Instructor           ///

  async getInstructors() {
    const instructors = await fse.readJSON(this.instructorFilePath);
    return instructors;
  }

  async getInstructor(id) {
    const instructors = await this.getInstructors();
    const instructor = instructors.find((instructor) => instructor.id == id);
    if (!instructor) {
      return { error: 'Instructor not found' };
    }
    return instructor;
  }

  async updateinstructor(instructor) {
    const instructors = await this.getInstructors();

    const index = instructors.findIndex((i) => i.id == instructor.id);

    if (index < 0) {
      return { error: 'Instructor not found' };
    }
    instructors[index] = { ...instructors[index], ...instructor };

    await this.saveInstructors(instructors);
    return instructors[index];
  }

  ///           LOGIN           ///

  async getUsers() {
    const logins = await fse.readJSON(this.loginFilePath)
    return logins;
  }

  // get user info
  async getUser(email, pass) {
    // login list
    const logins = await this.getUsers();

    // user login info
    const login = logins.find((u) => u.email == email && u.password == pass);

    let user;
    if (login) {
      switch (login.role) {
        case "admin": {
          const admins = await this.getAdmins();
          user = admins.find((a) => a.id == login.id);
          break;
        }
        case "instructor": {
          const instructors = await this.getInstructors();
          user = instructors.find((i) => i.id == login.id);
          break;
        }
        case "student": {
          const students = await this.getStudents();
          user = students.find((s) => s.id == login.id)
          break;
        }
        default: user = null;
      }
    } else { user = null }

    return user;
  }


  async updateUser(user) {
    const users = await this.getUsers();

    const index = users.findIndex((u) => u.id == user.id);

    if (index < 0) {
      return { error: 'User not found' };
    }
    users[index] = { ...users[index], ...user };

    await this.saveAdmins(users);
    return users[index];
  }

  // Home page data
  async getUni() {
    const uni = await fse.readJSON(this.uniFilePath)
    return uni
  }

}



export default new Repo();

