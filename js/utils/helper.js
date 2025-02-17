export function userSince(){
    const user = JSON.parse(sessionStorage.getItem("user"));
    const date = new Date(user.createdAt);
    return date.toDateString();
}


export function convertImageToBase64(){
   
}