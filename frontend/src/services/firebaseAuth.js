import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const ADMIN_INVITE_CODE = "MURTIKALA_ADMIN_2026";

/**
 * Register a new user or administrator with Firebase Authentication & Firestore.
 */
export const registerUser = async ({ email, password, fullName, phone, role = 'user', adminInviteCode = '' }) => {
  if (role === 'admin' && adminInviteCode.trim() !== ADMIN_INVITE_CODE) {
    throw new Error('Invalid Admin Invite Code! Please contact administrator for access authorization.');
  }

  if (!email || !password || !fullName) {
    throw new Error('Please fill in all required fields (Full Name, Email, Password).');
  }

  try {
    // 1. Create User in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userData = {
      uid,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      role: role || 'user',
      createdAt: new Date().toISOString()
    };

    // 2. Try storing User Profile in Firestore (if Firestore DB is initialized)
    try {
      await setDoc(doc(db, 'users', uid), userData);
    } catch (dbError) {
      console.warn('Firestore storage notice (Database not enabled or offline):', dbError.message);
    }

    return userData;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password must be at least 6 characters long.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    }
    throw new Error(error.message || 'Failed to create user account.');
  }
};

/**
 * Log in an existing user or administrator with Firebase Auth and fetch Firestore profile.
 */
export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Please enter both email and password.');
  }

  // 1. Authenticate with Firebase Auth
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const uid = userCredential.user.uid;
  const userEmail = userCredential.user.email || email;

  let profile = {
    uid,
    full_name: userCredential.user.displayName || userEmail.split('@')[0],
    email: userEmail,
    role: 'user'
  };

  // 2. Attempt fetching user document from Firestore (with timeout resilience)
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      profile = { ...profile, ...userSnapshot.data() };
    }
  } catch (dbError) {
    console.warn('Firestore fetch notice (Client offline or DB not initialized):', dbError.message);
  }

  return profile;
};

/**
 * Log in with Google OAuth using Firebase popup.
 */
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    let profile = {
      uid: user.uid,
      full_name: user.displayName || user.email?.split('@')[0] || 'Google User',
      email: user.email,
      role: 'user' // Default to user role
    };

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        profile = { ...profile, ...userSnapshot.data() };
      } else {
        profile.createdAt = new Date().toISOString();
        await setDoc(userDocRef, profile);
      }
    } catch (dbError) {
      console.warn('Firestore fetch/save notice (DB not enabled/offline):', dbError.message);
    }

    return profile;
  } catch (error) {
    throw new Error(error.message || 'Failed to authenticate with Google.');
  }
};

/**
 * Log out current Firebase user session.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Subscribe to Firebase Auth state updates for persistent session login.
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      let userData = {
        uid: firebaseUser.uid,
        full_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email,
        role: 'user'
      };

      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          userData = { ...userData, ...userSnapshot.data() };
        }
      } catch (err) {
        console.warn('Firestore subscription notice (Client offline or DB not initialized):', err.message);
      }

      callback(userData);
    } else {
      callback(null);
    }
  });
};
