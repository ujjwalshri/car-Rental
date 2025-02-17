// if(!sessionStorage.getItem("user")){
//     window.location.href = "../auth/login.html";
// }

import { userSince } from '../utils/helper.js';
const loggedInUser = JSON.parse(sessionStorage.getItem("user"));




// if(loggedInUser.userRole === "admin"){
//     window.location.href = "../admin/admin.html";
// }
if(!loggedInUser){
    const dropdown = document.getElementsByClassName("dropdown");
    dropdown[0].style.display = "none"; 
}

if(loggedInUser && loggedInUser.userRole === "seller"){
    const searchBox = document.getElementsByClassName("search-box")[0];
    searchBox.style.display = "none";
}

if(loggedInUser && loggedInUser.userRole === "admin"){
    window.location.href = "/pages/admin/admin.html";
}

document.addEventListener("DOMContentLoaded", () => { 

   

    if(loggedInUser){
        const loginButton = document.getElementsByClassName("login-btn");
        loginButton[0].innerText = "Logout";
    }
    if(loggedInUser &&  loggedInUser.userRole === "seller"){
       const addCar = document.getElementById("dynamic");
       addCar.setAttribute("id" , "addCar");
       addCar.innerHTML = `<a href="/pages/cars/addCar.html">addCar</a>`;
       const dropdownMenu = document.getElementsByClassName("dropdown-menu")[0];
      
        dropdownMenu.appendChild(addCar);
    }
    if(loggedInUser && loggedInUser.userRole === "buyer"){
        const bookings = document.getElementById("dynamic");
        bookings.setAttribute("id" , "bookings");
        bookings.innerHTML = `<a href="/pages/bookings/bookings.html">bookings</a>`;
        const dropdownMenu = document.getElementsByClassName("dropdown-menu")[0];
        dropdownMenu.appendChild(bookings);
    }
 });


const logoutButton = document.getElementsByClassName('login-btn')[0];

logoutButton.addEventListener('click', (event) => {

    sessionStorage.removeItem("user");
    window.location.href = "../auth/login.html";
});



// Toggle sidebar when clicking on profile button
document.getElementById("profile").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");

    if (sidebar.classList.contains("active")) {
        sidebar.classList.remove("active"); // Hide sidebar
    } else {
        sidebar.classList.add("active"); // Show sidebar

        // Fetch user details from sessionStorage
        const user = JSON.parse(sessionStorage.getItem("user")) || {};

        // Populate the sidebar with user details
        document.getElementById("user-name").textContent = user.username || "N/A";
        document.getElementById("user-email").textContent = user.email || "N/A";
        document.getElementById("user-role").textContent = user.userRole || "N/A";
        document.getElementById("user-city").textContent = user.city || "N/A";
        document.getElementById("user-since").textContent = userSince() || "N/A";
    }
});

// Close sidebar when clicking the close button
document.getElementById("close-sidebar").addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("active"); // Hide sidebar
});


