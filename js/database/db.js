let db;

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("carRentalDB", 4);

        request.onerror = (event) => {
            reject("Error opening database");
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve();
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            if (!db.objectStoreNames.contains("users")) {
                const userObjectStore = db.createObjectStore("users", { keyPath: "username" });
                userObjectStore.createIndex("firstNameIndex", "firstName", { unique: false });
                userObjectStore.createIndex("lastNameIndex", "lastName", { unique: false });
                userObjectStore.createIndex("usernameIndex", "username", { unique: true });
                userObjectStore.createIndex("roleIndex", "userRole", { unique: false });
                userObjectStore.createIndex("cityIndex", "city", { unique: false });
                userObjectStore.createIndex("isBlockedIndex", "isBlocked", { unique: false });
            }
            if(!db.objectStoreNames.contains("cars")){
            // Create indexes for the car object store
            const carObjectStore = db.createObjectStore("cars", { keyPath: "carId" });
            carObjectStore.createIndex("carIDIndex", "carId", { unique: true });
            carObjectStore.createIndex("ownerUsernameIndex", "owner.username", { unique: false });
            carObjectStore.createIndex("carTypeIndex", "cartype", { unique: false });
            carObjectStore.createIndex("carNameIndex", "carname", { unique: false });
            carObjectStore.createIndex("carModelIndex", "carModel", { unique: false });
            carObjectStore.createIndex("categoryIndex", "category", { unique: false });
            carObjectStore.createIndex("locationIndex", "location", { unique: false });
            carObjectStore.createIndex("carPriceIndex", "carPrice", { unique: false });
            carObjectStore.createIndex("createdAtIndex", "createdAt", { unique: false });
            carObjectStore.createIndex("isApprovedIndex", "isApproved", { unique: false });
            carObjectStore.createIndex("deletedIndex", "deleted", { unique: false });
            carObjectStore.createIndex("mileageIndex", "mileage", { unique: false });
            }
            if (!db.objectStoreNames.contains("bidding")) {
                const biddingObjectStore = db.createObjectStore("bidding", { keyPath: "bidId" });
                biddingObjectStore.createIndex("bidIdIndex", "bidId", { unique: true });
                biddingObjectStore.createIndex("carIdIndex", "carId", { unique: false });
                biddingObjectStore.createIndex("userIdIndex", "userId", { unique: false });
                biddingObjectStore.createIndex("bidAmountIndex", "bidAmount", { unique: false });
                biddingObjectStore.createIndex("bidTimeIndex", "bidTime", { unique: false });
            }
        };
    });
}

document.addEventListener("DOMContentLoaded", () => {
    openDatabase()
    .then(() => {
        console.log("Database opened successfully");
    })
    .catch((error) => {
        console.error(error);
    });
});

function hashPassword(password) {
    return btoa(password);
}

function getUser(username) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["users"], "readonly");
        const userObjectStore = transaction.objectStore("users");
        const request = userObjectStore.get(username);
        request.onsuccess = (event) => {
            const user = event.target.result;
            resolve(user);
        };

        request.onerror = (event) => {
            reject("Error getting user");
        };
    });
}

function createUser(firstName, lastName, username, password, email, userRole, city, adharNumber) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["users"], "readwrite");
        const userObjectStore = transaction.objectStore("users");
        const hashedPassword = hashPassword(password);

        const getRequest = userObjectStore.get(username);
        getRequest.onsuccess = (event) => {
            const dbUser = event.target.result;
            if (dbUser) {
                reject("User already exists");
                return;
            }

            const user = {
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: hashedPassword,
                email: email,
                userRole: userRole,
                city: city,
                adharNumber: adharNumber,
                isBlocked: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false
            };

            const addRequest = userObjectStore.add(user);
            addRequest.onsuccess = (event) => {
                sessionStorage.setItem("user", JSON.stringify(user));
                window.location.href = "/pages/home/home.html";
                resolve();
            };

            addRequest.onerror = (event) => {
                reject("Error creating user");
            };
        };

        getRequest.onerror = (event) => {
            reject("Error checking user existence");
        };

        transaction.oncomplete = () => {
            console.log("Transaction completed: database modification finished.");
        };

        transaction.onerror = (event) => {
            reject("Transaction not opened due to error: " + event.target.error);
        };
    });
}

function loginUser(username, password) {
    return new Promise(async (resolve, reject) => {
        const dbUser = await getUser(username);
        if (!dbUser) {
            reject("User does not exist");
            return;
        }

        const hashedPassword = hashPassword(password);
        if (dbUser.password !== hashedPassword) {
            reject("Invalid password");
            return;
        }

        sessionStorage.setItem("user", JSON.stringify(dbUser));
        resolve();
    });
}


function addCar(carName,ownerUsername,carType, owner, carModel, category, location, carPrice, mileage, images){
    return new Promise(async (resolve, reject) => {
        const transaction = db.transaction(["cars"], "readwrite");
        const carObjectStore = transaction.objectStore("cars");
        const car = {
            carId: crypto.randomUUID(),
            carName: carName,
            ownerUsername: ownerUsername,
            carType: carType,
            owner: owner,
            carModel: carModel,
            category: category,
            location: location,
            carPrice: carPrice,
            mileage: mileage,
            images: images,
            createdAt: new Date(),
            isApproved: false,
            deleted: false
        };
        const request = carObjectStore.add(car);
        request.onsuccess = (event) => {
            resolve("Car added successfully");
        };
        request.onerror = (event) => {
            reject("Error adding car");
        };
    });
}





export { createUser, loginUser, addCar };