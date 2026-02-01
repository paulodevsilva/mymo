// app/success/[id]/page.tsx
"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { use } from "react";

export default function SuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // Desembrulha aqui também

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const finalUrl = `${baseUrl}/v/${id}`;

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-pink-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-8">
        <h1 className="text-3xl font-bold text-pink-600">🎉 Sucesso!</h1>
        <QRCodeSVG value={finalUrl} size={200} className="mx-auto" />
        <Link
          href={`/v/${id}`}
          className="text-pink-500 underline block break-all"
        >
          {finalUrl}
        </Link>
      </div>
    </main>
  );
}
