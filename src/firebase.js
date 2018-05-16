import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyCim2PPSlz3LFwhoFyeps8ljLMkU4mCnuA",
    authDomain: "group-scheduler-84e05.firebaseapp.com",
    databaseURL: "https://group-scheduler-84e05.firebaseio.com",
    projectId: "group-scheduler-84e05",
    storageBucket: "group-scheduler-84e05.appspot.com",
    messagingSenderId: "652555324141"
}

firebase.initializeApp(config)

export default firebase
export const db = firebase.database()
export const auth = firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider();

