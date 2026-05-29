"use client";

import PageWrapper from "@/components/common/PageWrapper";
import { useToastStore } from "@/store/useToastStore";
import { Copy, Percent, HelpCircle } from "lucide-react";

interface OfferCard {
  code: string;
  discount: string;
  minSpend: string;
  title: string;
  description: string;
  terms: string;
}

const OFFERS: OfferCard[] = [
  {
    code: "WELCOME10",
    discount: "10% OFF",
    minSpend: "No Minimum",
    title: "First Purchase Celebration",
    description: "Welcome to Monihar! Indulge in our exquisite fine jewellery with a special 10% introductory gift on your very first order.",
    terms: "Valid on all collections. Single use per customer account. Cannot be combined with other offers.",
  },
  {
    code: "MONIHARGOLD",
    discount: "15% OFF",
    minSpend: "₹2,499 Minimum",
    title: "Gilded Luxury Reward",
    description: "Elevate your stacks with our premium 18kt hallmarked gold edits. Unlock a generous 15% discount for collections above ₹2,499.",
    terms: "Applies automatically once order subtotal satisfies minimum spend. Excludes shipping fees.",
  },
  {
    code: "LUXURY20",
    discount: "20% OFF",
    minSpend: "₹4,999 Minimum",
    title: "The Empress Bridal Gift",
    description: "Celebrate milestones, bridal sets, and radiant halo collections. Receive a majestic 20% savings on all curations exceeding ₹4,999.",
    terms: "Minimum spend of ₹4,999 required before discount calculation. Valid for all categories.",
  },
];

export default function OffersPage() {
  const { addToast } = useToastStore();

  const handleCopyCode = (code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      addToast("Code Copied!", "success", `Coupon code ${code} is copied to your clipboard.`);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <span className="font-serif text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold">Exclusive Gifts</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-[#2E2528] mt-1">
            Monihar Offers & Vouchers
          </h1>
          <div className="gold-divider w-24 mx-auto mt-3" />
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OFFERS.map((offer) => (
            <div
              key={offer.code}
              className="bg-white rounded-xl border border-[#D4AF37]/20 p-6 flex flex-col justify-between space-y-6 shadow-luxury text-left relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300"
            >
              {/* Card visual elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FFF6F6] rounded-full border border-[#D4AF37]/10 flex items-center justify-center transition-all group-hover:scale-110" />

              <div className="space-y-4">
                {/* Header visuals */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF6F6] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold tracking-widest text-[#6B5E62] uppercase">
                      Spend: {offer.minSpend}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#2E2528] uppercase tracking-wide">
                      {offer.title}
                    </h3>
                  </div>
                </div>

                <div className="bg-[#FFF6F6] p-3 rounded-lg border border-dashed border-[#D4AF37]/50 text-center space-y-1">
                  <span className="block text-2xl font-serif font-bold text-[#D4AF37]">
                    {offer.discount}
                  </span>
                  <p className="text-[10px] text-[#6B5E62] uppercase tracking-widest font-semibold">
                    Discount Rate
                  </p>
                </div>

                <p className="text-xs text-[#6B5E62] leading-relaxed font-sans font-medium">
                  {offer.description}
                </p>
              </div>

              {/* Copy Code Actions */}
              <div className="space-y-4 pt-4 border-t border-[#D4AF37]/10">
                <div className="flex gap-2 items-center">
                  <div className="flex-grow bg-[#FFF6F6] border border-[#D4AF37]/20 text-center py-2 text-xs font-bold text-[#2E2528] tracking-widest uppercase rounded">
                    {offer.code}
                  </div>
                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    className="p-2.5 bg-[#2E2528] text-white hover:bg-[#D4AF37] transition-all rounded"
                    aria-label="Copy coupon code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Terms Details */}
                <div className="p-3 bg-[#FFF6F6] rounded border border-[#D4AF37]/10 text-[9px] text-[#6B5E62] leading-relaxed">
                  <p className="font-semibold flex items-center gap-1 uppercase mb-0.5 text-[#2E2528]">
                    <HelpCircle className="w-3 h-3 text-[#D4AF37]" /> Terms & Conditions:
                  </p>
                  {offer.terms}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </PageWrapper>
  );
}
