import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const firebaseAuth = {
  register: (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password),

  login: (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password),

  logout: () => signOut(auth),

  resetPassword: (email: string) => sendPasswordResetEmail(auth, email),

  updateDisplayName: (user: User, displayName: string) =>
    updateProfile(user, { displayName }),

  updatePhotoURL: (user: User, photoURL: string) =>
    updateProfile(user, { photoURL }),

  signInWithGoogleCredential: (idToken: string) => {
    const credential = GoogleAuthProvider.credential(idToken);
    return signInWithCredential(auth, credential);
  },

  signInWithFacebookCredential: (accessToken: string) => {
    const credential = FacebookAuthProvider.credential(accessToken);
    return signInWithCredential(auth, credential);
  },

  getIdToken: () => auth.currentUser?.getIdToken(true) ?? Promise.resolve(null),

  currentUser: () => auth.currentUser,
};
