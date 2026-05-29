"use client";

import PageWrapper from "@/components/common/PageWrapper";
import { ProductDetailSkeleton } from "@/components/common/SkeletonLoader";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Star, Share2, Shield, Gift, RefreshCw, Award } from "lucide-react";

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
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
      addToast("Link Copied", "info", "Product link copied to your clipboard. Share the luxury!");
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Premium Thumbnail and Zoom Gallery */}
          <div className="space-y-4">
            
            {/* Main Image View */}
            <div className="relative aspect-square bg-[#FFF6F6] rounded-xl overflow-hidden border border-[#D4AF37]/20 p-2 shadow-luxury flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-[#2E2528]/45 flex items-center justify-center rounded-lg">
                  <span className="bg-white text-[#2E2528] text-xs font-bold tracking-widest uppercase py-2 px-6 shadow-md rounded border border-[#D4AF37]/30">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-md overflow-hidden bg-[#FFF6F6] border p-0.5 transition-all duration-300 ${
                    selectedImage === img
                      ? "border-[#D4AF37] scale-105 shadow-sm"
                      : "border-[#D4AF37]/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${product.name} detail ${idx + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN: Selection details */}
          <div className="space-y-6 text-left">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                    {product.category} Collection
                  </span>
                  <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-[#2E2528] uppercase mt-1 leading-tight">
                    {product.name}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 border border-[#D4AF37]/25 rounded-full hover:bg-white text-[#2E2528] transition-colors"
                    aria-label="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-2 border rounded-full transition-all ${
                      hasLiked
                        ? "bg-[#D4AF37] border-[#D4AF37] text-white"
                        : "border-[#D4AF37]/25 hover:bg-white text-[#2E2528]"
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Star Ratings Summary */}
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
                <span className="text-xs font-bold text-[#2E2528]">{product.rating}</span>
                <span className="text-xs text-[#6B5E62] font-medium">
                  ({product.reviewsCount} verified reviews)
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 py-3 border-y border-[#D4AF37]/15">
              <span className="text-2xl font-bold text-[#D4AF37]">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-[#6B5E62] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="bg-[#FDE2E4] text-[#2E2528] text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-[#D4AF37]/15">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-[#6B5E62] leading-relaxed font-sans tracking-wide">
              {product.description} Handcrafted with extreme focus and modern aesthetics, this curation reflects luxury and premium elegance tailored to look stunning on the modern woman.
            </p>

            {/* Ring / Bracelet sizes */}
            {product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-[#2E2528]">
                  <span className="font-bold uppercase tracking-wider">Select Size</span>
                  <button className="text-[10px] text-[#6B5E62] hover:text-[#D4AF37] underline tracking-widest uppercase font-semibold">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-10 h-10 text-xs font-bold uppercase rounded-full border transition-all duration-300 flex items-center justify-center ${
                        selectedSize === sz
                          ? "bg-[#2E2528] border-[#2E2528] text-[#FFF6F6] scale-105 shadow-sm"
                          : "border-[#D4AF37]/20 bg-white text-[#2E2528] hover:border-[#D4AF37]"
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
                  <div className="flex items-center border border-[#D4AF37]/30 rounded-lg bg-[#FFF6F6] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-3.5 hover:bg-[#FDE2E4] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-[#2E2528]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-3.5 hover:bg-[#FDE2E4] transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-grow py-3.5 bg-[#2E2528] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-luxury"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 bg-[#6B5E62] text-white/50 text-xs font-semibold uppercase tracking-widest cursor-not-allowed text-center"
                >
                  Temporarily Sold Out
                </button>
              )}
            </div>

            {/* Premium details accordion tab */}
            <div className="border border-[#D4AF37]/15 rounded-lg overflow-hidden bg-white shadow-sm mt-8">
              {/* Tab Header selectors */}
              <div className="grid grid-cols-3 text-center border-b border-[#D4AF37]/10 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab("spec")}
                  className={`py-3 transition-colors ${
                    activeTab === "spec"
                      ? "bg-[#FFF6F6] text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-[#6B5E62] hover:bg-[#FFF6F6]/30"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`py-3 transition-colors ${
                    activeTab === "shipping"
                      ? "bg-[#FFF6F6] text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-[#6B5E62] hover:bg-[#FFF6F6]/30"
                  }`}
                >
                  Shipping & Returns
                </button>
                <button
                  onClick={() => setActiveTab("gifting")}
                  className={`py-3 transition-colors ${
                    activeTab === "gifting"
                      ? "bg-[#FFF6F6] text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-[#6B5E62] hover:bg-[#FFF6F6]/30"
                  }`}
                >
                  Gifting Options
                </button>
              </div>

              {/* Tab Content panels */}
              <div className="p-4 text-xs leading-relaxed text-[#6B5E62]">
                {activeTab === "spec" && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-medium">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-[#D4AF37]/5 pb-1">
                        <span className="uppercase text-[#2E2528]/80 text-[10px] tracking-wider">{key}</span>
                        <span className="text-[#2E2528] text-[10px] text-right font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-2 text-left">
                    <div className="flex gap-2">
                      <Shield className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <p><strong>Insured Delivery:</strong> All orders are packed in fully secure, tamper-proof premium packages, insured from our door to yours.</p>
                    </div>
                    <div className="flex gap-2">
                      <RefreshCw className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <p><strong>30-Day returns:</strong> Unworn items with tags attached can be returned easily within 30 days for complimentary exchanges.</p>
                    </div>
                  </div>
                )}

                {activeTab === "gifting" && (
                  <div className="space-y-2 text-left">
                    <div className="flex gap-2">
                      <Gift className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <p><strong>Complimentary Signature Box:</strong> Every item arrives housed inside our luxurious pink & gold Monihar signature jewellery case.</p>
                    </div>
                    <div className="flex gap-2">
                      <Award className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <p><strong>Gifting Note:</strong> Add a personalized, gold-pressed gift note during checkout for an extremely premium unboxing surprise.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* CUSTOMER REVIEWS LIST */}
        <section className="bg-white border border-[#D4AF37]/15 rounded-xl p-6 md:p-8 mt-16 text-left">
          <h3 className="font-serif text-lg md:text-xl font-bold text-[#2E2528] uppercase tracking-wider mb-6 pb-2 border-b border-[#D4AF37]/10">
            Patron Reviews
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#D4AF37]/10 mb-8 items-center">
            {/* Stats summary */}
            <div className="space-y-1">
              <span className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37]">{product.rating}</span>
              <p className="text-xs uppercase font-bold tracking-widest text-[#2E2528]">Out of 5 Stars</p>
              <div className="flex text-[#D4AF37] pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <p className="text-xs text-[#6B5E62] leading-relaxed">
                Our reviews are compiled from actual verified buyers who have purchased and enjoyed our handpicked creations. Monihar commits to standard premium quality in every gold-pressed item.
              </p>
            </div>
          </div>

          {/* List of reviews */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, rIdx) => {
              const name = ["Seraphina K.", "Isabella D.", "Nila Mukhopadhyay"][rIdx];
              const date = ["May 24, 2026", "May 18, 2026", "April 29, 2026"][rIdx];
              const content = [
                "Absolutely breathtaking ring. The 18k solid gold finish has an incredible weight and luster. Size fits exactly according to the guide.",
                "Fast shipping and gorgeous soft pink signature presentation. The akoya pearls are matched brilliantly with amazing depth.",
                "Handcrafted luxury indeed. Monihar is my new go-to brand for layering necklaces. Compliments received on day one!"
              ][rIdx];
              return (
                <div key={rIdx} className="space-y-2 border-b border-[#D4AF37]/5 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#2E2528] uppercase tracking-wider">{name}</h4>
                      <div className="flex text-[#D4AF37] mt-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#6B5E62] font-semibold">{date}</span>
                  </div>
                  <p className="text-xs text-[#6B5E62] leading-relaxed font-sans">{content}</p>
                </div>
              );
            })}
          </div>

        </section>

      </div>
    </PageWrapper>
  );
}
