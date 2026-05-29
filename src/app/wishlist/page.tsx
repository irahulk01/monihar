"use client";

import PageWrapper from "@/components/common/PageWrapper";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { Product } from "@/types";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const handleMoveToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addItem(product, product.sizes[0] || "One Size");
    toggleWishlist(product); // Remove from wishlist
    addToast("Moved to Bag", "success", `${product.name} has been moved to your shopping bag.`);
  };

  const handleRemove = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    toggleWishlist(product);
    addToast("Removed from Wishlist", "info", `${product.name} has been removed from your wishlist.`);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <span className="font-serif text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold">Your Favourites</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-[#2E2528] mt-1">
            My Wishlist
          </h1>
          <div className="gold-divider w-24 mx-auto mt-3" />
        </div>

        {items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-4 bg-white border border-[#D4AF37]/15 rounded-xl shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FFF6F6] border border-[#D4AF37]/20 flex items-center justify-center mx-auto text-[#D4AF37]">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#2E2528]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#6B5E62] leading-relaxed max-w-xs mx-auto">
                Keep track of fine jewellery you adore. Tap the heart icon on any piece to save it here.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E2528] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#D4AF37] transition-all shadow-md"
            >
              Discover Creations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-[#D4AF37]/15 overflow-hidden group shadow-sm flex flex-col justify-between luxury-card-hover text-left"
              >
                <Link href={`/products/${product.id}`} className="block relative aspect-square bg-[#FFF6F6] overflow-hidden">
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemove(e, product)}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full shadow-md bg-white/80 text-[#6B5E62] hover:text-red-500 transition-all duration-300"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Images */}
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
                </Link>

                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#6B5E62] font-semibold">
                      {product.category}
                    </span>
                    <Link href={`/products/${product.id}`} className="block">
                      <h4 className="text-xs font-semibold text-[#2E2528] uppercase tracking-widest line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                        {product.name}
                      </h4>
                    </Link>
                    <span className="text-xs font-bold text-[#D4AF37]">₹{product.price.toLocaleString("en-IN")}</span>
                  </div>

                  <button
                    onClick={(e) => handleMoveToCart(e, product)}
                    className="w-full py-2 bg-[#2E2528] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-1.5 shadow-sm mt-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
