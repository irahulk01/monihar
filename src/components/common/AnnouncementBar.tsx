"use client";

import React from "react";

const MARQUEE_ITEMS = [
  "HANDMADE JEWELLERY",
  "PEARL COLLECTION",
  "KOREAN FASHION EDITS",
  "RESIN ARTISTRY",
  "OXIDIZED BEAUTY",
  "TERRACOTTA LOVE",
  "BEADED DESIGNS",
  "FREE SHIPPING ON ORDERS OVER ₹1,499",
  "USE CODE: WELCOME10 FOR 10% OFF",
];

export default function AnnouncementBar() {
  // Join item array with diamond dividers and duplicate to create seamless looping track
  const trackContent = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="w-full bg-[#2C1B24] text-[#FFF9FC] py-3.5 overflow-hidden border-b border-[#D4AF37]/35 relative z-50 select-none">
      <div className="flex w-full relative">
        <div className="animate-marquee-track flex items-center whitespace-nowrap gap-10">
          {trackContent.map((text, idx) => (
            <div key={idx} className="flex items-center gap-10 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]">
              <span className="text-[#FFF9FC] hover:text-[#D4AF37] transition-colors duration-300">
                {text}
              </span>
              <span className="text-[#D4AF37] font-medium text-xs">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
