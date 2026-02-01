"use client";

import { getYouTubeID } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    Calendar,
    CreditCard,
    Gift,
    Heart,
    Loader2,
    Plus,
    Sparkles,
    Volume2
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";

// --- CHUVA DE EMOJIS DINÂMICA ---
const EmojiRain = ({ emoji }: { emoji: string }) => {
  const emojis = useMemo(
    () =>
      [...Array(30)].map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}vw`,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 10,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {emojis.map((e: { id: number; x: string; duration: number; delay: number }) => (
        <motion.div
          key={e.id}
          initial={{ y: -50, x: e.x, opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 180 }}
          transition={{
            duration: e.duration,
            repeat: Infinity,
            delay: e.delay,
          }}
          className="absolute text-2xl"
          style={{ filter: "drop-shadow(0 0 5px rgba(0,0,0,0.1))" }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

// --- SLIDESHOW EFEITO PÁGINA ---
const PhotoSlideshow = ({
  images,
  emoji,
}: {
  images: string[];
  emoji: string;
}) => {
  const [index, setIndex] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setIndex((prevIndex) => {
        let nextIndex = prevIndex + newDirection;
        if (nextIndex < 0) nextIndex = images.length - 1;
        if (nextIndex >= images.length) nextIndex = 0;
        return nextIndex;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, paginate]);

  return (
    <div className="relative aspect-square overflow-hidden rounded-sm bg-gray-200 shadow-inner touch-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={index}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(e, { offset }) => {
            const swipe = offset.x;
            if (swipe < -50) paginate(1);
            else if (swipe > 50) paginate(-1);
          }}
          initial={{ x: 300, rotate: 10, opacity: 0 }}
          animate={{ x: 0, rotate: 0, opacity: 1 }}
          exit={{ x: -500, rotate: -20, opacity: 0, scale: 1.1 }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        >
          <NextImage
            src={images[index]}
            fill
            className="object-cover border-[8px] border-white shadow-xl"
            alt={`Memória ${index + 1}`}
            draggable={false}
            sizes="(max-width: 768px) 100vw, 400px"
            priority={index === 0}
          />
          {/* Badge de Memória usa o emoji customizado */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1">
            {emoji} {index + 1}/{images.length}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- CONTADOR COM COR DINÂMICA ---
const LoveCounter = ({
  startDate,
  color,
}: {
  startDate: string;
  color: string;
}) => {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(startDate).getTime();
      const diff = new Date().getTime() - start;
      if (diff < 0) return;
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="grid grid-cols-4 gap-2 my-4 px-1">
      {[
        { label: "Dias", val: time.days },
        { label: "Hrs", val: time.hours },
        { label: "Min", val: time.mins },
        { label: "Seg", val: time.secs },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white/60 backdrop-blur-sm py-2 rounded-xl border border-gray-100 text-center shadow-sm"
        >
          <div
            className="text-lg font-black leading-none"
            style={{ color: color }}
          >
            {item.val}
          </div>
          <div className="text-[8px] uppercase font-bold tracking-tighter text-gray-400 mt-0.5">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function PersonalizedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/gift?id=${id}`);
        const json = await res.json();
        setData(json);

        // Se ainda não estiver pago, continua tentando a cada 5 segundos
        if (json.isPaid === false) {
          setTimeout(fetchData, 5000);
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    fetchData();
  }, [id]);

  // Carregar YouTube API
  useEffect(() => {
    if (!data?.youtubeUrl) return;

    const loadYoutubeAPI = () => {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    };

    if (!(window as any).YT) {
      loadYoutubeAPI();
    } else if (player === null) {
      initializePlayer();
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };
  }, [data]);

  const [isMobileSafari, setIsMobileSafari] = useState(false);

  useEffect(() => {
    // Detecção básica de Mobile Safari (iOS + Safari)
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isSafari = /^((?!Chrome|Android).)*Safari/.test(ua);
    const isMobileSafariDetected = isIOS && isSafari;

    setIsMobileSafari(isMobileSafariDetected);
  }, []);

  const initializePlayer = () => {
    const youtubeId = getYouTubeID(data?.youtubeUrl || "");
    if (!youtubeId || player) return;

    // Autoplay habilitado se não for Mobile Safari
    const shouldAutoplay = !isMobileSafari ? 1 : 0;

    const newPlayer = new (window as any).YT.Player("youtube-player-hidden", {
      height: "0",
      width: "0",
      videoId: youtubeId,
      playerVars: {
        autoplay: shouldAutoplay,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        playsinline: 1,
        start: data.musicStartTime || 0,
        end: data.musicEndTime,
        loop: 1,
        playlist: youtubeId,
      },
      events: {
        onReady: (event: any) => {
          setPlayer(event.target);
          // Tenta tocar automaticamente se não for Safari Mobile
          if (!isMobileSafari) {
             // Alguns browsers bloqueiam áudio automático, tentar com mute se necessário
             // Mas aqui tentaremos direto pra experiência imersiva
             event.target.playVideo();
          }
        },
        onStateChange: (event: any) => {
          if (event.data === (window as any).YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
          if (event.data === (window as any).YT.PlayerState.ENDED) {
             event.target.seekTo(data.musicStartTime || 0);
             event.target.playVideo();
          }
        },
      },
    });
  };

  const handleStartInteraction = () => {
    setHasStarted(true);
    // User requested NOT to play on open.
    // Playback will be handled by the global touch listener on next interaction.
  };

  // Fallback: Qualquer toque na tela tenta dar play se deveria estar tocando
  useEffect(() => {
    if (!hasStarted) return;

    const tryPlay = () => {
      // Se já está tocando, não faz nada
      if (isPlaying) return;

      if (player && typeof player.playVideo === "function") {
        player.playVideo();
      }
    };

    window.addEventListener("touchstart", tryPlay);
    window.addEventListener("click", tryPlay);

    return () => {
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("click", tryPlay);
    };
  }, [hasStarted, player, isPlaying]);


  if (!data)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FFFBFB]">
        <Heart className="text-red-200 animate-pulse" size={40} />
      </div>
    );

  // --- TELA DE AGUARDANDO PAGAMENTO ---
  if (data.isPaid === false) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FFFBFB] px-8 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-rose-200 blur-2xl opacity-20 animate-pulse rounded-full" />
          <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center relative border border-rose-50">
            <CreditCard className="text-rose-400 animate-bounce" size={40} />
          </div>
        </div>

        <h2 className="text-3xl font-serif text-rose-950 mb-4 tracking-tight">
          Seu Mymo está sendo preparado
        </h2>

        <p className="text-stone-500 font-light leading-relaxed max-w-xs mb-8">
          O Mymo de <span className="font-bold text-rose-600">{data.coupleName}</span> está quase pronto. Assim que o pagamento for confirmado, esta experiência será liberada automaticamente.
        </p>

        <div className="flex items-center gap-3 bg-stone-50 px-6 py-3 rounded-full border border-stone-100 shadow-sm">
          <Loader2 className="animate-spin text-rose-500" size={16} />
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            Verificando status...
          </span>
        </div>
      </div>
    );
  }

  const photoList = Array.isArray(data.imageUrl)
    ? data.imageUrl
    : [data.imageUrl || ""];

  // Variáveis Premium
  const customEmoji = data.customEmoji || "❤️";
  const themeColor = data.textColor || "#E11D48";

  return (
    <main className="min-h-screen bg-[#FFFBFB] overflow-x-hidden font-sans relative pb-10">

      {/* Player escondido sempre presente para carregar API antes */}
      <div id="youtube-player-hidden" className="fixed opacity-0 pointer-events-none" />

      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            key="overlay"
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white px-6"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStartInteraction}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-colors"
                style={{
                  backgroundColor: themeColor,
                  boxShadow: `0 10px 25px ${themeColor}33`,
                }}
              >
                <Gift className="text-white" size={32} />
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] mb-1">
                  Para: {data.coupleName?.split("&")[1] || "Você"}
                </p>
                <p
                  className="font-serif italic text-2xl"
                  style={{ color: themeColor }}
                >
                  Abrir meu Mymo
                </p>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {hasStarted && (
        <div className="flex flex-col min-h-screen max-w-md mx-auto px-5 relative">
          <EmojiRain emoji={customEmoji} />

          <header className="h-14 flex items-center justify-between z-40">
            <Sparkles style={{ color: `${themeColor}66` }} size={18} />
            <button
              onClick={() => {
                if (player) {
                   isPlaying ? player.pauseVideo() : player.playVideo();
                }
              }}
              className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-gray-50 active:scale-95 transition-transform"
              style={{ color: themeColor }}
            >
              {/* Sempre mostra ícone de som, apenas muda opacidade se pausado */}
              <Volume2 size={16} className={isPlaying ? "opacity-100" : "opacity-50"} />
            </button>
          </header>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-2.5 pb-6 shadow-lg border border-gray-50 rounded-sm rotate-[-1deg] mx-4 relative"
          >
            <PhotoSlideshow images={photoList} emoji={customEmoji} />
            <h1
              className="text-xl font-serif italic text-center mt-3 break-words px-2"
              style={{ color: themeColor }}
            >
              {data.coupleName}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 px-2"
          >
            <div
              className="flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] mb-1"
              style={{ color: themeColor }}
            >
              <Calendar size={10} /> Nossa História
            </div>
            <LoveCounter startDate={data.startDate} color={themeColor} />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 relative px-1"
          >
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 px-4 py-0.5 rounded-full shadow-sm border text-[9px] font-black uppercase tracking-widest whitespace-nowrap bg-white"
              style={{ borderColor: `${themeColor}33`, color: themeColor }}
            >
              Especialmente para você abrir seu Mymo
            </div>

            <div className="relative bg-[#FEF9E7] rounded-[2rem] shadow-sm border border-amber-100 overflow-hidden min-h-[200px]">
              <div className="relative z-10 p-8 pb-10">
                <span className="absolute top-2 left-6 text-5xl font-serif text-black/20 select-none">
                  “
                </span>
                <div className="pt-4 px-2 text-center">
                  <p className="font-serif text-lg text-amber-900/90 leading-[32px] italic font-medium">
                    {data.message}
                  </p>
                </div>
                <span className="absolute bottom-4 right-8 text-5xl font-serif text-black/20 select-none rotate-180">
                  “
                </span>
                <div className="flex justify-center items-center mt-8 gap-2 opacity-20">
                  <div className="h-[1px] w-6 bg-black" />
                  <span className="text-xs">{customEmoji}</span>
                  <div className="h-[1px] w-6 bg-black" />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-auto pt-10 text-center">
            <Link href="/">
              <button
                className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border font-bold text-[11px] uppercase tracking-wider shadow-sm active:scale-95 transition-all"
                style={{ borderColor: `${themeColor}33`, color: themeColor }}
              >
                <Plus size={14} /> Criar meu Mymo
              </button>
            </Link>
            <p className="text-[8px] uppercase tracking-[0.4em] text-gray-300 font-bold mt-8 mb-4">
              Feito com {customEmoji}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
