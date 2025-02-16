let db;

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("carRentalDB", 1);

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
                userObjectStore.createIndex("usernameIndex", "username", { unique: true });
                userObjectStore.createIndex("roleIndex", "userRole", { unique: false });
                userObjectStore.createIndex("cityIndex", "city", { unique: false });
                userObjectStore.createIndex("isBlockedIndex", "isBlocked", { unique: false });
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

function createUser(username, password, email, userRole, city, adharNumber) {
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
                window.location.href = "pages/auth/login.html";
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

export { createUser, loginUser };