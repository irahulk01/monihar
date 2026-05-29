"use client";

import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { useState } from "react";

export default function Footer() {
  const { addToast } = useToastStore();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    addToast("Subscribed successfully!", "success", "Welcome to the Monihar newsletter. Check your email for a 10% voucher code.");
    setEmail("");
  };

  return (
    <footer className="bg-white border-t border-[#D4AF37]/25 text-[#2E2528] pt-16 pb-8 relative z-10">
      
      {/* Premium Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#D4AF37]/10 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF6F6] border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
            <Truck className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E2528]">Complimentary Shipping</h4>
            <p className="text-[10px] text-[#6B5E62] mt-0.5">Free standard shipping on all orders over ₹1,499.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF6F6] border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E2528]">Easy Returns</h4>
            <p className="text-[10px] text-[#6B5E62] mt-0.5">Complimentary 30-day returns and hassle-free exchanges.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF6F6] border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E2528]">Lifetime Quality Guarantee</h4>
            <p className="text-[10px] text-[#6B5E62] mt-0.5">Each fine creation is crafted to last generations.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        
        {/* Brand Information */}
        <div className="space-y-4 text-left">
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-[0.2em] uppercase text-[#2E2528]">
              Monihar
            </span>
            <span className="text-[8px] tracking-[0.18em] uppercase text-[#6B5E62] font-semibold mt-0.5">
              Handpicked Fine Jewellery
            </span>
          </div>
          <p className="text-xs text-[#6B5E62] leading-relaxed max-w-sm">
            Handpicked fashion jewellery created for modern women. Experience premium craftsmanship, soft aesthetics, and timeless elegancy.
          </p>
          <div className="flex items-center gap-4 pt-2 text-[#6B5E62]">
            <Link href="https://instagram.com" target="_blank" className="hover:text-[#D4AF37] transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </Link>
            <Link href="https://facebook.com" target="_blank" className="hover:text-[#D4AF37] transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-[#D4AF37] transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Categories Links */}
        <div className="space-y-4 text-left">
          <h4 className="font-serif text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37] border-b border-[#D4AF37]/20 pb-2">
            Shop Collections
          </h4>
          <ul className="space-y-2.5 text-xs text-[#6B5E62]">
            <li>
              <Link href="/products?category=Rings" className="hover:text-[#D4AF37] transition-colors">Rings & Bands</Link>
            </li>
            <li>
              <Link href="/products?category=Earrings" className="hover:text-[#D4AF37] transition-colors">Earrings & Studs</Link>
            </li>
            <li>
              <Link href="/products?category=Necklaces" className="hover:text-[#D4AF37] transition-colors">Necklaces & Pendants</Link>
            </li>
            <li>
              <Link href="/products?category=Bracelets" className="hover:text-[#D4AF37] transition-colors">Bracelets & Cuffs</Link>
            </li>
            <li>
              <Link href="/products?category=Sets" className="hover:text-[#D4AF37] transition-colors">Jewellery Sets</Link>
            </li>
            <li>
              <Link href="/products?category=Men's Collection" className="hover:text-[#D4AF37] transition-colors">Men&apos;s Edit</Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-4 text-left">
          <h4 className="font-serif text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37] border-b border-[#D4AF37]/20 pb-2">
            Services & Support
          </h4>
          <ul className="space-y-2.5 text-xs text-[#6B5E62]">
            <li>
              <Link href="#" className="hover:text-[#D4AF37] transition-colors">Care Instructions</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#D4AF37] transition-colors">Size Guide</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#D4AF37] transition-colors">Shipping & Returns policy</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#D4AF37] transition-colors">Gift Consultations</Link>
            </li>
            <li>
              <Link href="/offers" className="hover:text-[#D4AF37] transition-colors">Exclusive Offers</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#D4AF37] transition-colors">FAQs & Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="space-y-4 text-left">
          <h4 className="font-serif text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37] border-b border-[#D4AF37]/20 pb-2">
            Join the Monihar Club
          </h4>
          <p className="text-xs text-[#6B5E62] leading-relaxed">
            Subscribe to receive priority access to our exclusive collections, styling edits, and premium discount events.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-xs py-2.5 px-3 border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] placeholder-[#6B5E62]/50 tracking-wider font-medium"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[#2E2528] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#D4AF37] transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#D4AF37]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-[#6B5E62] uppercase tracking-wider">
        <p>© {new Date().getFullYear()} Monihar Jewellers. All Rights Reserved.</p>
        <div className="flex gap-6 font-semibold">
          <Link href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-[#D4AF37] transition-colors">Sitemap</Link>
        </div>
      </div>

    </footer>
  );
}
