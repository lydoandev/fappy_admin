import Firebase from "firebase"
import 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyDyJan8_pFtte47aN79LOmQg0VY43U0Biw",
    authDomain: "fappymanagement.firebaseapp.com",
    databaseURL: "https://fappymanagement.firebaseio.com",
    projectId: "fappymanagement",
    storageBucket: "fappymanagement.appspot.com",
    messagingSenderId: "65256485239",
    appId: "1:65256485239:web:18b7d5f12c20243f577172",
    measurementId: "G-ZFZS5JRFJ1"
  };

  const fire = Firebase.initializeApp(firebaseConfig);
  
  export default fire