// ✅ Import Firebase SDK (Modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCs3t6drN5LmBo_3dUON4WcEFwzbX5OksA",
    authDomain: "mypost-a09aa.firebaseapp.com",
    projectId: "mypost-a09aa",
    storageBucket: "mypost-a09aa.appspot.com",
    messagingSenderId: "525170862267",
    appId: "1:525170862267:web:4657b105c9b0fae179619e",
    measurementId: "G-N7SYGZ811K"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export Firebase Instances
export { auth, db };
