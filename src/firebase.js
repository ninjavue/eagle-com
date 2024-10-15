import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
    apiKey: "AIzaSyDH_exrhbquk5LB6--KGJGVQ0Tm24I89q0",
    authDomain: "newtodo-90379.firebaseapp.com",
    projectId: "newtodo-90379",
    storageBucket: "newtodo-90379.appspot.com",
    messagingSenderId: "136368805683",
    appId: "1:136368805683:web:83f5efe559ee37c9225046",
    measurementId: "G-TV5Q334WLF"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };