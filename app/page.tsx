"use client";

import MusicSegmentSelector from "@/components/MusicSegmentSelector";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import LivePreview from "@/components/landing/LivePreview";
import Pricing from "@/components/landing/Pricing";
import { AnimatePresence, motion } from "framer-motion";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    Heart,
    Loader2,
    Music,
    Palette,
    Plus,
    Send,
    Smile,
    X,
    Youtube
} from "lucide-react";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { checkoutAction } from "./actions/checkout";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function LovePageApp() {
  // Controle de Interface
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Dados do Presente
  const [plan, setPlan] = useState<"simple" | "premium">("simple");
  const [images, setImages] = useState<string[]>([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");

  // Personalização Premium (Novos campos)
  const [customEmoji, setCustomEmoji] = useState("❤️");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [textColor, setTextColor] = useState("#E11D48");

  // Música (YouTube Search)
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [musicSearch, setMusicSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<{
    title: string;
    id: string;
  } | null>(null);
  const [musicStartTime, setMusicStartTime] = useState(0);
  const [musicEndTime, setMusicEndTime] = useState(0);

  // Pagamento e Status
  const [paymentStep, setPaymentStep] = useState<"form" | "selection">("form");
  const [pixData, setPixData] = useState<{
    image: string;
    code: string;
    giftId: string;
    abcId: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const maxPhotos = plan === "premium" ? 3 : 1;
  const totalSteps = 3;

  // Busca YouTube com Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (musicSearch.length >= 3) {
        performSearch(musicSearch);
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [musicSearch]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/youtube/search?q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Erro na busca");
    } finally {
      setIsSearching(false);
    }
  };

  const handleMusicSearch = (query: string) => {
    setMusicSearch(query);
  };

  const handleCloseAndReset = () => {
    setIsFormOpen(false);
    setCurrentStep(1);
    setImages([]);
    setCustomerEmail("");
    setCoupleName("");
    setStartDate("");
    setMessage("");
    setYoutubeUrl("");
    setSelectedMusic(null);
    setMusicSearch("");
    setMusicStartTime(0);
    setMusicEndTime(0);
    setPaymentStep("form");
    setPixData(null);
    setShowSuccessModal(false);
    setCustomEmoji("❤️");
    setTextColor("#E11D48");
  };

  // Polling do Pagamento
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pixData?.giftId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/gift?id=${pixData.giftId}`);
          const data = await res.json();
          if (data.isPaid) {
            clearInterval(interval);
            setPixData(null);
            setGeneratedUrl(`${window.location.origin}/v/${pixData.giftId}`);
            setShowSuccessModal(true);
          }
        } catch (e) {
          console.error(e);
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
        customEmoji: plan === "premium" ? customEmoji : "❤️",
        textColor: plan === "premium" ? textColor : "#E11D48",
        musicStartTime,
        musicEndTime,
      });

      if (!result.success) {
        alert(result.error || "Erro ao processar");
        return;
      }

      if (method === "card" && result.url) {
        window.location.href = result.url;
        return;
      }

      if (result.pixImage && result.pixCode && result.giftId && result.abcId) {
        setPixData({
          image: result.pixImage,
          code: result.pixCode,
          giftId: result.giftId,
          abcId: result.abcId,
        });
      }
   } catch (error) {
      alert("Erro ao processar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-stone-900 font-sans selection:bg-rose-200">
      <Hero onStartCreate={() => setIsFormOpen(true)} />
      <Features />
      <LivePreview />
      <Pricing onSelectPlan={(p) => { setPlan(p); setIsFormOpen(true); }} />
      <HowItWorks />

      {/* Footer minimalista */}
      <footer className="bg-[#FDFCF8] border-t border-stone-100 py-12 text-center">
      </footer>

      {/* --- Modal Multi-Step --- */}
      <AnimatePresence mode="wait">
        {isFormOpen && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
          >
            <motion.div
              key="modal-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden z-10">
                <motion.div
                  className="h-full bg-rose-500"
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>

              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 p-2 text-stone-300 hover:text-rose-500 z-[110] transition-colors"
              >
                <X size={24} />
              </button>

              <div className="p-4 pt-10 md:p-8 md:pt-12 overflow-y-auto flex-1">
                <header className="text-center mb-6 md:mb-8">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.3em]">
                    Passo {currentStep} de {totalSteps}
                  </span>
                  <h2 className="text-3xl font-serif text-stone-900 mt-2">
                    {currentStep === 1 && "Seu Mymo"}
                    {currentStep === 2 && "A História"}
                    {currentStep === 3 && "Personalizar"}
                  </h2>
                </header>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    currentStep === totalSteps
                      ? setPaymentStep("selection")
                      : setCurrentStep((s) => s + 1);
                  }}
                  className="space-y-5"
                >
                  <AnimatePresence mode="wait">
                    {/* ETAPA 1: O CASAL E PLANOS */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        className="space-y-4"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                            Seu E-mail
                          </label>
                          <input
                            required
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="voce@email.com"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-200 transition-all font-medium text-base"
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
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-200 transition-all font-medium text-base"
                          />
                        </div>

                        <div className="bg-rose-50/50 p-4 rounded-[2rem] border border-rose-100">
                          <p className="text-[9px] text-rose-600 font-bold uppercase mb-4 text-center tracking-widest">
                            Selecione o Plano
                          </p>
                          <div className="flex gap-3">
                            <button
                              key="btn-simple"
                              type="button"
                              onClick={() => setPlan("simple")}
                              className={`flex-1 py-3 px-2 rounded-2xl transition-all border ${plan === "simple" ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200" : "bg-white border-stone-100 text-stone-400 hover:border-rose-200"}`}
                            >
                              <p className="text-[10px] font-black uppercase">
                                Simples
                              </p>
                              <p
                                className={`text-xl font-serif mt-1 ${plan === "simple" ? "text-white" : "text-rose-500"}`}
                              >
                                R$ 9,90
                              </p>
                            </button>
                            <button
                              key="btn-premium"
                              type="button"
                              onClick={() => setPlan("premium")}
                              className={`flex-1 py-3 px-2 rounded-2xl transition-all border ${plan === "premium" ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200" : "bg-white border-stone-100 text-stone-400 hover:border-rose-200"}`}
                            >
                              <p className="text-[10px] font-black uppercase">
                                Premium
                              </p>
                              <p
                                className={`text-xl font-serif mt-1 ${plan === "premium" ? "text-white" : "text-rose-500"}`}
                              >
                                R$ 19,90
                              </p>
                            </button>
                          </div>
                          <p className="text-[10px] text-rose-400 text-center mt-3 font-medium">
                            {plan === "simple"
                              ? "1 Foto + Música + QR Code"
                              : "3 Fotos + Música + Personalização + Destaque"}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* ETAPA 2: HISTÓRIA E MÚSICA */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        className="space-y-4"
                      >
                        <div className="relative">
                          <Calendar
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                          />
                          <input
                            required
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-5 py-4 outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-200 transition-all font-medium text-base appearance-none min-h-[56px]"
                          />
                          <p className="text-[9px] text-stone-400 mt-1 ml-1">Quando essa história começou?</p>
                        </div>

                        <div className="relative">
                          {!selectedMusic ? (
                            <div
                              key="music-search-container"
                              className="relative"
                            >
                              <Youtube
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400"
                              />
                              <input
                                type="text"
                                value={musicSearch}
                                onChange={(e) =>
                                  handleMusicSearch(e.target.value)
                                }
                                placeholder="Busque a música..."
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-5 py-4 outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-200 transition-all font-medium text-base"
                              />
                              {isSearching && (
                                <Loader2
                                  size={16}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-rose-400"
                                />
                              )}
                              {searchResults.length > 0 && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-40 overflow-y-auto">
                                  {searchResults.map((v: any, idx: number) => (
                                    <button
                                      key={v.id || `v-${idx}`}
                                      type="button"
                                      onClick={() => {
                                        setSelectedMusic({
                                          title: v.title,
                                          id: v.id,
                                        });
                                        setYoutubeUrl(
                                          `https://youtube.com/watch?v=${v.id}`,
                                        );
                                        setSearchResults([]);
                                      }}
                                      className="w-full flex items-center gap-3 p-3 hover:bg-rose-50 text-left border-b border-stone-50 last:border-0"
                                    >
                                      <NextImage
                                        src={v.thumbnail}
                                        alt=""
                                        width={40}
                                        height={32}
                                        className="object-cover rounded shadow-sm"
                                      />
                                      <p
                                        className="text-[11px] font-bold text-stone-700 truncate"
                                      >
                                        {v.title}
                                      </p>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              key="music-selected-card"
                              className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-2xl"
                            >
                              <div className="flex items-center gap-3 truncate">
                                <Music size={18} className="text-rose-500" />
                                <p className="text-[11px] font-bold text-rose-900 truncate">
                                  {selectedMusic.title}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedMusic(null);
                                  setYoutubeUrl("");
                                }}
                                className="text-red-300 hover:text-red-500 p-1"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          )}
                        </div>

                          {/* Seleção de Trecho da Música */}
                          {selectedMusic && (
                            <MusicSegmentSelector
                              videoId={selectedMusic.id}
                              onStartTimeChange={setMusicStartTime}
                              onEndTimeChange={setMusicEndTime}
                              initialStart={musicStartTime}
                              initialEnd={musicEndTime}
                            />
                          )}
                        <textarea
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Sua mensagem especial para este Mymo..."
                          rows={3}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-200 transition-all font-serif italic text-base"
                        />
                      </motion.div>
                    )}

                    {/* ETAPA 3: FOTOS E PERSONALIZAÇÃO */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">
                            Fotos ({images.length}/{maxPhotos})
                          </p>
                          <div
                            className={`grid gap-3 ${plan === "premium" ? "grid-cols-3" : "grid-cols-1"}`}
                          >
                            {images.map((img, i) => (
                              <div
                                key={`img-container-${i}`}
                                className="relative aspect-square border border-rose-100 p-1 rounded-lg"
                              >
                                <NextImage
                                  src={img}
                                  fill
                                  className="object-cover rounded-md"
                                  alt=""
                                  unoptimized
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setImages((prev) =>
                                      prev.filter((_, idx) => idx !== i),
                                    )
                                  }
                                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                            {images.length < maxPhotos && (
                              <label
                                key="add-photo-btn"
                                className="aspect-square flex items-center justify-center border-2 border-dashed border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 hover:border-rose-200 transition-all"
                              >
                                <Plus size={24} className="text-stone-300 group-hover:text-rose-400" />
                                <input
                                  type="file"
                                  hidden
                                  accept="image/*"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) {
                                      const r = new FileReader();
                                      r.onloadend = () =>
                                        setImages((p) => [
                                          ...p,
                                          r.result as string,
                                        ]);
                                      r.readAsDataURL(f);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </div>

                        {/* EXCLUSIVO PREMIUM: EMOJI E COR */}
                        {plan === "premium" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-stone-50 p-5 rounded-[2rem] border border-stone-100 space-y-4"
                          >
                            <p className="text-[9px] text-stone-500 font-black uppercase tracking-[0.2em] text-center mb-2">
                              Personalização Premium
                            </p>

                            <div className="flex gap-4">
                              {/* Campo de Emoji Customizado */}
                              <div className="flex-1 space-y-2 relative">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase ml-1">
                                  <Smile size={12} /> Emoji
                                </label>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowEmojiPicker(!showEmojiPicker)
                                  }
                                  className="w-full bg-white border border-stone-200 rounded-xl py-3 text-2xl shadow-sm hover:border-red-200 transition-all flex items-center justify-center h-[52px]"
                                >
                                  {customEmoji}
                                </button>

                                {/* Popover do Emoji Picker */}
                                {showEmojiPicker && (
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-[200] mb-4 shadow-2xl rounded-3xl overflow-hidden border border-stone-100">
                                    <EmojiPicker
                                      onEmojiClick={(emojiData) => {
                                        setCustomEmoji(emojiData.emoji);
                                        setShowEmojiPicker(false);
                                      }}
                                      width={280}
                                      height={350}
                                      skinTonesDisabled
                                      searchDisabled
                                      previewConfig={{ showPreview: false }}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Campo de Cor Texto */}
                              <div className="flex-1 space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase ml-1">
                                  <Palette size={12} /> Cor Texto
                                </label>
                                <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 h-[52px] shadow-sm">
                                  <div className="relative w-8 h-8 shrink-0">
                                    <input
                                      type="color"
                                      value={textColor}
                                      onChange={(e) =>
                                        setTextColor(e.target.value)
                                      }
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div
                                      className="w-full h-full rounded-lg border border-black/5"
                                      style={{ backgroundColor: textColor }}
                                    />
                                  </div>
                                  <span className="text-[10px] font-mono text-stone-400 uppercase">
                                    {textColor}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 pt-4">
                    {currentStep > 1 && (
                      <button
                        key="btn-nav-back"
                        type="button"
                        onClick={() => setCurrentStep((s) => s - 1)}
                        className="flex-1 py-4 bg-stone-50 rounded-2xl text-stone-400 flex items-center justify-center transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                    )}
                    <button
                      key="btn-nav-next"
                      type="submit"
                      className="flex-[3] bg-rose-600 text-rose-50 py-4 rounded-2xl font-bold shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                    >
                      {currentStep === totalSteps ? "Pagar e Criar" : "Próximo"}{" "}
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Modais de Pagamento e Sucesso --- */}
      <AnimatePresence>
        {/* Checkout - Seleção de Método */}
        {paymentStep === "selection" && !pixData && (
          <motion.div
            key="modal-checkout-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl text-center"
            >
              <h2 className="text-2xl font-serif text-stone-900 mb-6">Finalizar</h2>
                <button
                  onClick={() => processPayment("pix")}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between p-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl mb-4 group transition-all"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="bg-emerald-500 text-white p-2.5 rounded-xl">
                      <Send size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-emerald-900 uppercase">
                        Pix
                      </p>
                      {/* <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
                        Aprovação Instantânea
                      </p> */}
                    </div>
                  </div>
                  {isSubmitting ? (
                    <Loader2 className="animate-spin text-emerald-500" />
                  ) : (
                    <ChevronRight size={20} className="text-emerald-300" />
                  )}
                </button>

                <button
                  onClick={() => processPayment("card")}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between p-5 bg-indigo-50 border-2 border-indigo-100 rounded-2xl mb-4 group transition-all"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="bg-indigo-500 text-white p-2.5 rounded-xl">
                      <CreditCard size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-indigo-900 uppercase">
                        Cartão de Crédito
                      </p>
                      {/* <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-tighter">
                        Via Stripe
                      </p> */}
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-indigo-300" />
                </button>
              <button
                onClick={() => setPaymentStep("form")}
                className="text-[10px] text-stone-300 font-bold uppercase mt-2"
              >
                ← Voltar
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Checkout - QR Code Pix + Simular */}
        {pixData && (
          <motion.div
            key="modal-pix-qr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-6 text-center shadow-2xl"
            >
              <h2 className="text-2xl font-serif text-stone-900 mb-6">Pague com Pix</h2>
              <div className="bg-rose-50 p-6 rounded-[2.5rem] mb-6 flex justify-center border border-rose-100 shadow-inner">
                <img
                  src={pixData.image}
                  className="w-full max-w-[200px] aspect-square rounded-xl shadow-md"
                  alt="Pix QR Code"
                />
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pixData.code);
                    alert("Copiado!");
                  }}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg text-sm"
                >
                  <Copy size={18} /> Copiar Código
                </button>
              </div>
              <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest animate-pulse mt-6">
                Aguardando confirmação...
              </p>
              <button
                onClick={() => setPixData(null)}
                className="mt-4 text-[10px] text-stone-300 uppercase font-bold tracking-widest"
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Sucesso */}
        {showSuccessModal && (
          <motion.div
            key="modal-success-final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleCloseAndReset}
            className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-[3rem] p-6 text-center shadow-2xl cursor-default"
            >
              <Heart
                className="text-rose-500 mx-auto mb-4"
                fill="currentColor"
                size={40}
              />
              <h3 className="font-serif text-3xl mb-6 text-stone-900">
                Seu Mymo está pronto!
              </h3>
              <div className="bg-[#FFFDF0] p-6 rounded-[2.5rem] border border-stone-200 mb-6 inline-block shadow-lg shadow-stone-100">
                <QRCodeSVG
                  value={generatedUrl}
                  size={160}
                  fgColor="#881337"
                  bgColor="transparent"
                />
              </div>
              <button
                onClick={() => window.open(generatedUrl, "_blank")}
                className="w-full bg-rose-600 text-rose-50 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mb-3 shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all font-serif"
              >
                <Send size={18} /> Abrir meu Mymo
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedUrl);
                  alert("Link Copiado!");
                }}
                className="w-full text-[10px] text-stone-400 font-bold uppercase tracking-widest py-2 border border-stone-100 rounded-xl mt-2"
              >
                Copiar Link
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.4em]">
        © 2026 - Mymo Experience
      </footer>
    </div>
  );
}
