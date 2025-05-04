'use server'
import repo from "@/app/repository/Repo"


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


//courses
export async function get