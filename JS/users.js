// Firestore Import  
import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// DOM Elements  
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const userResults = document.getElementById("userResults");

// Function to Search Users in Firestore  
async function searchUser() {
    userResults.innerHTML = ""; // Clear previous results  
    const searchValue = searchInput.value.trim().toLowerCase();

    if (!searchValue) {
        alert("Please enter a username.");
        return;
    }

    try {
        // Query Firestore for matching users  
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("name", "==", searchValue));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            userResults.innerHTML = `<p>No user found!</p>`;
            return;
        }

        querySnapshot.forEach(async (doc) => {
            const userData = doc.data();
            const userDiv = document.createElement("div");
            userDiv.classList.add("user");

            // Fetch User Posts  
            const postsRef = collection(db, "posts");
            const postQuery = query(postsRef, where("userId", "==", doc.id));
            const postSnapshot = await getDocs(postQuery);

            let postsHTML = "";
            postSnapshot.forEach((postDoc) => {
                const post = postDoc.data();
                postsHTML += `<div class="post">
                    <h4>${post.title}</h4>
                    <p>${post.content}</p>
                </div>`;
            });

            userDiv.innerHTML = `
                <h3>${userData.name}</h3>
                <p>${userData.email}</p>
            `;

            userResults.appendChild(userDiv);
        });

    } catch (error) {
        console.error("Error searching user:", error);
        alert("Something went wrong. Check console.");
    }
}

// Event Listener  
searchButton.addEventListener("click", searchUser);
