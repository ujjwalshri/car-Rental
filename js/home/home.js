if(!sessionStorage.getItem("user")){
    window.location.href = "../auth/login.html";
}


const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

if(loggedInUser.userRole === "admin"){
    window.location.href = "../admin/admin.html";
}


const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', (event) => {

    sessionStorage.removeItem("user");
    window.location.href = "../auth/login.html";
});