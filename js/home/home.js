if(!sessionStorage.getItem("user")){
    window.location.href = "../auth/login.html";
}

import { userSince } from '../utils/helper.js';
const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

if(loggedInUser.userRole === "admin"){
    window.location.href = "../admin/admin.html";
}


const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', (event) => {

    sessionStorage.removeItem("user");
    window.location.href = "../auth/login.html";
});



// Toggle sidebar when clicking on profile button
document.getElementById("profile-btn").addEventListener("click", () => {
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


