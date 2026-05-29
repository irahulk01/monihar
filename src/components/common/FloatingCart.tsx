"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCart() {
  const [isVisible, setIsVisible] = useState(false);
  const items = useCartStore((state) => state.items);
  const getTotals = useCartStore((state) => state.getTotals);
  const { total } = getTotals();

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls down and has items in cart
      setIsVisible(window.scrollY > 150 && totalCount > 0);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalCount]);

  const handleOpenCart = () => {
    window.dispatchEvent(new Event("open-monihar-cart"));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={handleOpenCart}
          className="fixed bottom-6 right-6 z-[900] flex items-center gap-3.5 bg-gradient-to-r from-[#E75480] to-[#2C1B24] text-white pl-4 pr-5 py-3.5 rounded-full shadow-[0_10px_30px_rgba(231,84,128,0.3)] border border-[#D4AF37]/35 group hover:border-[#D4AF37] transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-4.5 h-4.5 text-[#D4AF37] group-hover:animate-bounce" />
            <span className="absolute -top-1.5 -right-2 bg-white text-[#2C1B24] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {totalCount}
            </span>
          </div>

          <div className="flex flex-col text-left leading-none">
            <span className="text-[9px] uppercase tracking-[0.18em] text-[#FFEFF7]/80 font-bold">
              Your Bag
            </span>
            <span className="text-[11px] font-bold tracking-wider text-white">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
