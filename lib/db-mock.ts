import { v4 as uuidv4 } from "uuid";

export interface GiftPageData {
  id: string;
  abcId?: string;
  coupleName: string;
  message: string;
  imageUrl: string | string[]; // Suporta 1 ou várias fotos
  youtubeUrl?: string;
  startDate?: string;
  customerEmail: string;
  isPaid: boolean;
  createdAt: Date;
  // --- Novos Campos Premium ---
  plan: "simple" | "premium";
  customEmoji?: string;
  textColor?: string;
  musicStartTime?: number;
  musicEndTime?: number;
  theme?: string;
}

const globalForDb = global as unknown as { mockStore: GiftPageData[] };
export const mockStore = globalForDb.mockStore || [];
if (process.env.NODE_ENV !== "production") globalForDb.mockStore = mockStore;

export const db = {
  create: async (data: Omit<GiftPageData, "id" | "isPaid" | "createdAt">) => {
    const newGift: GiftPageData = {
      id: uuidv4(),
      ...data,
      isPaid: false,
      createdAt: new Date(),
    };
    mockStore.push(newGift);
    return newGift;
  },

  findById: async (id: string) => {
    return mockStore.find((item) => item.id === id) || null;
  },

  findByAbcId: async (abcId: string) => {
    return mockStore.find((item) => item.abcId === abcId) || null;
  },

  markAsPaid: async (id: string) => {
    const index = mockStore.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockStore[index].isPaid = true;
      return mockStore[index];
    }
    return null;
  },
};
