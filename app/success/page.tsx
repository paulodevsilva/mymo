"use client";

import { motion } from "framer-motion";
import { Heart, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense, useEffect, useState } from "react";


function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [copied, setCopied] = useState(false);

  const [giftUrl, setGiftUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      setGiftUrl(`${window.location.origin}/v/${id}`);
    }
  }, [id]);

  return (
    <main className="min-h-screen bg-[#FFF0F3] flex items-center justify-center p-4">
      {/* Elementos flutuantes de fundo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 0], rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.8 }}
            className="absolute text-pink-300/40"
            style={{ left: `${i * 20}%` }}
          >
            <Heart fill="currentColor" size={24 + i * 4} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-sm rounded-[3rem] p-6 text-center shadow-2xl relative z-10"
      >
        <Heart
          className="text-rose-500 mx-auto mb-4"
          fill="currentColor"
          size={40}
        />
        <h3 className="font-serif text-3xl mb-6 text-rose-950">
          Seu Mymo está pronto!
        </h3>

        {giftUrl && (
            <div className="bg-[#FFFDF0] p-6 rounded-[2.5rem] border border-stone-200 mb-6 inline-block shadow-lg shadow-stone-100">
                <QRCodeSVG
                value={giftUrl}
                size={160}
                fgColor="#881337"
                bgColor="transparent"
                />
            </div>
        )}

        <button
            onClick={() => window.open(giftUrl, "_blank")}
            className="w-full bg-rose-900 text-rose-50 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mb-3 shadow-xl shadow-rose-200 hover:bg-rose-800 transition-all font-serif"
        >
            <Send size={18} /> Ver meu Mymo
        </button>
        <button
            onClick={() => {
            navigator.clipboard.writeText(giftUrl);
            alert("Link Copiado!");
            }}
            className="w-full text-[10px] text-stone-400 font-bold uppercase tracking-widest py-2 border border-stone-100 rounded-xl mt-2"
        >
            Copiar Link
        </button>
      </motion.div>
    </main>
  );
}

// Wrapper para o Suspense (obrigatório ao usar useSearchParams)
export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
