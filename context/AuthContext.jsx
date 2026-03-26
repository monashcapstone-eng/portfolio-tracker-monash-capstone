"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, firebaseClientConfigError } from "@/lib/firebase";

const AuthContext = createContext({});

function buildUserProfile(firebaseUser, userData = {}) {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    first_name:
      userData.first_name ||
      firebaseUser.displayName?.split(" ")[0] ||
      "",
    last_name:
      userData.last_name ||
      firebaseUser.displayName?.split(" ").slice(1).join(" ") ||
      "",
    avatar_url: firebaseUser.photoURL || null,
    is_admin: false,
    plan: "free",
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configError] = useState(firebaseClientConfigError);

  const ensureFirebaseClient = () => {
    if (!auth || !db) {
      throw new Error(
        configError ||
          "Firebase client configuration is unavailable. Check your NEXT_PUBLIC_FIREBASE_* variables."
      );
    }
  };

  const ensureUserProfile = async (firebaseUser, userData = {}) => {
    ensureFirebaseClient();
    const userRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }

    const userProfile = buildUserProfile(firebaseUser, userData);
    await setDoc(userRef, userProfile);
    return userProfile;
  };

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const existingProfile = await ensureUserProfile(firebaseUser);
          setProfile(existingProfile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, userData) => {
    ensureFirebaseClient();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userProfile = buildUserProfile(result.user, userData);
    await setDoc(doc(db, "users", result.user.uid), userProfile);
    setProfile(userProfile);
    return result;
  };

  const signIn = async (email, password) => {
    ensureFirebaseClient();
    const result = await signInWithEmailAndPassword(auth, email, password);
    const existingProfile = await ensureUserProfile(result.user);
    setProfile(existingProfile);
    return result;
  };

  const signInWithGoogle = async () => {
    ensureFirebaseClient();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const existingProfile = await ensureUserProfile(result.user);
    setProfile(existingProfile);
    return result;
  };

  const forgotPassword = async (email) => {
    ensureFirebaseClient();
    await sendPasswordResetEmail(auth, email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    });
  };

  const signOutUser = async () => {
    ensureFirebaseClient();
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const updateUserProfile = async (data) => {
    if (!user) return;
    ensureFirebaseClient();
    const updatedData = { ...data, updated_at: serverTimestamp() };
    await setDoc(doc(db, "users", user.uid), updatedData, { merge: true });
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const getIdToken = async () => {
    if (!user) return null;
    ensureFirebaseClient();
    return await user.getIdToken();
  };

  const value = {
    user,
    profile,
    loading,
    configError,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInWithGoogle,
    signOut: signOutUser,
    forgotPassword,
    updateProfile: updateUserProfile,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
