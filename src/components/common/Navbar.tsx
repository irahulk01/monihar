"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import CartDrawer from "./CartDrawer";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Offers", href: "/offers" },
    { label: "Wishlist", href: "/wishlist" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-[990] w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-sm py-2"
            : "bg-[#FFF6F6] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-[#2E2528] hover:text-[#D4AF37] p-1 transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <div className="flex flex-col items-center text-center flex-grow md:flex-grow-0">
            <Link href="/" className="group block">
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase text-[#2E2528] group-hover:text-[#D4AF37] transition-colors duration-300">
                Monihar
              </span>
              <span className="block text-[8px] sm:text-[9px] tracking-[0.18em] uppercase text-[#6B5E62] font-medium mt-0.5 max-w-[280px]">
                Handpicked Fine Jewellery
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#D4AF37] relative py-1 ${
                    isActive ? "text-[#D4AF37]" : "text-[#2E2528]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Interaction Icons */}
          <div className="flex items-center gap-4">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-[#2E2528] hover:text-[#D4AF37] p-1.5 transition-colors relative"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="text-[#2E2528] hover:text-[#D4AF37] p-1.5 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#D4AF37] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[#2E2528] hover:text-[#D4AF37] p-1.5 transition-colors relative"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#2E2528] text-[#FFF6F6] text-[9px] font-bold flex items-center justify-center border border-white">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Cart Side Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#2E2528] z-[998] cursor-pointer"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-4/5 max-w-sm bg-[#FFF6F6] z-[999] p-6 flex flex-col justify-between border-r border-[#D4AF37]/20 shadow-2xl"
            >
              <div>
                <div className="flex justify-between items-center pb-5 border-b border-[#D4AF37]/10 mb-8">
                  <div className="flex flex-col text-left">
                    <span className="font-serif text-xl font-bold tracking-[0.18em] uppercase text-[#2E2528]">
                      Monihar
                    </span>
                    <span className="text-[8px] tracking-[0.18em] uppercase text-[#6B5E62] font-semibold mt-0.5">
                      Handpicked Fine Jewellery
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#6B5E62] hover:text-[#2E2528] p-1"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-sm font-bold uppercase tracking-[0.2em] text-[#2E2528] hover:text-[#D4AF37] py-1 border-b border-[#D4AF37]/5"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#D4AF37]/10">
                <p className="text-[10px] text-[#6B5E62] tracking-wider text-center uppercase">
                  Handcrafted Elegance • Monihar 2026
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Sliding Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-white/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-6 right-6 text-[#2E2528] hover:text-[#D4AF37] p-2 transition-colors"
              aria-label="Close Search"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="max-w-2xl w-full text-center space-y-8 px-4">
              <div className="space-y-2">
                <span className="font-serif text-sm tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
                  Curated Collection Search
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-[#2E2528]">
                  What are you looking for?
                </h3>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="SEARCH FOR RINGS, NECKLACES, DIAMONDS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm md:text-base py-4 pl-4 pr-16 border-b-2 border-[#D4AF37]/40 focus:border-[#D4AF37] focus:outline-none bg-transparent text-[#2E2528] placeholder-[#6B5E62]/50 tracking-wider uppercase font-medium"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-3 text-[#2E2528] hover:text-[#D4AF37] p-2 transition-colors"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </form>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-semibold uppercase tracking-wider text-[#6B5E62]">
                <span>Popular:</span>
                <Link
                  href="/products?category=Rings"
                  onClick={() => setIsSearchOpen(false)}
                  className="px-3 py-1 bg-[#FFF6F6] border border-[#D4AF37]/20 rounded-full hover:border-[#D4AF37] transition-all"
                >
                  Solitaires
                </Link>
                <Link
                  href="/products?category=Earrings"
                  onClick={() => setIsSearchOpen(false)}
                  className="px-3 py-1 bg-[#FFF6F6] border border-[#D4AF37]/20 rounded-full hover:border-[#D4AF37] transition-all"
                >
                  Hoops
                </Link>
                <Link
                  href="/products?category=Necklaces"
                  onClick={() => setIsSearchOpen(false)}
                  className="px-3 py-1 bg-[#FFF6F6] border border-[#D4AF37]/20 rounded-full hover:border-[#D4AF37] transition-all"
                >
                  Pearl Chains
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
