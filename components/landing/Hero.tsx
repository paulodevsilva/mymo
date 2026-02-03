"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import NextImage from "next/image";

interface HeroProps {
  onStartCreate: () => void;
}

export default function Hero({ onStartCreate }: HeroProps) {
  return (
    <section className="relative px-6 pt-24 md:pt-32 pb-20 text-center overflow-hidden z-10">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-200/20 rounded-full blur-[120px] -z-10 mix-blend-multiply" />
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[100px] -z-10 mix-blend-multiply" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto relative z-10"
      >
        <div className="mb-10 flex justify-center">
          <NextImage
            src="/logo.png"
            width={72}
            height={72}
            alt="Mymo Logo"
            className="rounded-2xl shadow-lg border border-rose-100"
          />
        </div>

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md text-rose-800 px-5 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8 border border-rose-100/50 shadow-sm"
        >
          <Sparkles size={14} className="text-rose-500" />
          <span>O Presente Digital Perfeito</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-stone-900 leading-[1.05] mb-8 tracking-tight text-balance">
          Transforme sentimentos em <br />
          <span className="bg-gradient-to-r from-rose-500 via-rose-600 to-orange-400 bg-clip-text text-transparent italic pr-2">
            memórias eternas.
          </span>
        </h1>

        <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light text-balance px-4">
          Crie uma página web exclusiva para quem você ama. <strong className="font-medium text-stone-800">Fotos, música e sua história</strong> em um presente que dura para sempre.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <motion.button
                onClick={onStartCreate}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(225, 29, 72, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-rose-600 text-white w-full md:w-auto px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-rose-500/20 flex items-center justify-center gap-3 transition-all hover:brightness-110 active:brightness-90 relative overflow-hidden group"
            >
                <span className="relative z-10 flex items-center gap-2">Criar meu Mymo <Plus size={20} strokeWidth={3} /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <button
                onClick={() => document.getElementById("preview-section")?.scrollIntoView({ behavior: "smooth" })}
                className="text-stone-400 hover:text-rose-500 font-bold text-xs uppercase tracking-widest px-6 py-4 flex items-center gap-2 transition-colors"
            >
                Ver exemplo <ArrowRight size={14} />
            </button>
        </div>
      </motion.div>
    </section>
  );
}
