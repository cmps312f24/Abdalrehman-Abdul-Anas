'use server'
import repo from "@/app/repository/Repo"
import { StatisticRepo } from "@/app/repository/StatisticRepo";


// LOGIN
export async function loginAction(email,pass) {
    const user= await repo.getUser(email,pass);
    if (!user) {
        return;
    }
    return user;
}




// HOME
export async function uniInfoAction() {
  return await repo.getUni();
}



//users
export async function getCoursesAction(user) {
  const userSections= user.enrollments;
  if (!userSections){return []}
  await userSections.map((s)=> repo.getSectionById(s.courseNo,s.section));
  return userSections;
}

export async function changePassAction(email,pass,newPass) {
  return await repo.changePass(email,pass,newPass);
}


//courses
export async function getSectionGrades(courseNo, sectionID){
  return (await repo.getSectionById(courseNo,sectionID)).enrollments;
}

export async function updateGradeAction(courseNo, section, studentId, grade){
  await repo.updateGrade(courseNo, section, studentId, grade);
}

export async function getPathAction(name){
  return await repo.getPath(name);
}


//Statistics
export async function getStatistics() {
  return await StatisticRepo.getAllStatistics();
}