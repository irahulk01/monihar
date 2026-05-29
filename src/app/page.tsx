"use client";

import PageWrapper from "@/components/common/PageWrapper";
import productsData from "@/data/products.json";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";
import { Heart, ShoppingBag, Star, ArrowRight, Eye, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

const MOODS = [
  {
    name: "Pearl Dreams",
    tag: "Pearl",
    tagline: "Lustrous ocean pearls matched with solid modern curves",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    color: "from-[#FFEFF7]/60 to-[#FFF5FA]/80",
  },
  {
    name: "Bengali Festive",
    tag: "Handmade",
    tagline: "Bold, intricate masterpieces honoring gold tradition",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80",
    color: "from-[#FDE2E4]/60 to-[#FFF9FC]/80",
  },
  {
    name: "Soft Korean",
    tag: "Korean",
    tagline: "Romantic pastels and delicate crystal drops",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80",
    color: "from-[#FFF5FA]/60 to-[#FFEFF7]/80",
  },
  {
    name: "Minimal Luxe",
    tag: "Silver",
    tagline: "Sleek, stackable silver and white platinum essentials",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    color: "from-[#FFF9FC]/60 to-[#FFF5FA]/80",
  },
  {
    name: "Date Night Edit",
    tag: "Gold",
    tagline: "Striking statement loops designed for candlelit glow",
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&auto=format&fit=crop&q=80",
    color: "from-[#FFEFF7]/70 to-[#FFF5FA]/70",
  },
  {
    name: "Everyday Glow",
    tag: "Resin",
    tagline: "Lightweight artful resin shapes for the modern wardrobe",
    image: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=600&auto=format&fit=crop&q=80",
    color: "from-[#FFF5FA]/70 to-[#FDE2E4]/70",
  },
];

const BENTO_ITEMS = [
  {
    title: "Pearl Collection",
    tag: "Pearl",
    span: "lg:col-span-3 lg:row-span-2",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=80",
    desc: "Exquisite handpicked freshwater pearl chokers, studs, and layering pendants.",
  },
  {
    title: "Korean Collection",
    tag: "Korean",
    span: "lg:col-span-2 lg:row-span-1",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80",
    desc: "Dainty blossom studs, micro pavé hoops, and celestial layering bracelets.",
  },
  {
    title: "Resin Artistry",
    tag: "Resin",
    span: "lg:col-span-2 lg:row-span-1",
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80",
    desc: "Curated organic glass-like resin floral petals matching modern linen silhouettes.",
  },
  {
    title: "Terracotta Love",
    tag: "Handmade",
    span: "lg:col-span-5 lg:row-span-1",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&auto=format&fit=crop&q=80",
    desc: "Bengali-inspired baked clay art, hand-painted with pure gold dust and rustic pigments.",
  },
];

const STYLE_INSPIRATION = [
  { image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80", height: "aspect-[3/4]" },
  { image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=80", height: "aspect-[1/1]" },
  { image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80", height: "aspect-[3/4]" },
  { image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=80", height: "aspect-[1/1]" },
  { image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&auto=format&fit=crop&q=80", height: "aspect-[3/4]" },
  { image: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=500&auto=format&fit=crop&q=80", height: "aspect-[1/1]" },
];

const TESTIMONIALS = [
  {
    name: "Aria Sen",
    quote: "The Pearl Cluster drops are breathtaking. Monihar doesn't just sell jewelry; they package confidence and a gorgeous Bengali heritage.",
    role: "Aesthetic Curator",
    location: "Kolkata",
  },
  {
    name: "Elena Rostova",
    quote: "Exceptional Korean studs. They are incredibly lightweight, super polished, and have this absolute premium glow in photos. A complete fan!",
    role: "Fashion Stylist",
    location: "Mumbai",
  },
  {
    name: "Priya Mukherjee",
    quote: "I wore the Terracotta hand-painted set to a family gala. Everyone was asking where I got it. It is organic, luxurious, and deeply historic.",
    role: "Patron",
    location: "Delhi",
  },
];

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const addToast = useToastStore((state) => state.addToast);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");

  const trendingProducts = (productsData as Product[]).filter((p) => p.isTrending).slice(0, 8);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addItem(product, product.sizes[0] || "One Size");
    addToast("Added to Bag", "success", `${product.name} has been added to your shopping bag.`);
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const added = toggleWishlist(product);
    if (added) {
      addToast("Added to Wishlist", "success", `${product.name} has been added to your wishlist.`);
    } else {
      addToast("Removed from Wishlist", "info", `${product.name} was removed from your wishlist.`);
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    addToast("Welcome to Monihar", "success", "You have successfully joined our exclusive fashion list.");
    setEmail("");
  };

  return (
    <PageWrapper>
      {/* SECTION 2 — CINEMATIC HERO EXPERIENCE */}
      <section className="relative w-full min-h-[90vh] md:min-h-screen overflow-hidden flex items-center justify-center bg-[#FFF9FC] px-4 py-16 md:py-0">
        
        {/* Abstract luxury gold & pink floating background glow circles */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#FFEFF7] filter blur-[80px] opacity-70 animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#FDE2E4] filter blur-[100px] opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
          
          {/* Hero Copy (Left 6 columns on large screen) */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFEFF7] border border-[#E75480]/20 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#E75480]" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-[#E75480]">
                  House of Monihar Edits
                </span>
              </div>

              {/* Majestic Large Typography */}
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#2C1B24] leading-[1.05]">
                Adorn Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E75480] via-[#2C1B24] to-[#D4AF37] italic font-medium">
                  Story
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-xs md:text-sm lg:text-base text-[#7A6A73] leading-relaxed max-w-xl font-medium tracking-wide"
            >
              Curated fashion jewellery inspired by elegance, femininity, and modern style. Designed to reflect the unique beauty in every chapter of your path.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/products"
                className="px-8 py-4 bg-gradient-to-r from-[#E75480] to-[#2C1B24] text-white text-xs font-bold uppercase tracking-[0.25em] hover:shadow-[0_8px_30px_rgba(231,84,128,0.25)] transition-all duration-300 rounded"
              >
                Shop Collection
              </Link>
              <Link
                href="/products?sort=trending"
                className="px-8 py-4 border border-[#D4AF37] hover:border-[#E75480] text-[#2C1B24] text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#FFF5FA] transition-all duration-300 rounded"
              >
                Explore New Arrivals
              </Link>
            </motion.div>

            {/* Micro Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-6 border-t border-[#D4AF37]/15 flex items-center gap-8 text-[9px] font-bold uppercase tracking-widest text-[#7A6A73]"
            >
              <div>
                <span className="block text-[#2C1B24] text-sm font-bold font-serif">100%</span>
                Handpicked
              </div>
              <div className="w-[1px] h-6 bg-[#D4AF37]/35" />
              <div>
                <span className="block text-[#2C1B24] text-sm font-bold font-serif">Premium</span>
                Korean & Pearl
              </div>
              <div className="w-[1px] h-6 bg-[#D4AF37]/35" />
              <div>
                <span className="block text-[#2C1B24] text-sm font-bold font-serif">Secure</span>
                tamper box
              </div>
            </motion.div>
          </div>

          {/* Cinematic Hero Imagery (Right 6 columns on large screen) */}
          <div className="lg:col-span-6 relative flex justify-center">
            
            {/* Magazine Portrait Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-[30px] overflow-hidden border border-[#D4AF37]/25 p-3.5 bg-white shadow-luxury group"
            >
              <div className="absolute inset-0 bg-[#2C1B24]/10 group-hover:bg-transparent transition-all duration-500 z-10" />
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80"
                alt="House of Monihar Premium Model Portrait"
                className="w-full h-full object-cover rounded-[20px] scale-102 group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating decorative elements */}
              <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-md border border-[#D4AF37]/35 px-4 py-2.5 rounded-xl shadow-md">
                <span className="block text-[8px] font-bold tracking-widest text-[#D4AF37] uppercase">Design Focus</span>
                <span className="block font-serif text-xs font-semibold text-[#2C1B24] uppercase">Akoya Pearl Edit</span>
              </div>
            </motion.div>

            {/* Asymmetrical gold floater badge */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -top-6 right-6 z-20 w-24 h-24 rounded-full bg-[#FFF5FA] border border-[#D4AF37]/35 flex flex-col items-center justify-center text-center shadow-lg p-2"
            >
              <span className="text-[7px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase">Handmade</span>
              <Heart className="w-3.5 h-3.5 text-[#E75480] fill-current my-1" />
              <span className="text-[7px] font-bold tracking-[0.25em] text-[#2C1B24] uppercase">With Love</span>
            </motion.div>

          </div>

        </div>
      </section>

      {/* SECTION 3 — SHOP THE MOOD */}
      <section className="py-20 bg-white border-y border-[#D4AF37]/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-2">
            <span className="font-serif text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-bold">Discover Your Aura</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-[#2C1B24]">
              Shop The Mood
            </h2>
            <div className="w-16 h-[1.5px] bg-[#E75480] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOODS.map((mood, idx) => (
              <motion.div
                key={mood.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#D4AF37]/10 bg-[#FFF9FC] shadow-sm flex flex-col justify-end text-left cursor-pointer"
              >
                {/* Visual Cover Layer Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1B24]/90 via-[#2C1B24]/30 to-transparent z-10 transition-all duration-500 group-hover:from-[#2C1B24]/95" />
                <img
                  src={mood.image}
                  alt={mood.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="relative z-20 p-8 space-y-3.5">
                  <span className="inline-block text-[8px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] border-b border-[#D4AF37] pb-1">
                    {mood.tag} Collection
                  </span>
                  
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide leading-none">
                    {mood.name}
                  </h3>
                  
                  <p className="text-[10.5px] text-white/80 font-medium leading-relaxed tracking-wide font-sans line-clamp-2">
                    {mood.tagline}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/products?material=${mood.tag}`}
                      className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors duration-300"
                    >
                      Explore Mood <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4 — FEATURED COLLECTIONS (Bento Grid) */}
      <section className="py-20 bg-[#FFF9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-left space-y-2">
            <span className="font-serif text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-bold">Featured Curation</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-[#2C1B24]">
              Curated Collections
            </h2>
            <p className="text-xs text-[#7A6A73] font-bold uppercase tracking-widest">
              Explore asymmetrical bento grids of fine craft pieces
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 auto-rows-[340px]">
            {BENTO_ITEMS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className={`relative rounded-2xl overflow-hidden border border-[#D4AF37]/15 group shadow-sm bg-white ${item.span}`}
              >
                {/* Shadow glaze overlay */}
                <div className="absolute inset-0 bg-[#2C1B24]/40 group-hover:bg-[#2C1B24]/50 z-10 transition-all duration-300" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8 text-left text-white space-y-2.5 bg-gradient-to-t from-[#2C1B24]/80 to-transparent">
                  <span className="text-[8px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
                    {item.tag} Edit
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-white/90 max-w-md font-sans tracking-wide leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/products?category=${encodeURIComponent(item.tag === "Handmade" || item.tag === "Resin" ? "Sets" : "Earrings")}`}
                      className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors"
                    >
                      Shop Collection <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5 — BESTSELLERS CAROUSEL */}
      <section className="py-20 bg-white border-y border-[#D4AF37]/15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="text-left space-y-2">
              <span className="font-serif text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-bold">Trending Pieces</span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-[#2C1B24]">
                The Bestsellers
              </h2>
            </div>
            
            {/* Custom Carousel Navigation Controls */}
            <div className="flex gap-3">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-11 h-11 rounded-full border border-[#D4AF37]/35 flex items-center justify-center hover:border-[#E75480] hover:text-[#E75480] transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-11 h-11 rounded-full border border-[#D4AF37]/35 flex items-center justify-center hover:border-[#E75480] hover:text-[#E75480] transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Draggable visual card track */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory cursor-grab"
            style={{ scrollbarWidth: "none" }}
          >
            {trendingProducts.map((product) => {
              const hasLiked = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="w-[280px] md:w-[320px] flex-shrink-0 snap-start bg-[#FFF9FC] rounded-2xl border border-[#D4AF37]/15 overflow-hidden group shadow-sm flex flex-col justify-between luxury-card"
                >
                  <Link href={`/products/${product.id}`} className="block relative aspect-square bg-[#FFEFF7] overflow-hidden">
                    {/* Action buttons reveal on hover */}
                    <button
                      onClick={(e) => handleToggleWishlist(e, product)}
                      className={`absolute top-4 right-4 z-20 p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
                        hasLiked ? "bg-[#E75480] text-white" : "bg-white/80 text-[#7A6A73] hover:text-[#E75480]"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
                    </button>

                    {/* Image swap on hover */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
                    />
                    <img
                      src={product.images[1] || product.images[0]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                    />

                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-[#2C1B24]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
                      <div className="px-5 py-2.5 bg-white/95 text-[#2C1B24] rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 space-y-3.5 flex-grow flex flex-col justify-between text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#7A6A73] font-bold">
                        {product.category}
                      </span>
                      <Link href={`/products/${product.id}`} className="block">
                        <h4 className="text-xs font-bold text-[#2C1B24] uppercase tracking-[0.18em] line-clamp-1 group-hover:text-[#E75480] transition-colors">
                          {product.name}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                        <span className="text-[10px] font-bold text-[#2C1B24]">{product.rating}</span>
                        <span className="text-[10px] text-[#7A6A73] font-medium">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3.5 border-t border-[#D4AF37]/10 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#D4AF37]">₹{product.price.toLocaleString("en-IN")}</span>
                        {product.originalPrice && (
                          <span className="text-[9.5px] text-[#7A6A73] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="p-3 bg-[#FFF5FA] border border-[#D4AF37]/25 rounded-full hover:bg-[#2C1B24] hover:text-white transition-all text-[#2C1B24]"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 6 — STORY SECTION */}
      <section className="py-20 bg-[#FFF9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Text (Left 7 Columns) */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
              <div className="space-y-2">
                <span className="font-serif text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-bold">Bengali Roots • Modern Elegance</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-[#2C1B24] leading-tight">
                  The House of Monihar Story
                </h2>
                <div className="w-16 h-[1.5px] bg-[#E75480] mt-4" />
              </div>

              <div className="space-y-4 text-xs md:text-sm text-[#7A6A73] leading-relaxed max-w-2xl font-medium tracking-wide">
                <p>
                  Born out of deep reverence for beauty and self-expression, Monihar represents the ultimate confluence of vintage Bengali elegance and modern minimal fashion. &ldquo;Monihar&rdquo; refers to a magnificent necklace of gems—a crown of personal memories designed to celebrate the individual power in every woman.
                </p>
                <p>
                  Our curations focus on exquisite artificial, handmade, resin, terracotta, and soft Korean designs, offering rich layered aesthetics that fit into everyday stories. Every pearl, bead, and hand-painted metal component is inspected to ensure luxurious weight, durability, and a stunning reflection.
                </p>
                <p>
                  Whether it is a glowing festive celebration, a candlelit date night edit, or a stack of minimal bands for your daily routine—our pieces accompany your personal growth, framing memories with grace and light.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 px-7 py-3 bg-[#2C1B24] text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#E75480] transition-colors"
                >
                  Explore Our Work <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Story Visual Spread (Right 5 Columns) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative aspect-[3/4] w-full max-w-[340px] rounded-3xl overflow-hidden border border-[#D4AF37]/25 p-3 bg-white shadow-luxury">
                <img
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80"
                  alt="House of Monihar Story Representation"
                  className="w-full h-full object-cover rounded-[20px]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7 — STYLE INSPIRATION (Pinterest Masonry) */}
      <section className="py-20 bg-white border-y border-[#D4AF37]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-serif text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-bold">Monihar Editorial</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-[#2C1B24]">
              Style Inspiration
            </h2>
            <p className="text-xs text-[#7A6A73] font-bold uppercase tracking-widest">
              Pinterest-style visual masonry of aesthetic details
            </p>
          </div>

          <div className="masonry-grid gap-4 md:gap-6">
            {STYLE_INSPIRATION.map((item, idx) => (
              <div
                key={idx}
                className={`masonry-item rounded-2xl overflow-hidden border border-[#D4AF37]/10 bg-[#FFF9FC] shadow-sm relative group overflow-hidden ${item.height}`}
              >
                <div className="absolute inset-0 bg-[#2C1B24]/20 opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-300 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <img
                  src={item.image}
                  alt={`Style lookbook ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8 — TESTIMONIALS (Animated Floating Cards) */}
      <section className="py-20 bg-[#FFF9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-2">
            <span className="font-serif text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-bold">Client Diaries</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-[#2C1B24]">
              What Our Patrons Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test, idx) => (
              <motion.div
                key={test.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="bg-white rounded-2xl border border-[#D4AF37]/15 p-8 text-left shadow-sm flex flex-col justify-between aspect-[4/3] hover:shadow-[0_12px_24px_-10px_rgba(212,175,55,0.15)] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex text-[#D4AF37]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="font-serif text-[12.5px] leading-relaxed text-[#2C1B24] italic">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/10 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C1B24]">{test.name}</span>
                  <span className="text-[8px] text-[#7A6A73] uppercase tracking-widest font-semibold mt-0.5">{test.role} • {test.location}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 9 — NEWSLETTER (Soft Gradient Box) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full bg-gradient-to-tr from-[#FFEFF7] via-[#FFF9FC] to-[#FFF5FA] rounded-[30px] border border-[#D4AF37]/20 p-8 md:p-16 text-center space-y-6 md:space-y-8 shadow-sm"
          >
            <div className="space-y-2 max-w-xl mx-auto">
              <span className="font-serif text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-bold">The Monihar Club</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-[#2C1B24]">
                Join Our Exclusive List
              </h2>
              <p className="text-xs text-[#7A6A73] font-semibold leading-relaxed tracking-wide">
                Subscribe to receive early announcements, seasonal lookbooks, and 10% off your initial purchase order.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow text-xs py-3.5 px-4 border border-[#D4AF37]/35 focus:border-[#E75480] focus:outline-none bg-white rounded uppercase tracking-widest font-semibold placeholder-[#7A6A73]/40"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#2C1B24] text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#E75480] transition-colors rounded shadow-md"
              >
                Join Now
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
