"use client";

import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#FFF9FC] border-t border-[#D4AF37]/20 text-[#2C1B24] pt-16 pb-10 relative z-10 select-none">
      
      {/* Premium Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#D4AF37]/15 mb-12">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FFF5FA] border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1B24]">Complimentary Shipping</h4>
            <p className="text-[9.5px] text-[#7A6A73] font-medium leading-relaxed mt-1">Free standard courier dispatch on all orders above ₹1,499.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FFF5FA] border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1B24]">Easy Returns</h4>
            <p className="text-[9.5px] text-[#7A6A73] font-medium leading-relaxed mt-1">Complimentary 30-day exchanges and hassle-free returns.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FFF5FA] border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C1B24]">Handcrafted Standard</h4>
            <p className="text-[9.5px] text-[#7A6A73] font-medium leading-relaxed mt-1">Each curated piece is individually selected and certified for quality.</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-left">
        
        {/* Brand Information */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-[0.25em] uppercase text-[#2C1B24]">
              MONIHAR
            </span>
            <span className="text-[7.5px] tracking-[0.2em] uppercase text-[#7A6A73] font-bold mt-0.5">
              Fashion Jewellery For Every Story
            </span>
          </div>
          <p className="text-xs text-[#7A6A73] leading-relaxed max-w-xs font-medium">
            Discover premium fashion jewellery designed to express elegance, femininity, and your individual beauty. We celebrate traditional craftsmanship with modern designs.
          </p>
          <div className="flex items-center gap-4 pt-2 text-[#7A6A73]">
            <Link href="https://instagram.com" target="_blank" className="hover:text-[#E75480] transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </Link>
            <Link href="https://facebook.com" target="_blank" className="hover:text-[#E75480] transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-[#E75480] transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <h4 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] border-b border-[#D4AF37]/15 pb-2">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs font-medium text-[#7A6A73]">
            <li>
              <Link href="/products?category=Rings" className="hover:text-[#E75480] transition-colors">Rings & Solitaires</Link>
            </li>
            <li>
              <Link href="/products?category=Earrings" className="hover:text-[#E75480] transition-colors">Earrings & Studs</Link>
            </li>
            <li>
              <Link href="/products?category=Necklaces" className="hover:text-[#E75480] transition-colors">Necklaces & Chains</Link>
            </li>
            <li>
              <Link href="/products?category=Bracelets" className="hover:text-[#E75480] transition-colors">Bracelets & Cuffs</Link>
            </li>
            <li>
              <Link href="/products?category=Sets" className="hover:text-[#E75480] transition-colors">Jewellery Sets</Link>
            </li>
          </ul>
        </div>

        {/* Client Support */}
        <div className="space-y-4">
          <h4 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] border-b border-[#D4AF37]/15 pb-2">
            Client Services
          </h4>
          <ul className="space-y-2.5 text-xs font-medium text-[#7A6A73]">
            <li>
              <Link href="#" className="hover:text-[#E75480] transition-colors">Jewellery Care Guide</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#E75480] transition-colors">Sizing Reference</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#E75480] transition-colors">Shipping & Returns</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#E75480] transition-colors">Gift Box Consultations</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#E75480] transition-colors">FAQs & Support</Link>
            </li>
          </ul>
        </div>

        {/* Philosophy Note */}
        <div className="space-y-4 bg-[#FFF5FA] p-5 rounded-lg border border-[#D4AF37]/15">
          <h4 className="font-serif text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            Our Philosophy
          </h4>
          <p className="font-serif text-xs text-[#2C1B24] italic leading-relaxed">
            &ldquo;House of Monihar believes that every piece of jewellery carries an individual voice, telling stories of confidence, culture, and love.&rdquo;
          </p>
        </div>

      </div>

      {/* Fine Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-[#D4AF37]/15 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#7A6A73]">
        <p>© {new Date().getFullYear()} HOUSE OF MONIHAR. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-[#E75480] transition-colors">Privacy policy</Link>
          <Link href="#" className="hover:text-[#E75480] transition-colors">Terms of service</Link>
          <Link href="#" className="hover:text-[#E75480] transition-colors">Sitemap</Link>
        </div>
      </div>

    </footer>
  );
}
