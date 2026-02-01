import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function createStripeSession(data: {
  giftId: string;
  coupleName: string;
  amount: number;
}) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: { name: `Presente ${data.coupleName}` },
          unit_amount: data.amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: { giftId: data.giftId },
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?id=${data.giftId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
  });
}
