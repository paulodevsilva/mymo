import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "Webhook is active" }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("webhookSecret");

    console.log("🔔 Webhook AbacatePay recebido.");

    // 1. Validação do segredo
    if (secret !== process.env.ABACATEPAY_WEBHOOK_SECRET) {
      console.error("❌ Secret inválido.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const event = body.event;
    console.log("ℹ️ Evento:", event);

    let giftId = null;

    // 2. Lógica para capturar o ID (Suporta Billing e Pix Direto)

    // Caso seja Pix Direto (o que você implementou agora)
    if (event === "pix.received") {
      giftId = body.data.metadata?.externalId;
    }
    // Caso ainda use Billing/Checkout Externo em algum momento
    else if (event === "billing.paid") {
      giftId = body.data.products?.[0]?.externalId;
    }

    // 3. Atualizar o Banco
    if (giftId) {
      console.log(`💰 Pagamento confirmado para o Presente ID: ${giftId}`);
      await db.markAsPaid(giftId);
    } else {
      // Fallback: Tenta identificar pelo ID do AbacatePay se o externalId não veio
      const billingId = body.data.id;
      if (billingId) {
        const giftByAbc = await (db as any).findByAbcId?.(billingId);
        if (giftByAbc) {
          console.log(`💰 Pagamento confirmado via abcId: ${giftByAbc.id}`);
          await db.markAsPaid(giftByAbc.id);
          return NextResponse.json({ received: true }, { status: 200 });
        }
      }
      console.warn(
        "⚠️ Webhook recebido, mas nenhum identificador foi encontrado.",
      );
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Erro no Webhook:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
