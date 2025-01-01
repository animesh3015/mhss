// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAP_OvuHwrrfx5HonvZWxx6_wF8EwHBOjw",
  authDomain: "community-forum-1f996.firebaseapp.com",
  projectId: "community-forum-1f996",
  storageBucket: "community-forum-1f996.firebasestorage.app",
  messagingSenderId: "448794514677",
  appId: "1:448794514677:web:e5a91187fff85a1705a1bc",
  measurementId: "G-7XR6PYS5D6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);