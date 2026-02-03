"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingEmojis() {
  const [isMounted, setIsMounted] = useState(false);
  const [emojis, setEmojis] = useState<{ id: number; x: number; delay: number }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const newEmojis = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: Math.random() * 280,
      delay: i * 0.8,
    }));
    setEmojis(newEmojis);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {emojis.map((emoji) => (
        <motion.div
            key={emoji.id}
            className="absolute text-xl"
            initial={{ y: -20, x: emoji.x, opacity: 0 }}
            animate={{ y: 600, opacity: [0, 1, 0] }}
            transition={{ duration: 4, delay: emoji.delay, repeat: Infinity }}
        >
            ❤️
        </motion.div>
      ))}
    </div>
  );
}
