"use client";

import PageWrapper from "@/components/common/PageWrapper";
import productsData from "@/data/products.json";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";
import { Heart, ShoppingBag, Star, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&auto=format&fit=crop&q=80",
    title: "Handpicked Luxury for the Modern Woman",
    subtitle: "MONIHAR BRIDAL EDIT",
    description: "Discover our premium bridal set collections, crafted with pure 18k solid gold and exquisite VVS diamonds.",
    link: "/products?category=Sets",
  },
  {
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&auto=format&fit=crop&q=80",
    title: "Timeless Stackables, Golden Whispers",
    subtitle: "THE GOLD STANDARD",
    description: "Sophisticated rings, delicate anklets, and gold cuffs designed to stack, layer, and inspire.",
    link: "/products?category=Rings",
  },
];

const CATEGORIES_CIRCLES = [
  { name: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&auto=format&fit=crop&q=80" },
  { name: "Earrings", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=300&auto=format&fit=crop&q=80" },
  { name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80" },
  { name: "Bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&auto=format&fit=crop&q=80" },
  { name: "Anklets", image: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=300&auto=format&fit=crop&q=80" },
  { name: "Sets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&auto=format&fit=crop&q=80" },
  { name: "Men's Collection", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300&auto=format&fit=crop&q=80" },
];

const TESTIMONIALS = [
  {
    name: "Aria Montgomery",
    location: "New York",
    stars: 5,
    quote: "The quality of the Aura Radiant Gold Ring is absolutely breathtaking. The soft pink packaging and personal note made it a truly premium gifting experience.",
  },
  {
    name: "Elena Rostova",
    location: "London",
    stars: 5,
    quote: "Monihar has completely elevated my everyday look. Their stacking bands are delicate yet durable, and the customer care was incredibly helpful.",
  },
  {
    name: "Dr. Priyah Sen",
    location: "Mumbai",
    stars: 5,
    quote: "Exceptional lab-grown diamonds! The clarity is outstanding. I received so many compliments on my Akoya Pearl Necklace. A lifelong fan!",
  },
];

const INSTAGRAM_PHOTOS = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=500&auto=format&fit=crop&q=80",
];

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const addToast = useToastStore((state) => state.addToast);

  // Fetch trending products (limit 8)
  const trendingProducts = (productsData as Product[]).filter((p) => p.isTrending).slice(0, 8);
  const featuredProduct = (productsData as Product[]).find((p) => p.isFeatured) || (productsData[0] as Product);

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

  return (
    <PageWrapper>
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-[#FFF6F6]">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${
              idx === heroIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image with soft gold/pink gradient overlay */}
            <div className="absolute inset-0 bg-[#2E2528]/45 z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center scale-105"
            />

            {/* Slider Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left text-white space-y-4 md:space-y-6">
              <span className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[#E5C387] bg-white/10 px-3 py-1 rounded backdrop-blur-sm">
                {slide.subtitle}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide leading-tight max-w-3xl">
                {slide.title}
              </h1>
              <p className="text-xs md:text-sm font-sans tracking-wider max-w-xl text-white/95 leading-relaxed">
                {slide.description}
              </p>
              <div className="pt-2 md:pt-4">
                <Link
                  href={slide.link}
                  className="inline-flex items-center gap-2.5 px-6 md:px-8 py-3 md:py-3.5 bg-white text-[#2E2528] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-lg"
                >
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full border border-white transition-all ${
                idx === heroIndex ? "bg-[#D4AF37] scale-125" : "bg-white/40"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. DUAL PROMO CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1 */}
        <div className="relative aspect-[16/10] md:aspect-[4/3] rounded-lg overflow-hidden group shadow-card border border-[#D4AF37]/15 bg-white">
          <div className="absolute inset-0 bg-[#2E2528]/35 z-10 transition-all duration-500 group-hover:bg-[#2E2528]/50" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80"
            alt="The Pearl Promise"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end text-white space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5C387]">The Pearl Promise</span>
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-wide">Elegant Handcrafted Pearls</h3>
            <p className="text-xs text-white/90 max-w-sm font-sans tracking-wide">
              Rare Akoya pearls matched with solid rose and yellow gold.
            </p>
            <div className="pt-2">
              <Link
                href="/products?material=Pearl"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#E5C387] hover:text-white transition-colors"
              >
                Shop Pearls <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative aspect-[16/10] md:aspect-[4/3] rounded-lg overflow-hidden group shadow-card border border-[#D4AF37]/15 bg-white">
          <div className="absolute inset-0 bg-[#2E2528]/35 z-10 transition-all duration-500 group-hover:bg-[#2E2528]/50" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80"
            alt="Golden Stackables"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end text-white space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5C387]">Imperial Radiance</span>
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-wide">Stackable Masterpieces</h3>
            <p className="text-xs text-white/90 max-w-sm font-sans tracking-wide">
              Layer bracelets, rings, and chains to fit your modern personality.
            </p>
            <div className="pt-2">
              <Link
                href="/products?material=Gold"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#E5C387] hover:text-white transition-colors"
              >
                Shop Gold Edits <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES CIRCLE GRID */}
      <section className="bg-white border-y border-[#D4AF37]/15 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-serif text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold">Discover Fine Craft</span>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-[#2E2528] mt-1 mb-8">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 justify-center">
            {CATEGORIES_CIRCLES.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-3 group text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:md:h-24 rounded-full overflow-hidden border border-[#D4AF37]/20 bg-[#FFF6F6] p-0.5 group-hover:border-[#D4AF37] transition-all duration-300 group-hover:scale-105 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#2E2528] group-hover:text-[#D4AF37] transition-colors">
                  {cat.name.replace("'", "")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRENDING COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="font-serif text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold">Most Loved Edits</span>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-[#2E2528] mt-1">
            Trending Creations
          </h2>
          <div className="gold-divider w-24 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {trendingProducts.map((product) => {
            const hasLiked = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-[#D4AF37]/15 overflow-hidden group shadow-sm flex flex-col justify-between luxury-card-hover"
              >
                <Link href={`/products/${product.id}`} className="block relative aspect-square bg-[#FFF6F6] overflow-hidden">
                  {/* Quick-add/Wishlist Overlays */}
                  <button
                    onClick={(e) => handleToggleWishlist(e, product)}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
                      hasLiked ? "bg-[#D4AF37] text-white" : "bg-white/80 text-[#6B5E62] hover:text-[#D4AF37]"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
                  </button>

                  {/* Images showing hover swaps */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[1] || product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  {/* Trending Tag */}
                  <span className="absolute bottom-3 left-3 bg-[#2E2528] text-[#FFF6F6] text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow-sm z-20">
                    Trending
                  </span>
                </Link>

                <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#6B5E62] font-semibold">
                      {product.category}
                    </span>
                    <Link href={`/products/${product.id}`} className="block">
                      <h4 className="text-xs font-semibold text-[#2E2528] uppercase tracking-widest line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                        {product.name}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#D4AF37] fill-current" />
                      <span className="text-[10px] font-bold text-[#2E2528]">{product.rating}</span>
                      <span className="text-[10px] text-[#6B5E62] font-medium">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/5 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#D4AF37]">₹{product.price.toLocaleString("en-IN")}</span>
                      {product.originalPrice && (
                        <span className="text-[9px] text-[#6B5E62] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="p-2 bg-[#FFF6F6] border border-[#D4AF37]/20 rounded-full hover:bg-[#2E2528] hover:text-white transition-all text-[#2E2528]"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2.5 px-8 py-3 bg-[#2E2528] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all shadow-md"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. FEATURED STAR SHOWCASE */}
      <section className="bg-white border-y border-[#D4AF37]/15 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Image Grid with golden border overlay */}
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square bg-[#FFF6F6] rounded-xl overflow-hidden border border-[#D4AF37]/20 p-2 shadow-luxury">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredProduct.images[0]}
                alt={featuredProduct.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-6 left-6 bg-white/90 border border-[#D4AF37]/35 py-2 px-3 rounded shadow-md backdrop-blur-sm z-20">
                <span className="block text-[8px] font-bold tracking-widest text-[#D4AF37] uppercase">Star Piece</span>
                <span className="block font-serif text-sm font-semibold text-[#2E2528] uppercase">{featuredProduct.name.split(" ")[0]} Edit</span>
              </div>
            </div>

            {/* Showcase Details */}
            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Masterpiece Highlight
                </span>
                <h3 className="font-serif text-2xl md:text-4xl font-bold tracking-wide text-[#2E2528] uppercase leading-tight">
                  {featuredProduct.name}
                </h3>
                <div className="flex items-center gap-1.5 pt-1">
                  <div className="flex text-[#D4AF37]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#6B5E62] font-semibold">
                    Outstanding 4.9 Rating ({featuredProduct.reviewsCount} verified reviews)
                  </span>
                </div>
              </div>

              <p className="text-xs md:text-sm text-[#6B5E62] leading-relaxed max-w-xl font-sans tracking-wide">
                {featuredProduct.description} Crafted carefully with premium {featuredProduct.material} and finished to standard luxury scales. This showcase creation is perfect for modern women looking to celebrate their individual beauty.
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md text-xs text-[#2E2528] font-medium tracking-wide uppercase pt-2">
                <div className="p-3 bg-[#FFF6F6] border border-[#D4AF37]/15 rounded">
                  <span className="block text-[8px] text-[#6B5E62] font-bold">Metallic Grade</span>
                  {featuredProduct.specifications.Metal}
                </div>
                <div className="p-3 bg-[#FFF6F6] border border-[#D4AF37]/15 rounded">
                  <span className="block text-[8px] text-[#6B5E62] font-bold">Finish Standard</span>
                  {featuredProduct.specifications.Finish}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#D4AF37]/10">
                <span className="text-xl md:text-2xl font-bold text-[#D4AF37]">₹{featuredProduct.price.toLocaleString("en-IN")}</span>
                <Link
                  href={`/products/${featuredProduct.id}`}
                  className="px-6 py-3 bg-[#2E2528] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#D4AF37] transition-all shadow-md"
                >
                  View Details
                </Link>
                <button
                  onClick={(e) => handleAddToCart(e, featuredProduct)}
                  className="px-6 py-3 border border-[#2E2528] text-[#2E2528] text-xs font-semibold uppercase tracking-widest hover:bg-[#2E2528] hover:text-white transition-all"
                >
                  Quick Add
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-[#FFF6F6] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-serif text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold">Monihar Stories</span>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-[#2E2528] mt-1 mb-10">
            What Our Patrons Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#D4AF37]/15 p-6 space-y-4 shadow-sm flex flex-col justify-between text-left"
              >
                <div className="space-y-2">
                  <div className="flex text-[#D4AF37]">
                    {Array.from({ length: test.stars }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-[#6B5E62] leading-relaxed font-sans italic">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D4AF37]/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E2528]">{test.name}</h4>
                  <span className="text-[9px] text-[#6B5E62] font-medium uppercase tracking-widest">{test.location} • Verified Buyer</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INSTAGRAM SHOP THE LOOK GALLERY */}
      <section className="bg-white border-t border-[#D4AF37]/15 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-serif text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold">@MoniharJewellers</span>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-[#2E2528] mt-1 mb-2">
            Shop The Look
          </h2>
          <p className="text-xs text-[#6B5E62] uppercase tracking-widest font-semibold mb-8">
            Share your elegant stacks on Instagram using hashtag <span className="text-[#D4AF37] font-bold">#MoniharStyle</span>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {INSTAGRAM_PHOTOS.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden group border border-[#D4AF37]/10 bg-[#FFF6F6]"
              >
                <div className="absolute inset-0 bg-[#2E2528]/25 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300 flex items-center justify-center cursor-pointer">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`Instagram aesthetic ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </PageWrapper>
  );
}
