"use client";

import { motion } from "framer-motion";
import { Heart, Music, Sparkles } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 px-6 bg-white relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6">
            O Mymo perfeito para qualquer carinho
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto font-light">
            Para o seu amor, para o melhor amigo ou para a família. Um Mymo transforma memórias em algo que pode ser sentido e compartilhado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Heart size={28} />,
              title: "Sua História",
              desc: "Capture cada detalhe especial. Do primeiro 'oi' aos momentos mais inesquecíveis, tudo do seu jeito.",
              color: "bg-rose-50 text-rose-500",
            },
            {
              icon: <Music size={28} />,
              title: "Trilha Sonora",
              desc: "A música favorita de vocês começa a tocar assim que o Mymo é aberto. Emoção em cada nota.",
              color: "bg-orange-50 text-orange-500",
            },
            {
              icon: <Sparkles size={28} />,
              title: "QR Code Exclusivo",
              desc: "Gere um link único e QR Code para imprimir ou enviar. Um portal para as suas melhores memórias.",
              color: "bg-amber-50 text-amber-500",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="group p-10 rounded-[2.5rem] bg-stone-50/50 border border-stone-100/80 text-center hover:bg-white hover:border-rose-100 hover:shadow-xl hover:shadow-rose-100/30 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3 className="font-serif text-2xl text-stone-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-stone-500 leading-relaxed font-light">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
