import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Rota para SALVAR o presente (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar se os campos básicos existem
    if (!body.coupleName || !body.imageUrl) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Salvando no nosso "banco" mock
    const newGift = await db.create({
      ...body,
      isPaid: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newGift);
  } catch (error) {
    console.error("Erro no POST /api/gift:", error);
    return NextResponse.json(
      { error: "Erro ao salvar dados" },
      { status: 500 },
    );
  }
}

// Rota para BUSCAR o presente (GET)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID ausente" }, { status: 400 });
    }

    const data = await db.findById(id);

    if (!data) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    if (!data.isPaid) {
      return NextResponse.json({
        id: data.id,
        isPaid: false,
        coupleName: data.coupleName,
      });
    }

    // Higienizar dados (remover email do comprador para o destinatário não ver)
    const { customerEmail, ...publicData } = data;

    return NextResponse.json(publicData);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
