"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, Star } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import CartDrawer from "./CartDrawer";
import { motion, AnimatePresence } from "framer-motion";
import productsData from "@/data/products.json";
import { Product } from "@/types";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const pathname = usePathname();
  const router = useRouter();

  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlistItems.length;

  // Listen to global open cart event
  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("open-monihar-cart", handleOpenCart);
    return () => window.removeEventListener("open-monihar-cart", handleOpenCart);
  }, []);

  // Track scroll position for glassmorphism header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("monihar-recent-searches");
      setRecentSearches(saved ? JSON.parse(saved) : ["Pearl Earrings", "Oxidized Rings", "Beaded Necklaces"]);
    }
  }, []);

  // Perform instant debounced client-side search previews
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const filtered = (productsData as Product[]).filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.material.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Limit to top 5 matches
      setSearchResults(filtered);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent, queryToUse?: string) => {
    if (e) e.preventDefault();
    const finalQuery = (queryToUse || searchQuery).trim();
    if (!finalQuery) return;

    // Save to recent searches
    const updated = [finalQuery, ...recentSearches.filter((q) => q !== finalQuery)].slice(0, 5);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("monihar-recent-searches", JSON.stringify(updated));
    }

    setIsSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(finalQuery)}`);
    setSearchQuery("");
  };

  const handleRecentClick = (query: string) => {
    setSearchQuery(query);
    handleSearchSubmit(undefined, query);
  };

  const navLinks = [
    { label: "New In", href: "/products?sort=featured" },
    { label: "Shop All", href: "/products" },
    { label: "Offers", href: "/offers" },
    { label: "Wishlist", href: "/wishlist" },
  ];

  const suggestedCollections = [
    { name: "Pearl Dreams", tag: "Pearl", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&auto=format&fit=crop&q=80" },
    { name: "Soft Korean", tag: "Korean", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=150&auto=format&fit=crop&q=80" },
    { name: "Bengali Festive", tag: "Handmade", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&auto=format&fit=crop&q=80" },
    { name: "Resin Artistry", tag: "Resin", image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=150&auto=format&fit=crop&q=80" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-[990] w-full transition-all duration-500 ${
          isScrolled
            ? "bg-[#FFF9FC]/85 backdrop-blur-xl border-b border-[#D4AF37]/25 shadow-luxury py-3"
            : "bg-[#FFF9FC] border-b border-[#D4AF37]/10 py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Navigation Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-[#2C1B24] hover:text-[#E75480] p-1.5 transition-colors duration-300"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>

          {/* Luxury Brand Logo */}
          <div className="flex flex-col items-start text-left">
            <Link href="/" className="group block">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] uppercase text-[#2C1B24] group-hover:text-[#E75480] transition-colors duration-500">
                HOUSE OF MONIHAR
              </span>
              <span className="block text-[8px] tracking-[0.2em] uppercase text-[#7A6A73] font-semibold mt-0.5">
                Fashion Jewellery For Every Story
              </span>
            </Link>
          </div>

          {/* Elegant Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 hover:text-[#E75480] relative py-1.5 ${
                    isActive ? "text-[#E75480]" : "text-[#2C1B24]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeLuxuryLine"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#E75480]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Interaction Toolbar */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-[#2C1B24] hover:text-[#E75480] p-2 transition-colors duration-300 relative group"
              aria-label="Search Collection"
            >
              <Search className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="text-[#2C1B24] hover:text-[#E75480] p-2 transition-colors duration-300 relative group"
              aria-label="Wishlist View"
            >
              <Heart className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#E75480] text-white text-[8px] font-bold flex items-center justify-center animate-pulse">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[#2C1B24] hover:text-[#E75480] p-2 transition-colors duration-300 relative group"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#2C1B24] text-[#FFF9FC] text-[8px] font-bold flex items-center justify-center border border-[#FFF9FC]">
                  {totalCartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Luxury Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Slide Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#2C1B24] z-[998] cursor-pointer backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-4/5 max-w-[340px] bg-[#FFF9FC] z-[999] p-7 flex flex-col justify-between border-r border-[#D4AF37]/25 shadow-[10px_0_40px_rgba(44,27,36,0.15)]"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center pb-5 border-b border-[#D4AF37]/15">
                  <div className="flex flex-col text-left">
                    <span className="font-serif text-lg font-bold tracking-[0.2em] uppercase text-[#2C1B24]">
                      MONIHAR
                    </span>
                    <span className="text-[7.5px] tracking-[0.2em] uppercase text-[#7A6A73] font-bold mt-0.5">
                      Fashion Jewellery For Every Story
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#7A6A73] hover:text-[#2C1B24] p-1.5 transition-colors"
                  >
                    <X className="w-5.5 h-5.5" />
                  </button>
                </div>

                <div className="space-y-5 text-left">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-xs font-bold uppercase tracking-[0.25em] text-[#2C1B24] hover:text-[#E75480] py-2 border-b border-[#D4AF37]/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#D4AF37]/15 text-center">
                <p className="text-[9px] text-[#7A6A73] tracking-[0.2em] uppercase font-bold">
                  Elegance & Femininity • Monihar
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Immersive Luxury Full-Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#FFF9FC]/98 backdrop-blur-xl flex flex-col justify-start overflow-y-auto"
          >
            {/* Top Toolbar */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center border-b border-[#D4AF37]/15">
              <span className="font-serif text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
                Editorial Search Suite
              </span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-[#2C1B24] hover:text-[#E75480] p-2 transition-colors flex items-center gap-1.5 group"
                aria-label="Dismiss Search Overlay"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#7A6A73] group-hover:text-[#E75480]">Close</span>
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Immersive Search Container */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start text-left">
              
              {/* Search Entry & Instant Previews (3-fifths on Desktop) */}
              <div className="lg:col-span-3 space-y-8">
                <div className="space-y-3">
                  <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-[#2C1B24]">
                    Explore Monihar
                  </h3>
                  <p className="text-[11px] text-[#7A6A73] font-medium uppercase tracking-[0.18em]">
                    Instant discovery across our premium collections
                  </p>
                </div>

                <form onSubmit={(e) => handleSearchSubmit(e)} className="relative w-full border-b-2 border-[#D4AF37]/35 focus-within:border-[#E75480] transition-colors pb-2">
                  <input
                    type="text"
                    placeholder="Search for Pearls, Korean items, Resin art..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-lg md:text-xl py-2 pl-2 pr-12 focus:outline-none bg-transparent text-[#2C1B24] placeholder-[#7A6A73]/40 tracking-wider uppercase font-medium"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2.5 text-[#2C1B24] hover:text-[#E75480] p-1.5 transition-all duration-300"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </form>

                {/* Instant Search Results Panel */}
                <div className="space-y-4">
                  {searchQuery.trim() !== "" && (
                    <span className="block text-[9px] uppercase tracking-widest font-bold text-[#D4AF37]">
                      Found {searchResults.length === 5 ? "5+" : searchResults.length} instant matches
                    </span>
                  )}

                  <div className="space-y-3.5">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-4 p-2 bg-[#FFF5FA] border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 rounded-lg group transition-all duration-300"
                      >
                        <div className="w-14 h-14 rounded overflow-hidden border border-[#D4AF37]/10 flex-shrink-0 bg-[#FFEFF7]">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-grow">
                          <span className="text-[8px] uppercase tracking-widest text-[#7A6A73] font-bold block">{product.category}</span>
                          <h4 className="text-xs font-bold text-[#2C1B24] uppercase tracking-widest group-hover:text-[#E75480] transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Star className="w-3 h-3 text-[#D4AF37] fill-current" />
                            <span className="text-[10px] font-bold text-[#2C1B24]">{product.rating}</span>
                          </div>
                        </div>
                        <div className="text-right pr-2">
                          <span className="text-xs font-bold text-[#D4AF37]">₹{product.price.toLocaleString("en-IN")}</span>
                        </div>
                      </Link>
                    ))}

                    {searchQuery.trim() !== "" && searchResults.length === 0 && (
                      <div className="p-8 text-center bg-[#FFF5FA] border border-[#D4AF37]/10 rounded-lg">
                        <p className="text-xs text-[#7A6A73] font-medium tracking-wide">
                          No instant matches. Press Enter to view full results.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Popular Keywords Section */}
                <div className="space-y-3 pt-4 border-t border-[#D4AF37]/10">
                  <span className="block text-[9px] uppercase tracking-widest font-bold text-[#D4AF37]">
                    Trending Searches
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {["Pearl Earrings", "Korean Jewellery", "Resin Collection", "Terracotta Collection", "Oxidized Rings"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleRecentClick(item)}
                        className="text-[10px] font-bold uppercase tracking-widest px-3.5 py-2 bg-[#FFF5FA] hover:bg-[#FFEFF7] text-[#2C1B24] border border-[#D4AF37]/20 rounded-full hover:border-[#E75480] transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches Section */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <span className="block text-[9px] uppercase tracking-widest font-bold text-[#D4AF37]">
                      Recent Searches
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleRecentClick(item)}
                          className="text-[10px] font-semibold text-[#7A6A73] hover:text-[#2C1B24] flex items-center gap-1 bg-[#FFF9FC] px-3 py-1.5 rounded border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all"
                        >
                          <span>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* suggested Collections Grid (2-fifths on Desktop) */}
              <div className="lg:col-span-2 space-y-6 lg:pl-10 lg:border-l border-[#D4AF37]/15">
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold text-[#2C1B24] uppercase tracking-wider">
                    Shop The Moods
                  </h4>
                  <p className="text-[10px] text-[#7A6A73] uppercase tracking-widest font-semibold">
                    Curated aesthetic edits
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {suggestedCollections.map((col) => (
                    <Link
                      key={col.name}
                      href={`/products?material=${col.tag}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="group block relative aspect-square rounded-lg overflow-hidden border border-[#D4AF37]/20 bg-[#FFEFF7]"
                    >
                      <div className="absolute inset-0 bg-[#2C1B24]/40 z-10 group-hover:bg-[#2C1B24]/50 transition-all duration-300" />
                      <img
                        src={col.image}
                        alt={col.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 z-20 p-3 flex flex-col justify-end text-white">
                        <span className="font-serif text-xs md:text-sm font-semibold tracking-wider block">
                          {col.name}
                        </span>
                        <span className="text-[7.5px] uppercase tracking-widest text-[#D4AF37] font-bold block mt-0.5">
                          Explore Edit
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="bg-[#FFF5FA] p-5 rounded-lg border border-[#D4AF37]/15 text-center space-y-2">
                  <span className="text-[8px] uppercase tracking-widest font-bold text-[#D4AF37] block">Brand Affirmation</span>
                  <p className="font-serif text-xs text-[#2C1B24] italic leading-relaxed">
                    &ldquo;Jewellery is not just decoration. It is a physical manifestation of your self-expression & memories.&rdquo;
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
