const baseUrl = "http://localhost:3000/api/";
const loginsUrl=baseUrl + "logins";
const studentsUrl=baseUrl + "students";
const adminsUrl=baseUrl + "admins"
const instructorsUrl=baseUrl + "instructors";

// Validate login when clicking the btn
document.getElementById("Login-btn").addEventListener("click",(e)=>{e.preventDefault();login();});
async function getStudents() {
    const response = await fetch(studentsUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch students: ");
    }
    const data = await response.json();
    return data;
}
  
  // Admins
async function getAdmins() {
    const response = await fetch(adminsUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch admins: ");
    }
    const data = await response.json();
    return data;
}
  
  // Instructors
async function getInstructors() {
    const response = await fetch(instructorsUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch instructors: ");
    }
    const data = await response.json();
    return data;
}
async function getLogins() {
    const response = await fetch(loginsUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch logins: ");
    }
    const data = await response.json();
    return data;
}

//login validation
async function login(){
   // Get email and pass from user input
  const email=document.getElementById("user-email").value;
  const pass=document.getElementById("user-password").value;

  // login list
  const logins =await getLogins();
  // user login info
  const login= logins.find((u)=> u.email==email && u.password==pass);
  
  let user;
  let pageUrl;
  if (login){
      switch (login.role){
          case "admin": {
            const admins=await getAdmins();
            user= admins.find((a)=>a.id==login.id);
            pageUrl="/Admin/index.html";
            break;
          } 
          case "instructor":{
            const instructors=await getInstructors();
            user= instructors.find((i)=>i.id==login.id);
            pageUrl="/Instructor/index.html";
            break;
          }
          case "student":{
            const students=await getStudents();
            user=students.find((s)=>s.id==login.id);
            pageUrl="/Student/index.html";
            break;
          }
          default: user=null;
      }
    }else{user=null}

    // prompt inccorrect email or password
    if (!user){
        alert("Incorrect email or password");
        return;
    }
  
    // Save user to localStorge
    localStorage.user=JSON.stringify(user);

    // Load the page
    window.location.href=pageUrl;
}

