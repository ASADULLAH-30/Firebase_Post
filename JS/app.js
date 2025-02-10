import { auth } from "./firebase.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

// ✅ Function to Get Avatar Path
function getAvatarPath(name) {
    if (!name) return "./images/default-avatar.png"; // Default avatar
    const firstLetter = name.charAt(0).toUpperCase();
    return `./avatars/${firstLetter}.png`;
}

// ✅ Signup Function
async function signupUser() {
    console.log("✅ Signup button clicked!");

    let name = document.getElementById("signup-name").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let password = document.getElementById("signup-password").value.trim();

    if (!name || !email || !password) {
        alert("❌ Please enter name, email, and password.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ✅ Set display name and avatar
        await updateProfile(user, {
            displayName: name,
            photoURL: getAvatarPath(name) // Set default avatar
        });

        alert("✅ Signup Successful! 🎉");
        console.log("User Created:", user);
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("❌ Signup Failed: " + error.message);
        console.error("Signup Error:", error);
    }
}

// ✅ Login Function
async function loginUser() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
        alert("❌ Please enter both email and password.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert("✅ Login Successful! 🎉");
        console.log("Logged in User:", user);
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("❌ Login Failed: " + error.message);
        console.error("Login Error:", error);
    }
}

// ✅ Google Login Function
async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        alert("✅ Google Login Successful! 🎉");
        console.log("Google User:", user);
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("❌ Google Login Failed: " + error.message);
        console.error("Google Login Error:", error);
    }
}

// ✅ Add Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signup-btn")?.addEventListener("click", signupUser);
    document.getElementById("login-btn")?.addEventListener("click", loginUser);
    document.getElementById("google-login-btn")?.addEventListener("click", loginWithGoogle);
});
