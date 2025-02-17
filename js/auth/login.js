// Initiate the login process and checking if we already have a logged in user in the session storage
if(sessionStorage.getItem("user")){
    window.location.href = "../home/home.html";
}
// importing the loginUser function from the db.js file
import { loginUser } from '../database/db.js';

const submitButton = document.getElementById('submit-button');


submitButton.addEventListener('click', async(event) => { 
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if(username === "admino@123" && password == "admino@123"){
        sessionStorage.setItem("user", JSON.stringify({username: "admino@123", userRole: "admin"}));
        window.location.href = "admin.html";
    }
    if(!username || !password){
        alert("All fields are mandatory");
        return;
    }
    const response = await loginUser(username, password);
    if(response == "User does not exist"){
        alert("User does not exist");
        return;
    }
    if(response == "Incorrect password"){
        alert("Incorrect password");
        return;
    }
    alert("Logged in successfully");
    window.location.href = "../home/home.html";

});