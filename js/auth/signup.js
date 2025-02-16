import {validateUser } from '../utils/validations.js';
import { createUser } from '../database/db.js';
if(sessionStorage.getItem("user")){
    window.location.href = "/pages/auth/login.html";
};



const submitButton = document.getElementById('submit-button');


submitButton.addEventListener('click', async(event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const email = document.getElementById('email').value.trim();
    const city = document.getElementById('city').value.trim();
    const adharNumber = document.getElementById('adhaar').value.trim();
    const userRole = document.getElementById('userRole').value.trim();

    
    const user = {
        username: username,
        password: password,
        confirmPassword: confirmPassword,
        email: email,
        userRole: userRole,
        city: city,
        adharNumber: adharNumber
    }
    const res = validateUser(user);
    res();
        
        const response =   await createUser(username, password, email, userRole, city, adharNumber);
           console.log(response);
           if(response == "User already exists"){
               alert("User already exists");
               return;
           }
            alert("User created successfully");
});