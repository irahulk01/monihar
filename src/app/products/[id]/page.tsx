"use client";

import PageWrapper from "@/components/common/PageWrapper";
import { ProductDetailSkeleton } from "@/components/common/SkeletonLoader";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";
import productsData from "@/data/products.json";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Star, Share2, Shield, Gift, RefreshCw, Award, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const addToast = useToastStore((state) => state.addToast);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"spec" | "shipping" | "gifting">("spec");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Fetch product detail on mount/ID change
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          setSelectedImage(data.product.images[0]);
          setSelectedSize(data.product.sizes[0] || "One Size");

          // Filter related products from local database
          const related = (productsData as Product[]).filter(
            (p) => p.category === data.product.category && p.id !== data.product.id
          ).slice(0, 4);
          setRelatedProducts(related);
        } else {
          addToast("Product Not Found", "error", "The dynamic jewellery item does not exist.");
          router.push("/products");
        }
      } catch (err) {
        console.error("Failed to fetch single product details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, addToast, router]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <ProductDetailSkeleton />
        </div>
      </PageWrapper>
    );
  }

  if (!product) return null;

  const hasLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    addToast("Added to Bag", "success", `${product.name} (Size: ${selectedSize}) has been added to your shopping bag.`);
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product);
    if (added) {
      addToast("Added to Wishlist", "success", `${product.name} has been added to your wishlist.`);
    } else {
      addToast("Removed from Wishlist", "info", `${product.name} was removed from your wishlist.`);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      addToast("Link Copied", "info", "Product link copied to clipboard. Share the luxury!");
    }
  };

  const lookbookImages = [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80",
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 select-none">
        
        {/* Breadcrumb */}
        <div className="text-left mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#7A6A73]">
          <Link href="/" className="hover:text-[#E75480] transition-colors">Home</Link>
          <span className="mx-2.5 text-[#D4AF37]">✦</span>
          <Link href="/products" className="hover:text-[#E75480] transition-colors">Collections</Link>
          <span className="mx-2.5 text-[#D4AF37]">✦</span>
          <span className="text-[#2C1B24]">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Editorial Stacked Gallery (7-columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary Spotlight Frame */}
            <div className="relative aspect-square bg-[#FFEFF7] rounded-3xl overflow-hidden border border-[#D4AF37]/20 p-3 bg-white shadow-luxury flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-[20px]"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-[#2C1B24]/40 flex items-center justify-center rounded-3xl z-10">
                  <span className="bg-white text-[#2C1B24] text-xs font-bold tracking-[0.25em] uppercase py-2.5 px-7 shadow-md rounded border border-[#D4AF37]/25">
                    Temporarily Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Premium Asymmetric Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-[#FFF5FA] border p-1 transition-all duration-300 ${
                    selectedImage === img
                      ? "border-[#E75480] scale-103 shadow-md"
                      : "border-[#D4AF37]/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} detail ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>

            {/* Design statement under the image */}
            <div className="hidden lg:block bg-[#FFF5FA] p-6 rounded-2xl border border-[#D4AF37]/15 text-left mt-8">
              <span className="text-[8px] font-bold tracking-widest text-[#D4AF37] uppercase block mb-1">Brand Legacy</span>
              <p className="font-serif text-xs text-[#2C1B24] leading-relaxed italic">
                &ldquo;Every stone, metal luster, and bead loop represents a customized piece. Monihar honors self-expression in modern lifestyle layouts.&rdquo;
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Information Details (5-columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-[110px] space-y-8 text-left">
            
            {/* Main Identification Header */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                    {product.category} Collection
                  </span>
                  <h1 className="font-serif text-3xl lg:text-4xl font-bold tracking-wide text-[#2C1B24] uppercase mt-1 leading-tight">
                    {product.name}
                  </h1>
                </div>
                
                {/* Visual Circle Action Toolbar */}
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-3 border border-[#D4AF37]/25 rounded-full bg-white/70 hover:border-[#E75480] text-[#2C1B24] transition-all hover:scale-105"
                    aria-label="Share page link"
                  >
                    <Share2 className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-3 border rounded-full transition-all hover:scale-105 ${
                      hasLiked
                        ? "bg-[#E75480] border-[#E75480] text-white shadow-md"
                        : "border-[#D4AF37]/25 bg-white/70 text-[#2C1B24] hover:border-[#E75480]"
                    }`}
                    aria-label="Toggle Wishlist status"
                  >
                    <Heart className={`w-4.5 h-4.5 ${hasLiked ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Star Rating Reviews Summary */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="flex text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-current"
                          : "opacity-40"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#2C1B24]">{product.rating}</span>
                <span className="text-[10px] text-[#7A6A73] font-bold uppercase tracking-widest pl-1">
                  • {product.reviewsCount} verified reviews
                </span>
              </div>
            </div>

            {/* Price Headers */}
            <div className="flex items-baseline gap-3.5 py-4 border-y border-[#D4AF37]/15">
              <span className="text-2xl font-bold text-[#D4AF37]">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-[#7A6A73] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="bg-[#FFEFF7] text-[#E75480] text-[8px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded border border-[#E75480]/20 ml-2">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Curated Description */}
            <p className="text-xs md:text-sm text-[#7A6A73] leading-relaxed font-medium tracking-wide">
              {product.description} Carefully hand-selected, polished, and mounted to luxury standards. Designed to look breathtakingly elegant, feminine, and classic in both natural daylight and candlelit ballroom settings.
            </p>

            {/* Ring / Bracelet sizes */}
            {product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-[#2C1B24]">
                  <span className="font-bold uppercase tracking-[0.2em]">Select Size</span>
                  <button className="text-[9px] text-[#7A6A73] hover:text-[#E75480] underline tracking-widest uppercase font-bold">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`w-11 h-11 text-xs font-bold uppercase rounded-full border transition-all duration-300 flex items-center justify-center ${
                        selectedSize === sz
                          ? "bg-[#2C1B24] border-[#2C1B24] text-white scale-105 shadow-md"
                          : "border-[#D4AF37]/20 bg-white text-[#2C1B24] hover:border-[#E75480]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Checkout Actions */}
            <div className="pt-4 space-y-4">
              {product.inStock ? (
                <div className="flex gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#D4AF37]/25 rounded bg-[#FFF5FA] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-4 hover:bg-[#FFEFF7] text-[#2C1B24] font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-bold text-[#2C1B24]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-4 hover:bg-[#FFEFF7] text-[#2C1B24] font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-grow py-4 bg-gradient-to-r from-[#E75480] to-[#2C1B24] text-white text-xs font-bold uppercase tracking-[0.25em] hover:shadow-[0_8px_25px_rgba(231,84,128,0.2)] transition-all duration-300 flex items-center justify-center gap-2.5 rounded shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Add to Shopping Bag
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-4 bg-[#7A6A73] text-white/50 text-xs font-bold uppercase tracking-widest cursor-not-allowed text-center rounded"
                >
                  Temporarily Sold Out
                </button>
              )}
            </div>

            {/* Premium details Accordion tabs */}
            <div className="border border-[#D4AF37]/20 rounded-2xl overflow-hidden bg-white shadow-sm mt-8">
              {/* Tab headers */}
              <div className="grid grid-cols-3 text-center border-b border-[#D4AF37]/15 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em]">
                <button
                  onClick={() => setActiveTab("spec")}
                  className={`py-3.5 transition-colors ${
                    activeTab === "spec"
                      ? "bg-[#FFF5FA] text-[#E75480] border-b-2 border-[#E75480]"
                      : "text-[#7A6A73] hover:bg-[#FFF5FA]/30"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`py-3.5 transition-colors ${
                    activeTab === "shipping"
                      ? "bg-[#FFF5FA] text-[#E75480] border-b-2 border-[#E75480]"
                      : "text-[#7A6A73] hover:bg-[#FFF5FA]/30"
                  }`}
                >
                  Shipping
                </button>
                <button
                  onClick={() => setActiveTab("gifting")}
                  className={`py-3.5 transition-colors ${
                    activeTab === "gifting"
                      ? "bg-[#FFF5FA] text-[#E75480] border-b-2 border-[#E75480]"
                      : "text-[#7A6A73] hover:bg-[#FFF5FA]/30"
                  }`}
                >
                  Gift Box
                </button>
              </div>

              {/* Tab panels */}
              <div className="p-5 text-[11px] leading-relaxed text-[#7A6A73] font-medium text-left">
                {activeTab === "spec" && (
                  <div className="grid grid-cols-1 gap-y-2.5">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-[#D4AF37]/5 pb-1">
                        <span className="uppercase text-[#7A6A73] text-[9.5px] tracking-wider">{key}</span>
                        <span className="text-[#2C1B24] font-bold text-[9.5px] uppercase tracking-wide">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-3.5">
                    <div className="flex gap-2">
                      <Shield className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <p>All packaging is completely insulated, double-boxed, and shipped tracked within 48 hours.</p>
                    </div>
                    <div className="flex gap-2">
                      <RefreshCw className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <p>30-day exchange window if tags are intact.</p>
                    </div>
                  </div>
                )}

                {activeTab === "gifting" && (
                  <div className="space-y-3.5">
                    <div className="flex gap-2">
                      <Gift className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <p>Every piece arrives inside our gold-foil signature House of Monihar blushing drawer chest.</p>
                    </div>
                    <div className="flex gap-2">
                      <Award className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <p>Add a personalized gold-pressed lettercard during billing steps.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-[#D4AF37]/20 text-left">
            <div className="flex justify-between items-end mb-8">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Complementary Curation</span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#2C1B24]">You May Also Love</h3>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E75480] hover:text-[#2C1B24] transition-colors"
              >
                View Collection <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#FFF9FC] rounded-2xl border border-[#D4AF37]/15 overflow-hidden group shadow-sm flex flex-col justify-between luxury-card"
                >
                  <Link href={`/products/${prod.id}`} className="block relative aspect-square bg-[#FFEFF7] overflow-hidden">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                    <img
                      src={prod.images[1] || prod.images[0]}
                      alt={prod.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-[#2C1B24]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
                      <div className="px-4 py-2 bg-white/95 text-[#2C1B24] rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md flex items-center gap-1.5 backdrop-blur-sm">
                        <Eye className="w-3.5 h-3.5" /> Details
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-[#7A6A73] font-bold">{prod.category}</span>
                      <Link href={`/products/${prod.id}`} className="block">
                        <h4 className="text-[10px] font-bold text-[#2C1B24] uppercase tracking-[0.18em] line-clamp-1 group-hover:text-[#E75480] transition-colors mt-0.5">
                          {prod.name}
                        </h4>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/5 mt-2">
                      <span className="text-xs font-bold text-[#D4AF37]">₹{prod.price.toLocaleString("en-IN")}</span>
                      <span className="text-[9px] text-[#7A6A73] font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-[#D4AF37] fill-current" /> {prod.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STYLE INSPIRATION (Lookbook Grid) */}
        <section className="mt-20 pt-16 border-t border-[#D4AF37]/20 text-left space-y-8">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Pinterest Styling Lookbook</span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#2C1B24]">Aesthetic Inspiration</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lookbookImages.map((img, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#D4AF37]/15 bg-[#FFEFF7] relative group"
              >
                <div className="absolute inset-0 bg-[#2C1B24]/10 group-hover:bg-[#2C1B24]/30 z-10 transition-all" />
                <img
                  src={img}
                  alt={`Aesthetic lookbook matching category ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>
            ))}
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
