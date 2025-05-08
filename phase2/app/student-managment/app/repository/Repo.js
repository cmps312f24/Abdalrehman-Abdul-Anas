import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
const prisma=new PrismaClient();

class Repo {
  // Admins
  async getAdmins() {
    return await prisma.admin.findMany();
  }

  async getAdmin(id) {
    return await prisma.admin.findUnique({where:{id:id}});
  }

  async updateAdmin(admin) {
    return await prisma.admin.update({data:admin,where:{id:admin.id}});
  }

  async getCourses(status, campus) {
    const filter = {};
  
    if (status) {
      filter.sections = {
        some: { status }
      };
    } else if (campus) {
      filter.sections = {
        some: { campus }
      };
    }
  
    return await prisma.course.findMany({
      where: filter,
      include: {
        sections: {
          where: status
            ? { status }
            : campus
            ? { campus }
            : undefined
        }
      }
    });
  }

  async getCourse(courseNo) {
    return await prisma.course.findUnique({where:{courseNo:courseNo}});
  }

  async addCourse(course) {
    return await prisma.course.upsert({
      where: { courseNo: course.courseNo },
      update: course,
      create: course
    });
  }

  
  async updateCourse(course) {
    return await prisma.course.update({data:course,where:{courseNo:course.courseNo}});
  }

  async getSectionById(courseNo, section) {
    const result = await prisma.section.findUnique({
      where: {
        courseNo_section: {
          courseNo,
          section,
        },
      },
      include: {
        course: true,
        instructors: true,
        enrollments: true,
      },
    });
    return result;
  }



  // Student

  async getStudents() {
    return await prisma.student.findMany();
  }

  async getStudent(id) {
    return await prisma.student.findUnique({where:{id:id}});
  }

  async updateStudent(student) {
    return await prisma.student.update({data:student,where:{id:student.id}}); 
  }

  // actions/server-actions.js

  async updateGrade(courseNo, section, studentId, grade) {
    return await prisma.enrollment.update({
      where: {
        studentId_courseNo_section: {
          studentId,
          courseNo,
          section,
        },
      },
      data: {
        grade,
      },
    });
  }

  ///           Instructor           ///

  async getInstructors() {
    return await prisma.instructor.findMany();
  }

  async getInstructor(id) {
    return await prisma.instructor.findUnique({where:{id:id}});
  }

  async updateinstructor(instructor) {
    return await prisma.instructor.update({data:instructor,where:{id:instructor.id}});
  }

  ///           LOGIN           ///

  async getUsers() {
    return await prisma.login.findMany();
  }

  // get user info
  async getUser(email, pass) {
    const user = await prisma.login.findUnique({
      where: { email },
      include: {
        admin: true,
        instructor: true,
        student: true
      }
    });

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      return null;
    }

    switch (user.role) {
      case 'ADMIN':
        return user.admin;
      case 'INSTRUCTOR':
        return user.instructor;
      case 'STUDENT':
        return user.student;
      default:
        return null;
    }
  }

  async changePass(email,pass,newPass){
    const user = await prisma.login.findUnique({
      where: { email },
    });
 
    if (user.password !== pass) return 'wrong_password';
  
    await prisma.login.update({
      where: { email },
      data: { password: newPass },
    });

    return 1;
  }

  async updateUser(user) {
    return await prisma.login.update({data: user,where: { email: user.email }});
  }

  // Home page data
  async getUni() {
    return await prisma.university.findFirst();
  }

  async getPaths() {
    return await prisma.path.findMany({
      include: {
        courses: {
          include: {
            course: true
          }
        }
      }
    });
  }

  async getPath(name) {
    return await prisma.path.findUnique({
      where: { name },
      include: {
        courses: {
          include: {
            course: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
  }
  
}



export default new Repo();

