// ─────────────────────────────────────────────────────────────────────────────
//  SentinelX · Firebase Configuration
//  Project: sentinelx-platform-22dfb
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDVa9mw9woffuVQ4l-oMcXnIgQRoWCcprs",
  authDomain: "sentinelx-platform-22dfb.firebaseapp.com",
  projectId: "sentinelx-platform-22dfb",
  storageBucket: "sentinelx-platform-22dfb.firebasestorage.app",
  messagingSenderId: "916510265732",
  appId: "1:916510265732:web:7f2b2621a815eee7028dd1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');
githubProvider.addScope('user:email');
appleProvider.addScope('email');
appleProvider.addScope('name');

// Auth helpers
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
};

export default app;
