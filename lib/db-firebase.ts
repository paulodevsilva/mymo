import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { GiftPageData } from "./db-mock";
import { db as firestore } from "./firebase";

const COLLECTION_NAME = "gifts";

export const db = {
  create: async (data: Omit<GiftPageData, "id" | "isPaid" | "createdAt">) => {
    const id = uuidv4();

    const giftData = {
      ...data,
      id,
      isPaid: false,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(firestore, COLLECTION_NAME, id), giftData);

    // Convert timestamp for return to match interface expectations if needed
    // But since it's async and return values are often just JSON, it might be fine.
    return { ...giftData, createdAt: new Date() } as GiftPageData;
  },

  findById: async (id: string) => {
    const docRef = doc(firestore, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Firestore timestamps need conversion to Date if used directly
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
      } as GiftPageData;
    }
    return null;
  },

  findByAbcId: async (abcId: string) => {
    const q = query(collection(firestore, COLLECTION_NAME), where("abcId", "==", abcId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
      } as GiftPageData;
    }
    return null;
  },

  markAsPaid: async (id: string) => {
    console.log(`🔥 [Firestore] Marking ${id} as paid...`);
    const docRef = doc(firestore, COLLECTION_NAME, id);
    await updateDoc(docRef, { isPaid: true });
    console.log(`✅ [Firestore] ${id} status updated to true.`);

    // Return the updated document
    const updatedSnap = await getDoc(docRef);
    if (updatedSnap.exists()) {
       const data = updatedSnap.data();
       return {
         ...data,
         createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
       } as GiftPageData;
    }
    return null;
  },
};
