import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log(`🔔 Stripe Webhook receive: ${event.type}`);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const giftId = session.metadata?.giftId;

    console.log(`💳 Payment metadata:`, session.metadata);

    if (giftId) {
      await db.markAsPaid(giftId);
      console.log(`✅ Presente ${giftId} liberado com sucesso via Cartão!`);
    } else {
      console.warn("⚠️ Sem giftId no metadata da sessão Stripe");
    }
  }

  return NextResponse.json({ received: true });
}
