"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

interface PricingProps {
  onSelectPlan: (plan: "simple" | "premium") => void;
}

export default function Pricing({ onSelectPlan }: PricingProps) {
  return (
    <section id="pricing" className="py-24 px-6 bg-[#FDFCF8] relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute inset-0 bg-[radial-gradient(#e11d48_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-rose-500 font-bold text-xs uppercase tracking-widest mb-3 block">
            Planos Disponíveis
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-rose-950 mb-6">
            O valor de uma lembrança eterna
          </h2>
          <p className="text-stone-500 text-lg font-light">
            Escolha a melhor forma de surpreender hoje.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          {/* Plan Simple */}
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-stone-200 text-center hover:border-rose-200 transition-colors relative group">
            <h3 className="font-serif text-2xl text-stone-600 mb-2">Simples</h3>
            <div className="text-5xl font-serif text-stone-900 mb-6 tracking-tight">R$ 9,90</div>

            <ul className="space-y-4 text-left mb-10 text-stone-600 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center shrink-0"><Check size={10} className="text-stone-500" /></div>
                1 Foto Especial
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center shrink-0"><Check size={10} className="text-stone-500" /></div>
                Trilha Sonora (YouTube)
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center shrink-0"><Check size={10} className="text-stone-500" /></div>
                Mensagem Personalizada
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center shrink-0"><Check size={10} className="text-stone-500" /></div>
                QR Code Digital
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center shrink-0"><Check size={10} className="text-stone-500" /></div>
                <strong>Acesso Vitalício</strong>
              </li>
            </ul>

            <button
              onClick={() => onSelectPlan("simple")}
              className="w-full py-4 rounded-xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all uppercase text-xs tracking-widest"
            >
              Começar Simples
            </button>
          </div>

          {/* Plan Premium */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 md:p-12 rounded-[2.5rem] bg-stone-900 text-white shadow-2xl shadow-stone-900/20 text-center relative overflow-hidden md:scale-105 border border-stone-800"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-orange-400 to-rose-500" />

            <div className="absolute top-6 right-6 bg-rose-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-rose-500/30 text-[10px] font-bold uppercase tracking-widest text-rose-200 flex items-center gap-2">
              <Sparkles size={10} /> Mais Escolhido
            </div>

            <h3 className="font-serif text-2xl text-rose-200 mb-2">Premium</h3>
            <div className="text-5xl font-serif text-white mb-6 tracking-tight">R$ 19,90</div>

            <ul className="space-y-4 text-left mb-10 text-rose-100/90 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0"><Check size={10} className="text-white" /></div>
                <strong>3 Fotos (Galeria Slideshow)</strong>
              </li>
              <li className="flex items-center gap-3">
                 <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0"><Check size={10} className="text-white" /></div>
                 <strong>Personalização de Cores</strong>
              </li>
               <li className="flex items-center gap-3">
                 <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0"><Check size={10} className="text-white" /></div>
                 <strong>Chuva de Emojis</strong>
              </li>
              <li className="flex items-center gap-3 opacity-75">
                <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0"><Check size={10} className="text-white" /></div>
                Trilha Sonora (YouTube)
              </li>
               <li className="flex items-center gap-3 opacity-75">
                <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0"><Check size={10} className="text-white" /></div>
                QR Code Digital
              </li>
              <li className="flex items-center gap-3 opacity-90">
                <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0"><Check size={10} className="text-white" /></div>
                <strong>Acesso Vitalício</strong>
              </li>
            </ul>

            <button
              onClick={() => onSelectPlan("premium")}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 font-bold text-white shadow-lg shadow-rose-900/50 hover:brightness-110 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2"
            >
              Criar Mymo Premium <Sparkles size={14} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
