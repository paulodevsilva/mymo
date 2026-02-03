"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Music, Smartphone, Sparkles, Volume2 } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { FloatingEmojis } from "./FloatingEmojis";

export default function LivePreview() {
  const [activePlan, setActivePlan] = useState<"simple" | "premium">("premium");

  // Mock Data
  const photoSimple = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop";
  const photosPremium = [
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop", // Couple hugging
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop", // Hands
    "https://images.unsplash.com/photo-1621112904887-419379ce6824?q=80&w=600&auto=format&fit=crop"  // Laughing
  ];

  return (
    <section id="preview-section" className="py-20 md:py-32 bg-stone-50 relative overflow-hidden">
        {/* Background Decorative */}
       <div className="absolute inset-0 bg-[radial-gradient(#e11d48_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03]" />

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Content (Text + Toggle) */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest mb-4 bg-rose-100/50 px-3 py-1 rounded-full border border-rose-100"
            >
                <Smartphone size={14} /> Veja como fica
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">
                Um site inteiro <br/> dedicado a vocês.
            </h2>
            <p className="text-stone-500 text-lg mb-10 font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                Seus momentos favoritos transformados em uma experiência digital imersiva. Escolha o plano que melhor conta a sua história.
            </p>

            {/* Toggle Switch */}
            <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-sm border border-stone-200 mb-10 relative">
                <button
                    onClick={() => setActivePlan("simple")}
                    className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-colors ${activePlan === "simple" ? "text-stone-800" : "text-stone-400 hover:text-stone-600"}`}
                >
                    Simples
                </button>
                <button
                     onClick={() => setActivePlan("premium")}
                    className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-colors ${activePlan === "premium" ? "text-rose-900" : "text-stone-400 hover:text-stone-600"}`}
                >
                    Premium
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full shadow-sm animate-bounce">
                        Uau!
                    </span>
                </button>

                {/* Sliding Background */}
                <motion.div
                    className={`absolute top-1.5 bottom-1.5 rounded-xl shadow-md ${activePlan === "simple" ? "bg-stone-100" : "bg-rose-100"}`}
                    initial={false}
                    animate={{
                        x: activePlan === "simple" ? 0 : "100%",
                        width: "50%"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            </div>

            {/* Feature List based on selection */}
            <div className="space-y-4 text-left max-w-sm mx-auto lg:mx-0 min-h-[140px]">
                <AnimatePresence mode="wait">
                    {activePlan === "simple" ? (
                        <motion.ul
                            key="simple-features"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                             <li className="flex items-center gap-3 text-stone-600">
                                <span className="bg-stone-200 p-1 rounded-full"><Heart size={12} className="text-stone-500"/></span>
                                1 Foto Especial
                            </li>
                             <li className="flex items-center gap-3 text-stone-600">
                                <span className="bg-stone-200 p-1 rounded-full"><Music size={12} className="text-stone-500"/></span>
                                Música de Fundo (YouTube)
                            </li>
                        </motion.ul>
                    ) : (
                        <motion.ul
                            key="premium-features"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            <li className="flex items-center gap-3 text-rose-900 font-medium">
                                <span className="bg-rose-100 p-1 rounded-full"><Sparkles size={12} className="text-rose-500"/></span>
                                Galeria de 3 Fotos (Slideshow)
                            </li>
                            <li className="flex items-center gap-3 text-rose-900 font-medium">
                                <span className="bg-rose-100 p-1 rounded-full"><Sparkles size={12} className="text-rose-500"/></span>
                                Personalização de Cores e Emojis
                            </li>
                            <li className="flex items-center gap-3 text-rose-900 font-medium">
                                <span className="bg-rose-100 p-1 rounded-full"><Music size={12} className="text-rose-500"/></span>
                                Música de Fundo + Efeitos
                            </li>
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Right Content (PHONE MOCKUP) */}
        <div className="order-1 lg:order-2 flex justify-center perspective-1000">
            <motion.div
               animate={{
                   rotateY: activePlan === "premium" ? -5 : 0,
                   scale: activePlan === "premium" ? 1.05 : 1
               }}
               transition={{ type: "spring", stiffness: 100, damping: 20 }}
               className="relative w-[300px] h-[600px] bg-white rounded-[3rem] border-8 border-stone-900 shadow-2xl overflow-hidden ring-1 ring-stone-900/5"
            >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-900 rounded-b-2xl z-20" />

                {/* Screen Content */}
                <div className="w-full h-full relative flex flex-col bg-stone-50">

                    {/* Floating Emojis for Premium */}
                    {activePlan === "premium" && (
                        <FloatingEmojis />
                    )}

                    <div className="h-20 flex items-end justify-between px-6 pb-2 z-10">
                         <Sparkles size={16} className="text-rose-400" />
                         <div className="p-2 rounded-full bg-rose-100 text-rose-600">
                            <Volume2 size={14} />
                         </div>
                    </div>

                    {/* Photo Area */}
                    <div className="px-5 mt-2 relative z-0">
                         <div className="aspect-square bg-stone-200 rounded-2xl relative overflow-hidden shadow-md rotate-1 border-4 border-white">
                             <AnimatePresence mode="wait">
                                {activePlan === "simple" ? (
                                    <motion.div key="simple-img" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0">
                                         <NextImage src={photoSimple} fill className="object-cover" alt="Example" />
                                    </motion.div>
                                ) : (
                                    <SlideshowPreview images={photosPremium} />
                                )}
                             </AnimatePresence>

                             {/* Premium Badge on Phone */}
                             {activePlan === "premium" && (
                                 <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] font-black text-rose-600 shadow-sm"
                                 >
                                     PREMIUM
                                 </motion.div>
                             )}
                         </div>
                         <div className="text-center mt-3">
                             <h3 className="font-serif italic text-lg text-rose-600">
                                 Ana & Lucas
                             </h3>
                         </div>
                    </div>

                    {/* Counter Mock */}
                    <div className="px-5 mt-4">
                        <div className="flex gap-1 justify-between">
                            {[1].map((_, i) => (
                                <div key={i} className="flex-1 bg-white/50 border border-stone-100 rounded-lg py-2 text-center">
                                    <div className="text-xs font-black text-rose-500">1.025</div>
                                    <div className="text-[6px] uppercase text-stone-300">Dias</div>
                                </div>
                            ))}
                            <div className="flex-1 bg-white/50 border border-stone-100 rounded-lg py-2 text-center opacity-50"><div className="text-xs font-black text-stone-300">...</div></div>
                            <div className="flex-1 bg-white/50 border border-stone-100 rounded-lg py-2 text-center opacity-50"><div className="text-xs font-black text-stone-300">...</div></div>
                            <div className="flex-1 bg-white/50 border border-stone-100 rounded-lg py-2 text-center opacity-50"><div className="text-xs font-black text-stone-300">...</div></div>
                        </div>
                    </div>

                    {/* Message Area */}
                    <div className="px-5 mt-4 flex-1 pb-8">
                        <div className="relative h-full w-full rounded-2xl p-4 overflow-hidden border bg-amber-50/50 border-amber-100">
                            <p className="text-[10px] text-stone-500 leading-relaxed font-serif italic text-center">
                                "Não importa quanto tempo passe, cada segundo ao seu lado é o meu melhor presente..."
                            </p>
                        </div>
                    </div>

                </div>
            </motion.div>

            {/* Background Circle behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[80px] -z-10 transition-colors duration-700 bg-rose-200/40" />
        </div>

      </div>
    </section>
  );
}

function SlideshowPreview({ images }: { images: string[] }) {
    const [index, setIndex] = useState(0);

    // Auto rotate
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full h-full">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <NextImage src={images[index]} fill className="object-cover" alt="Slide" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
