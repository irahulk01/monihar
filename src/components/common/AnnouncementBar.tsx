"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ANNOUNCEMENTS = [
  "✨ FREE SHIPPING ON ORDERS OVER ₹1,499 • COMPLIMENTARY SIGNATURE LUXURY PACKAGING ✨",
  "🌹 GET 10% OFF YOUR FIRST ORDER • USE CODE: WELCOME10 🌹",
  "💫 FESTIVE GOLD CELEBRATION • 15% OFF ON ORDERS OVER ₹2,499 (CODE: MONIHARGOLD) 💫",
  "💎 HANDCRAFTED FINE JEWELLERY FOR THE MODERN INDIAN WOMAN 💎"
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#2E2528] text-[#FFF6F6] py-2 px-4 text-center overflow-hidden border-b border-[#D4AF37]/20 relative z-50">
      <div className="max-w-7xl mx-auto h-5 relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-xs md:text-sm tracking-[0.15em] font-medium font-sans uppercase"
          >
            {ANNOUNCEMENTS[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
