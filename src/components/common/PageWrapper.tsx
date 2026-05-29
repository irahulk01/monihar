"use client";

import { useEffect, useState } from "react";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ToastContainer from "./ToastContainer";
import { motion } from "framer-motion";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FFF6F6] text-[#2E2528] flex flex-col justify-between">
        <div>
          <div className="w-full bg-[#2E2528] h-9" />
          <div className="max-w-7xl mx-auto px-4 py-6 border-b border-[#D4AF37]/10 flex justify-between items-center">
            <span className="font-serif text-2xl font-bold tracking-[0.2em] uppercase text-[#2E2528]/30">Monihar</span>
            <div className="h-6 w-48 bg-[#2E2528]/10 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37]/35 border-t-[#D4AF37] animate-spin" />
        </div>
        <div className="w-full bg-white border-t border-[#D4AF37]/20 h-40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden font-sans">
      <div>
        <AnnouncementBar />
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pb-16"
        >
          {children}
        </motion.main>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
