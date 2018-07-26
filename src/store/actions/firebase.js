import firebase from 'firebase/app';
import 'firebase/auth';
const config = {
//your firebase credentials
};
firebase.initializeApp(config);


export const authSocial = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const twitterProvider = new firebase.auth.TwitterAuthProvider();

