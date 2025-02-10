// / ✅ Import Firebase modules
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

// ✅ Default Profile Picture Function
function getProfilePicture(name) {
    if (!name) return "./images/default-avatar.png";  // Ensure correct default path

    const firstLetter = name.charAt(0).toUpperCase();
    return `./avatars/${firstLetter}.png`; // Ensure avatars are stored properly
}

// ✅ Check if user is logged in and set profile details
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("user-name").innerText = user.displayName || "User";
        document.getElementById("user-email").innerText = user.email;
        
        // ✅ Set Profile Picture (Use user.photoURL or default)
        let profilePic = user.photoURL || getProfilePicture(user.displayName);
        document.getElementById("user-photo").src = profilePic;

    } else {
        window.location.href = "index.html"; // Redirect to login if not logged in
    }
});

// ✅ Logout Function
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

// ✅ Create Post Function
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

// ✅ Fetch & Display Posts
const postsList = document.getElementById("posts-list");

onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snapshot) => {
    postsList.innerHTML = ""; // Clear existing posts
    snapshot.forEach((doc) => {
        const post = doc.data();
        const postItem = document.createElement("li");
        postItem.classList.add("list-group-item", "d-flex", "align-items-start", "gap-2");

       // ✅ Map each alphabet to a specific color
const alphabetColors = {
    A: "#FF6B6B", B: "#FFD166", C: "#06D6A0", D: "#118AB2", E: "#073B4C",
    F: "#EF476F", G: "#FFD166", H: "#06D6A0", I: "#118AB2", J: "#073B4C",
    K: "#FF6B6B", L: "#FFD166", M: "#06D6A0", N: "#118AB2", O: "#073B4C",
    P: "#EF476F", Q: "#FFD166", R: "#06D6A0", S: "#118AB2", T: "#073B4C",
    U: "#FF6B6B", V: "#FFD166", W: "#06D6A0", X: "#118AB2", Y: "#073B4C",
    Z: "#EF476F"
};

// ✅ Function to get the color for a specific letter
function getColorForLetter(letter) {
    return alphabetColors[letter.toUpperCase()] || "#CCCCCC"; // Default color if letter not found
}

// ✅ Display post content with a circular initial of the user's name
postItem.innerHTML = `
    <div class="profile-circle" style="background-color: ${getColorForLetter(post.userName.charAt(0))};">${post.userName.charAt(0).toUpperCase()}</div>
    <div class="post-content">
        <strong>${post.userName}</strong>: ${post.content}
        <br><small>${new Date(post.timestamp.seconds * 1000).toLocaleString()}</small>
    </div>
`;
        // 🔄 Edit & Delete options for post owner
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

// ✅ Edit Post Function
async function editPost(postId, oldContent) {
    const newContent = prompt("Edit your post:", oldContent);
    if (newContent && newContent !== oldContent) {
        await updateDoc(doc(db, "posts", postId), {
            content: newContent
        });
    }
}

// ✅ Delete Post Function
async function deletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
        await deleteDoc(doc(db, "posts", postId));
    }
}