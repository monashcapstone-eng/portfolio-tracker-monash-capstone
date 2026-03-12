import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const adminApps = getApps();

function normaliseEnvValue(value) {
  if (!value) return value;

  let nextValue = value.trim();

  if (nextValue.endsWith(",")) {
    nextValue = nextValue.slice(0, -1).trim();
  }

  if (
    (nextValue.startsWith('"') && nextValue.endsWith('"')) ||
    (nextValue.startsWith("'") && nextValue.endsWith("'"))
  ) {
    nextValue = nextValue.slice(1, -1);
  }

  return nextValue;
}

const projectId = normaliseEnvValue(process.env.FIREBASE_ADMIN_PROJECT_ID);
const clientEmail = normaliseEnvValue(process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
const privateKey = normaliseEnvValue(process.env.FIREBASE_ADMIN_PRIVATE_KEY)?.replace(
  /\\n/g,
  "\n"
);

function hasServiceAccountCredentials() {
  return Boolean(
    projectId &&
      clientEmail &&
      privateKey &&
      privateKey.includes("BEGIN PRIVATE KEY") &&
      privateKey.includes("END PRIVATE KEY")
  );
}

if (adminApps.length === 0) {
  if (hasServiceAccountCredentials()) {
    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (error) {
      console.warn("Firebase Admin credential fallback:", error?.message || error);
      initializeApp();
    }
  } else {
    initializeApp();
  }
}

const adminAuth = getAuth();
const adminDb = getFirestore();

export { adminAuth, adminDb };
