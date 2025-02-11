// /  Import Firebase modules
import { auth, db } from "./firebase.js";
import { 
    onAuthStateChanged, 
    signOut, 
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    doc, 
    deleteDoc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

//  Default Profile Picture Function
function getProfilePicture(name) {
    if (!name) return "./images/default-avatar.png";  // Ensure correct default path

    const firstLetter = name.charAt(0).toUpperCase();
    return `./avatars/${firstLetter}.png`; // Ensure avatars are stored properly
}

//  Check if user is logged in and set profile details
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("user-name").innerText = user.displayName || "User";
        document.getElementById("user-email").innerText = user.email;
        
        //  Set Profile Picture (Use user.photoURL or default)
        let profilePic = user.photoURL || getProfilePicture(user.displayName);
        document.getElementById("user-photo").src = profilePic;

    } else {
        window.location.href = "index.html"; // Redirect to login if not logged in
    }
});

//  Logout Function
document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("Logged out successfully!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Logout Failed: " + error.message);
            console.error("Logout Error:", error);
        });
});

//  Create Post Function
document.getElementById("post-btn").addEventListener("click", async () => {
    const postContent = document.getElementById("post-content").value.trim();
    if (postContent === "") {
        alert("Post cannot be empty!");
        return;
    }

    const user = auth.currentUser;
    if (user) {
        await addDoc(collection(db, "posts"), {
            content: postContent,
            userId: user.uid,
            userName: user.displayName || "Anonymous", 
            timestamp: new Date()
        });
        document.getElementById("post-content").value = "";
    }
});

//  Fetch & Display Posts
const postsList = document.getElementById("posts-list");

onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snapshot) => {
    postsList.innerHTML = ""; // Clear existing posts
    snapshot.forEach((doc) => {
        const post = doc.data();
        const postItem = document.createElement("li");
        postItem.classList.add("list-group-item", "d-flex", "align-items-start", "gap-2");

       //  Map each alphabet to a specific color
const alphabetColors = {
    A: "rgb(0, 0, 180)", B: "rgb(175, 13, 102)", C: "rgb(146,248,70)", D: "rgb(255, 200, 47)", E: "rgb(255,118,0)",
    F: "rgb(185,185,185)", G: "rgb(235,235,222)", H: "rgb(100,100,100)", I: "rgb(255,255,0)", J: "rgb(55,19,112)",
    K: "rgb(255,255,150)", L: "rgb(202,62,94)", M: "rgb(205,145,63)", N: "rgb(12,75,100)", O: "rgb(255,0,0)",
    P: "rgb(175,155,50)", Q: "rgb(0,0,0)", R: "rgb(37,70,25)", S: "rgb(121,33,135)", T: "rgb(83,140,208)",
    U: "rgb(0,154,37)", V: "rgb(178,220,205)", W: "rgb(255,152,213)", X: "rgb(0,0,74)", Y: "rgb(175,200,74)",
    Z: "rgb(63,25,12)"
};

//  Function to get the color for a specific letter
function getColorForLetter(letter) {
    return alphabetColors[letter.toUpperCase()] || "#CCCCCC"; // Default color if letter not found
}

//  Display post content with a circular initial of the user's name
postItem.innerHTML = `
    <div class="profile-circle" style="background-color: ${getColorForLetter(post.userName.charAt(0))};">${post.userName.charAt(0).toUpperCase()}</div>
    <div class="post-content">
        <strong>${post.userName}</strong>: ${post.content}
        <br><small>${new Date(post.timestamp.seconds * 1000).toLocaleString()}</small>
    </div>
`;
        //  Edit & Delete options for post owner
        if (auth.currentUser && auth.currentUser.uid === post.userId) {
            const actionsDiv = document.createElement("div");

            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.classList.add("btn", "btn-warning", "btn-sm", "mx-2");
            editBtn.onclick = () => editPost(doc.id, post.content);

            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
            deleteBtn.onclick = () => deletePost(doc.id);

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            postItem.appendChild(actionsDiv);
        }

        postsList.appendChild(postItem);
    });
});

//  Edit Post Function
async function editPost(postId, oldContent) {
    const newContent = prompt("Edit your post:", oldContent);
    if (newContent && newContent !== oldContent) {
        await updateDoc(doc(db, "posts", postId), {
            content: newContent
        });
    }
}

//  Delete Post Function
async function deletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
        await deleteDoc(doc(db, "posts", postId));
    }
}