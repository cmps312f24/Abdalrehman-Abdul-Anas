'use server';

import { cookies } from 'next/headers';
import { generateToken , verifyToken } from '@/app/utils/jwt';
import repo from '@/app/repository/Repo';
import { StatisticRepo } from "@/app/repository/StatisticRepo";

export async function loginAction(email, pass) {
  const user = await repo.getUser(email, pass);
  if (!user) return null;

  const token = generateToken({ id: user.id, role: user.role });

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    path: `/${user.role.toLowerCase()}`,
  });

  return user;
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
  const userSections = user.enrollments;
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
