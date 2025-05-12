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

  async getCourses(pageType, campus = null) {
    const sectionStatus = pageType === 'pending' ? 'pending'
                      : pageType === 'approved' ? 'approved'
                      : pageType === 'register' ? 'approved'
                      : pageType === 'summary'  ? undefined
                      : undefined;

    const sectionFilter = {};
    if (sectionStatus) sectionFilter.status = sectionStatus;
    if (campus) sectionFilter.campus = campus;

    return await prisma.course.findMany({
      where: Object.keys(sectionFilter).length
        ? { sections: { some: sectionFilter } }
        : undefined,
      include: {
        sections: {
          where: sectionFilter,
          include: {
            instructors: {
              include: {
                instructor: true,
                admin: true
              }
            }
          }
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

  
  async addCourseWithSection(data) {
    const {
      courseNo, name, credit, category, college,
      section, place, timing, dow, campus, capacity, instructorID
    } = data;

    const status = "pending"

    await this.addCourse({ courseNo, name, credit, category, college })

    const user = await prisma.admin.findUnique({
      where: { id: instructorID }
    })

    if(user){
      return await prisma.section.create({
        data: {
          section, place, timing, dow, campus, capacity, courseNo, status, adminId:instructorID
        }
    })
    }

    return await prisma.section.create({
        data: {
          section, place, timing, dow, campus, capacity, courseNo, status, instructorId:instructorID
        }
      })
  }


  async getCoursesByFilter({ courseNo, college }) {
    const filter = {};

    if (courseNo) whereClause.courseNo = courseNo;
    if (college) whereClause.college = college;

    return await prisma.course.findMany({
      where: whereClause,
      include: {
        sections: true
      }
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

async updateSectionStatus(courseNo, section, newStatus) {
    return await prisma.section.update({
      where: {
        courseNo_section: {
          courseNo,
          section
        }
      },
      data: {
        status: newStatus
      }
    });
  }

  async deleteSection(courseNo, section) {
    return await prisma.section.delete({
      where: {
        courseNo_section: {
          courseNo,
          section
        }
      }
    });
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

async registerStudentInSection(studentId, courseNo, section) {
    return await prisma.enrollment.create({
      data: {
        studentId,
        courseNo,
        section,
        status: 'pending',
      }
    });
  }

  async unregisterStudentFromSection(studentId, courseNo, section) {
    return await prisma.enrollment.delete({
      where: {
        studentId_courseNo_section: {
          studentId,
          courseNo,
          section
        }
      }
    });
  }

  async getStudentSchedule(studentId) {
    return await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        sectionRef: {
          include: {
            course: true
          }
        }
      }
    });
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

  async changePass(email, pass, newPass) {
    const user = await prisma.login.findUnique({
      where: { email },
    });
  
    if (!(await bcrypt.compare(pass, user.password))) return 'wrong_password';
  
    const hashedPassword = await bcrypt.hash(newPass, 10);
  
    await prisma.login.update({
      where: { email },
      data: { password: hashedPassword },
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

