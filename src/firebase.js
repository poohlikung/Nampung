import { initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions"
import { connectStorageEmulator, getStorage } from "firebase/storage"

//------------------------//
const firebaseConfig = {
  apiKey: "AIzaSyB28CC_qHK8TCvE45KBNO3EdRj4XkC_rh4",
  authDomain: "cp422021-paleerat.firebaseapp.com",
  databaseURL: "https://cp422021-paleerat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cp422021-paleerat",
  storageBucket: "cp422021-paleerat.firebasestorage.app",
  messagingSenderId: "398106107280",
  appId: "1:398106107280:web:c629a216be03d532726715",
  measurementId: "G-K5039YJSC0"
};
//------------------------//

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()
const storage = getStorage(app)

//const functions = getFunctions(app,"asia-southeast1")

const functions = getFunctions(app)

if (true) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectFunctionsEmulator(functions, "localhost", 5001)
  connectStorageEmulator(storage, "localhost", 9199)
}

const call = async(functionName, params) => {
  try {
    let callableFunctions = httpsCallable(functions, functionName)
    let res = await callableFunctions(params)
    if (res.data.success) {
      return res.data
    } else if(res.data.success === false) {
      console.log(res.data.reason)
    }
    
  } catch (err) {
    console.log(err)
  }
}

export { app, auth, call, db, functions, storage }
