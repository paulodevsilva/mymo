"use client";

import { checkoutAction } from "../actions/checkout";

import { AnimatePresence, motion } from "framer-motion";
import {
    Calendar,
    Camera,
    ChevronRight,
    Copy,
    Heart,
    Loader2,
    Plus,
    Send,
    Sparkles,
    X,
    Youtube,
} from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function GiftForm() {
  const router = useRouter();

  // Estados
  const [plan, setPlan] = useState<"simple" | "premium">("simple");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"form" | "selection">("form");
  const [pixData, setPixData] = useState<{
    image: string;
    code: string;
    giftId: string;
    abcId: string;
  } | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  const maxPhotos = plan === "premium" ? 3 : 1;

  const handleCloseAndReset = () => {
    setImages([]);
    setCustomerEmail("");
    setCoupleName("");
    setStartDate("");
    setMessage("");
    setYoutubeUrl("");
    setPaymentStep("form");
    setPixData(null);
    setShowModal(false);
    setGeneratedUrl("");
    setPlan("simple");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pixData?.giftId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/gift/status?id=${pixData.giftId}`);
          const data = await res.json();
          if (data.isPaid) {
            clearInterval(interval);
            setPixData(null);
            setGeneratedUrl(`${window.location.origin}/v/${pixData.giftId}`);
            setShowModal(true);
          }
        } catch (err) {
          console.error("Erro no polling");
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [pixData]);


  const processPayment = async (method: "pix" | "card") => {
    setIsSubmitting(true);
    try {
      const result = await checkoutAction({
        method,
        plan,
        coupleName,
        startDate,
        message,
        youtubeUrl,
        imageUrl: images,
        customerEmail,
      });

      if (!result.success) {
        alert(result.error || "Erro ao processar");
        return;
      }

      if (method === "pix" && result.pixImage && result.pixCode && result.giftId && result.abcId) {
        setPixData({
          image: result.pixImage,
          code: result.pixCode,
          giftId: result.giftId,
          abcId: result.abcId,
        });
      } else if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      alert("Erro ao processar pagamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] border border-rose-100 shadow-[0_30px_60px_rgba(255,182,193,0.3)] overflow-hidden"
      >
        <div className="p-6 sm:p-10">
          <div className="flex justify-center mb-8">
            <NextImage
              src="/logo.png"
              width={60}
              height={60}
              alt="Mymo Logo"
              className="rounded-xl shadow-md border border-rose-50"
            />
          </div>
         {/* Seletor de Plano */}
          <div className="max-w-[260px] mx-auto mb-10 p-1.5 bg-rose-50 border border-rose-100 rounded-2xl flex relative shadow-inner">
            <motion.div
              className="absolute top-1.5 bottom-1.5 bg-rose-500 rounded-xl z-0"
              initial={false}
              animate={{ x: plan === "simple" ? 0 : "100%", width: "50%" }}
            />
            <button
              onClick={() => setPlan("simple")}
              className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest z-10 transition-colors ${plan === "simple" ? "text-white" : "text-rose-300"}`}
            >
              Simples
            </button>
            <button
              onClick={() => setPlan("premium")}
              className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest z-10 transition-colors ${plan === "premium" ? "text-white" : "text-rose-300"}`}
            >
              Premium
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPaymentStep("selection");
            }}
            className="space-y-6"
          >
            {/* Fotos */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Camera size={14} className="text-rose-400" /> Fotos{" "}
                {images.length}/{maxPhotos}
              </label>
              <div
                className={`grid gap-4 ${plan === "premium" ? "grid-cols-3" : "grid-cols-1"}`}
              >
                <AnimatePresence>
                  {images.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative p-1.5 bg-white border border-rose-100 shadow-md rounded-sm rotate-1 aspect-square"
                    >
                      <NextImage
                        src={img}
                        fill
                        className="object-cover"
                        alt="Couple photo"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="absolute -top-3 -right-3 bg-rose-600 text-white rounded-full p-2 shadow-lg z-20"
                      >
                        <X size={12} strokeWidth={3} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {images.length < maxPhotos && (
                  <motion.label
                    whileTap={{ scale: 0.95 }}
                    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-rose-200 rounded-2xl text-rose-300 cursor-pointer bg-rose-50/30 active:bg-rose-100 transition-colors"
                  >
                    <Plus size={28} />
                    <span className="text-[9px] font-bold mt-1 uppercase">
                      Adicionar
                    </span>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setImages((prev) => [
                              ...prev,
                              reader.result as string,
                            ]);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </motion.label>
                )}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Seu E-mail
                </label>
                <input
                  required
                  type="email"
                  inputMode="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all text-[16px] text-stone-700 shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Este Mymo é para quem?
                </label>
                <input
                  required
                  type="text"
                  value={coupleName}
                  onChange={(e) => setCoupleName(e.target.value)}
                  placeholder="Ex: Lucas & Ana"
                  className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all text-[16px] text-stone-700 shadow-sm"
                />
              </div>

              {/* Data Especial - Otimizado para iPhone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Data Especial
                </label>
                <div className="relative flex items-center bg-white border border-stone-200 rounded-2xl shadow-sm focus-within:border-rose-400 transition-all overflow-hidden">
                  <Calendar
                    size={18}
                    className="absolute left-4 text-stone-400 pointer-events-none"
                  />
                  <input
                    required
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent pl-12 pr-5 py-4 outline-none text-[16px] text-stone-700 min-h-[58px] appearance-none"
                    style={{ WebkitAppearance: "none" }}
                  />
                </div>
                <p className="text-[9px] text-stone-300 mt-1 ml-1">Quando essa história começou?</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Sua Mensagem
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Sua mensagem especial para este Mymo..."
                  rows={4}
                  className="w-full bg-[#FFFDF0] border-2 border-amber-100 rounded-[2rem] p-6 outline-none focus:border-amber-300 italic font-serif text-stone-800 text-[17px] shadow-inner resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Música (YouTube)
                </label>
                <div className="relative flex items-center bg-white border border-stone-200 rounded-2xl shadow-sm focus-within:border-rose-400 transition-all">
                  <Youtube
                    size={18}
                    className="absolute left-4 text-rose-400 pointer-events-none"
                  />
                  <input
                    type="url"
                    inputMode="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-transparent pl-12 pr-5 py-4 outline-none text-[16px] text-stone-700"
                  />
                </div>
              </div>
            </div>

            {/* Ação Principal */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-rose-500 text-white py-4 rounded-[2rem] font-bold shadow-[0_10px_25px_-5px_rgba(244,63,94,0.4)] hover:bg-rose-600 transition-all"
            >
              <div className="flex flex-col items-center justify-center leading-tight">
                <span className="text-sm uppercase tracking-widest flex items-center gap-2">
                  Criar um Mymo <Sparkles size={16} />
                </span>
                <span className="text-[11px] opacity-90 font-medium mt-0.5">
                  {plan === "premium" ? "Apenas R$ 19,99" : "Apenas R$ 9,99"}
                </span>
              </div>
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Modal Pagamento */}
      <AnimatePresence>
        {paymentStep === "selection" && !pixData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl border border-rose-100"
            >
              <h2 className="text-2xl font-serif italic mb-6 text-center text-stone-800">
                Pagamento
              </h2>
              <div className="space-y-4">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => processPayment("pix")}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between p-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl group active:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-sm">
                      <Send size={22} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-emerald-900 uppercase">
                        Pagar R$ {plan === "premium" ? "19,99" : "9,99"}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
                        Via Pix • Aprovação em 2s
                      </p>
                    </div>
                  </div>
                  {isSubmitting ? (
                    <Loader2 className="animate-spin text-emerald-500" />
                  ) : (
                    <ChevronRight size={20} className="text-emerald-300" />
                  )}
                </motion.button>
                <button
                  onClick={() => setPaymentStep("form")}
                  className="w-full text-[10px] text-stone-300 font-black uppercase tracking-[0.2em] py-4"
                >
                  ← Voltar e Editar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Pix */}
      <AnimatePresence>
        {pixData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-6 text-center border border-rose-100 shadow-2xl"
            >
              <h2 className="text-2xl font-serif italic mb-1 text-stone-800">
                Quase lá!
              </h2>
              <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest mb-6">
                Pague para liberar o link
              </p>
              <div className="bg-rose-50 p-6 rounded-[2.5rem] border border-rose-100 mb-6 shadow-inner flex justify-center">
                <img
                  src={pixData.image}
                  alt="Pix QR Code"
                  className="w-full max-w-[200px] aspect-square rounded-xl shadow-md"
                />
              </div>
              <div className="space-y-3 px-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(pixData.code);
                    alert("Código copiado!");
                  }}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg"
                >
                  <Copy size={20} /> Copiar Código Pix
                </motion.button>
                <button
                  onClick={() => setPixData(null)}
                  className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-2 block w-full py-2 hover:text-rose-500 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Sucesso Final */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAndReset}
            className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-[3rem] p-6 text-center relative shadow-2xl cursor-default"
            >
              <button
                onClick={handleCloseAndReset}
                className="absolute top-6 right-6 p-2 text-stone-300 hover:text-rose-500 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="bg-white p-6 border border-rose-50 rounded-[2.5rem] mb-4 mt-4">
                <Heart
                  className="text-rose-500 mx-auto mb-3"
                  fill="currentColor"
                  size={32}
                />
                <h3 className="font-serif italic text-2xl mb-4 text-stone-800">
                  Seu Mymo está pronto!
                </h3>
                <div className="bg-[#FFFDF0] p-6 rounded-[2.5rem] border-2 border-amber-100 shadow-inner inline-block">
                  <QRCodeSVG
                    value={generatedUrl}
                    size={160}
                    fgColor="#E11D48"
                    bgColor="transparent"
                  />
                </div>
                <p className="mt-4 font-serif italic text-stone-400 uppercase text-[11px] tracking-widest">
                  {coupleName}
                </p>
              </div>

              <div className="space-y-3 px-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(generatedUrl, "_blank")}
                  className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-rose-600 transition-all"
                >
                  <Send size={20} /> Abrir meu Mymo
                </motion.button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedUrl);
                    alert("Link copiado!");
                  }}
                  className="w-full bg-stone-50 text-stone-500 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-stone-100"
                >
                  Copiar Link
                </button>
                <button
                  onClick={handleCloseAndReset}
                  className="w-full text-[10px] text-rose-400 font-black uppercase tracking-widest pt-2 hover:text-rose-600 transition-colors"
                >
                  + Criar novo Mymo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
