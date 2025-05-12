'use server';

import { cookies } from 'next/headers';
import { generateToken , verifyToken } from '@/app/utils/jwt';
import repo from '@/app/repository/Repo';
import { StatisticRepo } from "@/app/repository/StatisticRepo";
import { Prisma } from '@prisma/client';


export async function loginAction(email, pass) {
  const user = await repo.getUser(email, pass)
  if (!user) return null

  const token = generateToken({ id: user.id, role: user.role });
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })

  return user.role
}

export async function getUserFromToken(user) {
  switch (user.role) {
    case 'ADMIN':
      return await repo.getAdmin(user.id)
    case 'INSTRUCTOR':
      return await repo.getInstructor(user.id)
    case 'STUDENT':
      return await repo.getStudent(user.id)
  }
}


// HOME
export async function uniInfoAction() {
  return await repo.getUni();
}

// USERS
export async function getCoursesAction(user) {
  const userSections = user.role=='STUDENT'?user.enrollments:user.sections;
  if (!userSections) return [];
  await userSections.map((s) => repo.getSectionById(s.courseNo, s.section));
  return userSections;
}

export async function changePassAction(email, pass, newPass) {
  return await repo.changePass(email, pass, newPass);
}

// COURSES
export async function getSectionGrades(courseNo, sectionID) {
  return (await repo.getSectionById(courseNo, sectionID)).enrollments;
}

export async function updateGradeAction(courseNo, section, studentId, grade) {
  await repo.updateGrade(courseNo, section, studentId, grade);
}

export async function getPathAction(name) {
  return await repo.getPath(name);
}

// STATISTICS
export async function getStatistics() {
  return await StatisticRepo.getAllStatistics();
}



function removeServerActionProperty(data) {
  for (const key in data) {
      if (key.startsWith('$ACTION_ID_')) {
          delete data[key];
          break
      }
  }
  return data
}

//Registeration
export async function getCoursesRegisterationAction({ status, campus, courseNo, college }) {
  return await repo.getSectionsByFilter({ status, campus, courseNo, college });
}

//Add Course
export async function handelAddCourseAction(formData) {
  const course = Object.fromEntries(formData.entries());

  course.capacity = String(course.capacity);
  course.credit = String(course.credit);
  course.campus = course.campus.toUpperCase();
  const c = removeServerActionProperty(course)
  course.section=course.category=='Lab'? `B${course.section}`:`L${course.section}`;
  await repo.addCourseWithSection(c);
}

//Change section status
export async function updateSectionStatusAction(courseNo, section, newStatus) {
  await repo.updateSectionStatus(courseNo, section, newStatus);
}

export async function deleteSectionAction(courseNo, section) {
  await repo.deleteSection(courseNo, section);
}

//Register course
export async function registerStudentAction(studentId, courseNo, section) {
  await repo.registerStudentInSection(studentId, courseNo, section);
}
export async function unregisterStudentAction(studentId, courseNo, section) {
  await repo.unregisterStudentFromSection(studentId, courseNo, section);
}

//Schedule
export async function getStudentScheduleAction(studentId) {
    return await repo.getStudentSchedule(studentId);
}

export async function getAllCoursesAction(){
  return repo.getAllcourses();
}