import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDEDM1JGKxheehuwOKeFTu6MfCN8YB66Cg",
  authDomain: "c-mide.firebaseapp.com",
  projectId: "c-mide",
  storageBucket: "c-mide.firebasestorage.app",
  messagingSenderId: "974633738373",
  appId: "1:974633738373:web:cd234e28964228cd7d09ec",
  measurementId: "G-2H127T173V"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Auth provider base
export const proveedorGoogle = new GoogleAuthProvider()

// Calendar scopes
export const proveedorGoogleCalendar = new GoogleAuthProvider()
proveedorGoogleCalendar.addScope('https://www.googleapis.com/auth/calendar')
proveedorGoogleCalendar.addScope('https://www.googleapis.com/auth/calendar.events')

// Drive scopes (para subir/leer BC3 desde Drive)
export const proveedorGoogleDrive = new GoogleAuthProvider()
proveedorGoogleDrive.addScope('https://www.googleapis.com/auth/drive.file')
proveedorGoogleDrive.addScope('https://www.googleapis.com/auth/drive.readonly')

export default app
