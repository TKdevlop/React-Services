import firebase from 'firebase/app';
import 'firebase/auth';
const config = {
  apiKey: "AIzaSyDI-BRZ_hyXcyw_gRfJAr-JlIKIZpwX6sE",
  authDomain: "food-ordering-6ccba.firebaseapp.com",
  databaseURL: "https://food-ordering-6ccba.firebaseio.com",
  projectId: "food-ordering-6ccba",
  storageBucket: "food-ordering-6ccba.appspot.com",
  messagingSenderId: "298314384548"
};
firebase.initializeApp(config);


export const authSocial = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const twitterProvider = new firebase.auth.TwitterAuthProvider();

