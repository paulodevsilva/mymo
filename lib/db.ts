import { db as firebaseDb } from "./db-firebase";
import { db as mockDb, type GiftPageData } from "./db-mock";

// Toggle this via environment variable
const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === "true";

if (typeof window === "undefined") {
  console.log(`🗄️ Initializing DB Provider: ${USE_FIREBASE ? "Firebase Firestore" : "Local MockDB"}`);
}

export const db = USE_FIREBASE ? firebaseDb : mockDb;
export type { GiftPageData };
