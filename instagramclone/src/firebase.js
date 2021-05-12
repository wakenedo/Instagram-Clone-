import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAxGZGRt6hHFDVboRu9ShTHAwMHA7FpdYc",
    authDomain: "instagram-clone-3fa1c.firebaseapp.com",
    projectId: "instagram-clone-3fa1c",
    storageBucket: "instagram-clone-3fa1c.appspot.com",
    messagingSenderId: "466007447416",
    appId: "1:466007447416:web:3555da6d1235f21272da8d",
    measurementId: "G-QJSDQWX5EV"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage }
  