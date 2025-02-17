import { getAllApprovals, approveCars } from "/js/database/db.js";

const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

if (!loggedInUser) {
  window.location.href = "/pages/auth/login.html";
}

if (loggedInUser.userRole !== "admin") {
  window.location.href = "/pages/home/home.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  const approvals = await getAllApprovals();
  const allApprovals = document.getElementById("car-approvals");
  console.log(approvals);
  approvals.forEach(car => {
     
     const carDiv = document.createElement("div");
     carDiv.className = "car-container";
     carDiv.innerHTML = `    
        <div class="car-image">
            <img src="${car.images[0]}" alt="car-image">
        </div>
        <div class="car-details">
            <h2>${car.carName}</h2>
            <p><strong>Model:</strong> ${car.carModel}</p>
            <p><strong>Price:</strong> ${car.carPrice}</p>
            <p><strong>Type:</strong> ${car.carType}</p>
            <p><strong>Category:</strong> ${car.category}</p>
            <div class="owner-details">
                <p><strong>Adhar Number:</strong> ${car.owner.adharNumber}</p>
                <p><strong>City:</strong> ${car.owner.city}</p>
                <p><strong>Email:</strong> ${car.owner.email}</p>
                <p><strong>Username:</strong> ${car.owner.username}</p>
            </div>
            <button class="approve-button" data-car-id="${car.carId}">Approve</button>
        </div>
     `;

     allApprovals.appendChild(carDiv);

     const approveButton = carDiv.querySelector(".approve-button");
     approveButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const carId = event.target.getAttribute("data-car-id");
        console.log(carId);
        const response = await approveCars(carId);
        console.log(response);
        if(response){
            alert("Car approved successfully");
        }
    });
  });
});



const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', (event) => {
    sessionStorage.removeItem("user");
    window.location.href = "/pages/auth/login.html";
 });