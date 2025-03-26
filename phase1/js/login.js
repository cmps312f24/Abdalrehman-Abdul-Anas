import {getUser} from './Repsotiry.js';

// Validate login when clicking the btn
document.getElementById("Login-btn").addEventListener("click",console.log("1111"));

//login validation
function login(){
    // Get email and pass from user input
    const email=document.getElementById("user-email").value;
    const pass=document.getElementById("user-password").value;

    // get user info 
    getUser(email,pass);

}

console.log(localStorage.user);