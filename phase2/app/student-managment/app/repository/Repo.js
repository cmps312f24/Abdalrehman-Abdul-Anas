import { PrismaClient } from '@prisma/client';

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
    return await prisma.course.create({ data: course });
  }

  //To update the course if there is any update on its sections
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
    const login = await prisma.login.findUnique({
      where: { email },
      include: {
        admin: true,
        instructor: true,
        student: true
      }
    });
  
    if (!login || login.password !== pass) {
      return null;
    }
  
    switch (login.role) {
      case 'ADMIN':
        return login.admin;
      case 'INSTRUCTOR':
        return login.instructor;
      case 'STUDENT':
        return login.student;
      default:
        return null;
    }
  }

  async updateUser(user) {
    return await prisma.login.update({data: user,where: { email: user.email }});
  }

  // Home page data
  async getUni() {
    return await prisma.university.findFirst();
  }

  async getPaths() {
    return await prisma.path.findMany();
  }

  async getPath(name){
    return await prisma.path.findUnique({where:{name:name}})
  }
}



export default new Repo();

