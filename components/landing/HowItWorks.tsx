"use client";

import { motion } from "framer-motion";
import { Palette, Send } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function HowItWorks() {
  return (
    <section className="py-32 px-6 bg-white border-t border-stone-100 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-[500px] bg-rose-50/40 -skew-y-3 -z-10" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6">
            Como funciona
          </h2>
          <p className="text-stone-500 text-lg font-light">
            Dois minutos para criar uma memória eterna.
          </p>
        </div>

        <div className="relative">
          {/* Linha do tempo central desktop */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 via-rose-300 to-rose-200 hidden md:block -translate-x-1/2" />

          {[
            {
              id: 1,
              title: "Personalize",
              desc: "Dê vida ao seu Mymo com nomes, datas e fotos em minutos.",
              icon: <Palette size={20} />,
            },
            {
              id: 2,
              title: "Envio Instantâneo",
              desc: "Aprovação rápida via Pix para o seu Mymo ficar pronto na hora.",
              icon: <Send size={20} />,
            },
            {
              id: 3,
              title: "Compartilhe o Link",
              desc: "Envie o link único ou QR Code para quem você ama abrir seu Mymo.",
              icon: <QRCodeSVG value="" size={20} />,
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className={`relative flex flex-col md:flex-row items-center gap-8 mb-20 last:mb-0 ${i % 2 === 0 ? "md:text-right md:justify-end" : "md:text-left md:justify-start"}`}
            >
              {/* Conteúdo desktop: alterna lados */}
              <div
                className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left md:order-last"} pl-16 md:pl-0 text-left w-full`}
              >
                <div className="inline-block p-3 rounded-2xl bg-white border border-rose-100 shadow-sm mb-4 text-rose-500">
                  {step.icon}
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-stone-500 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>

              {/* Bolinha Central */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-rose-100 flex items-center justify-center text-rose-400 font-bold shadow-lg z-10 group transition-all duration-500 hover:scale-110 hover:border-rose-300 hover:text-rose-600">
                {i + 1}
              </div>

              {/* Espaço vazio para manter alinhamento no grid */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
