"use server";

import { createAbacatePayBilling } from "@/lib/abacatepay";
import { db } from "@/lib/db";
import { uploadBase64ToR2 } from "@/lib/s3";
import { createStripeSession } from "@/lib/stripe";

export type CheckoutResult = {
  success: boolean;
  error?: string;
  pixCode?: string;
  pixImage?: string;
  giftId?: string;
  abcId?: string;
  url?: string | null;
};

export type CheckoutParams = {
  method: "pix" | "card";
  plan: "simple" | "premium";
  coupleName: string;
  message: string;
  imageUrl: string | string[];
  youtubeUrl?: string;
  startDate?: string;
  theme?: string;
  customerEmail: string;
  customEmoji?: string;
  textColor?: string;
  musicStartTime?: number;
  musicEndTime?: number;
};

export async function checkoutAction(data: CheckoutParams): Promise<CheckoutResult> {
  try {
    const {
      method,
      plan,
      coupleName,
      message,
      imageUrl,
      youtubeUrl,
      startDate,
      theme,
      customerEmail,
      customEmoji,
      textColor,
      musicStartTime,
      musicEndTime,
    } = data;

    // --- UPLOAD IMAGES TO R2 ---
    const processImageUrl = async (url: string | string[]) => {
      if (Array.isArray(url)) {
        return Promise.all(url.map((u, i) => uploadBase64ToR2(u, `gift-${Date.now()}-${i}`)));
      }
      return uploadBase64ToR2(url, `gift-${Date.now()}-0`);
    };

    const uploadedImageUrl = await processImageUrl(imageUrl);
    const amountInCents = plan === "premium" ? 1999 : 999;

    // --- CASE: PIX (ABACATE PAY) ---
    if (method === "pix") {
      const billing = await createAbacatePayBilling({
        amount: amountInCents,
        description: `Presente Digital - ${coupleName}`,
      });

      const gift = await db.create({
        abcId: billing.id,
        theme: theme || "anniversary",
        coupleName,
        message,
        imageUrl: uploadedImageUrl,
        youtubeUrl,
        startDate,
        customerEmail,
        plan,
        customEmoji: plan === "premium" ? customEmoji : "❤️",
        textColor: plan === "premium" ? textColor : "#E11D48",
        musicStartTime: musicStartTime || 0,
        musicEndTime: musicEndTime || 0,
      });

      return {
        success: true,
        pixCode: billing.brCode,
        pixImage: billing.brCodeBase64,
        giftId: gift.id,
        abcId: billing.id,
      };
    }

    // --- CASE: CARD (STRIPE) ---
    if (method === "card") {
      const gift = await db.create({
        theme: theme || "anniversary",
        coupleName,
        message,
        imageUrl: uploadedImageUrl,
        youtubeUrl,
        startDate,
        customerEmail,
        plan,
        customEmoji: plan === "premium" ? customEmoji : "❤️",
        textColor: plan === "premium" ? textColor : "#E11D48",
        musicStartTime: musicStartTime || 0,
        musicEndTime: musicEndTime || 0,
      });

      const session = await createStripeSession({
        giftId: gift.id,
        coupleName,
        amount: amountInCents,
      });

      return {
        success: true,
        url: session.url,
      };
    }

    return { success: false, error: "Método inválido" };
  } catch (error: any) {
    console.error("Checkout Action Error:", error.message);
    return { success: false, error: error.message };
  }
}
