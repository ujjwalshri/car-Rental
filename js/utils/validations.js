export function validateUser(user) {
    const { username, password, confirmPassword, email, city, adharNumber, userRole } = user;
    if(validatePassword(password) == false){
        return ()=>{
            alert("Password should be atleast 8 characters");
        };
    }
    if(password != confirmPassword){
        return ()=>{
            alert("Passwords do not match");
        }
    }
    if (!username || !password || !confirmPassword || !email || !city || !adharNumber || !userRole) {
        return ()=>{
            alert("All fields are mandatory");
        }
    }
    
    return ()=>{
        
    }
}

export function validatePassword(password) {
    if (password.length < 8) {
        return false;
    }
    return true;
}