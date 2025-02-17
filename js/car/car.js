import { addCar } from "/js/database/db.js";
import {userSince} from "/js/utils/helper.js";

const loggedInUser = JSON.parse(sessionStorage.getItem("user"));    

if(!loggedInUser){
    window.location.href = "/pages/home/home.html";
}

if(loggedInUser && loggedInUser.userRole === "seller"){
    const searchBox = document.getElementsByClassName("search-box")[0]; 
    searchBox.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => { 
    if(loggedInUser){
        const loginButton = document.getElementsByClassName("login-btn");
        loginButton[0].innerText = "Logout";
    }
    if( loggedInUser && loggedInUser.userRole === "seller"){
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
    window.location.href = "/pages/home/home.html";
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


document.getElementById("imageUpload").addEventListener("change", function(event) {
    const previewContainer = document.getElementById("imagePreview");
    previewContainer.innerHTML = ""; // Clear previous images

    const files = event.target.files;
    if(files.length > 5) {
        alert("You can upload a maximum of 5 images");
        return;
    }

    const base64Images = [];
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                previewContainer.appendChild(img);
                base64Images.push(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    // Store the base64 images array in a global variable or a hidden input field
    window.base64Images = base64Images;
});

const submitCar = document.getElementById("addCar-btn");

submitCar.addEventListener("click", async (event) => {
    event.preventDefault();
    const carName = document.getElementById("carName").value.trim();
    const carModel = document.getElementById("carModel").value.trim();
    const carType = document.getElementById("carType").value.trim();
    const category = document.getElementById("category").value.trim();
    const location = document.getElementById("location").value.trim();
    const carPrice = document.getElementById("carPrice").value.trim();
    const mileage = document.getElementById("mileage").value.trim();
    const ownerUsername = loggedInUser.username;
    const owner = {
        username: loggedInUser.username,
        email: loggedInUser.email,
        city: loggedInUser.city,
        adharNumber: loggedInUser.adharNumber
    };

    // Use the global base64Images array
    const images = window.base64Images || [];

    const response = await addCar(carName, ownerUsername, carType, owner, carModel, category, location, carPrice, mileage, images);
    console.log(response);
    if(response == "Error adding car"){
        alert("Error adding car");
        return;
    }
    alert("Car added successfully");
});