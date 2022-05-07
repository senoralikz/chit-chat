// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4M1_jpHpdRbtU0s0fn_VvuwYP8ro_yAc",
  authDomain: "chit-chat-b5685.firebaseapp.com",
  projectId: "chit-chat-b5685",
  storageBucket: "chit-chat-b5685.appspot.com",
  messagingSenderId: "222411167592",
  appId: "1:222411167592:web:182c5eb2e8829b76b9a8dd",
  measurementId: "G-G26BS5Z7FV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
