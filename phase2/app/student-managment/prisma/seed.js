import fs from 'fs-extra'
import { PrismaClient } from '@prisma/client';

const prisma=new PrismaClient();

async function seedUNI() {
    const data = await fs.readJson('app/data/uni.json');
  
    // Create the university
    await prisma.university.create({
      data: {
        name: data.name,
        info: data.info,
        events: data.events,
      },
    });
    
}

async function seedCourses() {
    const courses = await fs.readJson('app/data/course.json');
    for (const course of courses) {
        const { sections, ...courseData } = course; 
        await prisma.course.create({ data: courseData });
    }
}

async function seedInstructors() {
    const instructors = await fs.readJson('app/data/instructor.json');
    for (const instructor of instructors) {
        const { sections, ...instructorData } = instructor;
        await prisma.instructor.create({ data: instructorData });
    }
}

async function seedAdmins() {
    const admins = await fs.readJson('app/data/admin.json');
    for (const admin of admins) {
        const { sections, ...adminData } = admin;
        await prisma.admin.create({ data: adminData });
    }
}

async function seedStudents() {
    const students = await fs.readJson('app/data/student.json');
    for (const student of students) {
        const { gpa, sections, pendingSections, ...studentData } = student;
        studentData.gender = studentData.gender.toUpperCase();
        await prisma.student.create({ data: studentData });
    }
}

async function seedLogins() {
    const logins = await fs.readJson('app/data/login.json');
    for (const { id, role, email, password } of logins) {
      const roleKey = role.toLowerCase();
  
      await prisma.login.create({
        data: {
          email,
          password,
          role: role.toUpperCase(),
          [roleKey]: { connect: { id } }
        }
      });
    }
}

async function seedPaths(){
    const uni= (await fs.readJson('app/data/uni.json'));
    for (const path of uni.paths) {
        await prisma.path.create({
          data: {
            name: path.name,
            universityName: uni.name,
          }
        });
      }
}

async function seedPathCourses() {
    const uni = await fs.readJson('app/data/uni.json');
  
    for (const path of uni.paths) {
      const pathName = path.name;
  
      for (const c of path.courses) {
        if (!c.courseNo) continue;

        await prisma.course.upsert({
          where: { courseNo: c.courseNo },
          update: {},
          create: {
            courseNo: c.courseNo,
            name: c.name,
            credit: c.credit.toString(),
            category: "N/A",
            college: "N/A",
          },
        });

        await prisma.pathCourse.create({
          data: {
            pathName,
            courseNo: c.courseNo,
            prerequests: c.prerequests?.join(',') || undefined,
          },
        });
      }
    }
  }

async function seed() {
    await seedUNI();
    await seedCourses();
    await seedInstructors();
    await seedAdmins();
    await seedStudents();
    await seedLogins();
    await seedPaths();
    await seedPathCourses();
}




try{
    await seed();
}catch (err){
    console.log(err);
}finally{
    await prisma.$disconnect();
}
