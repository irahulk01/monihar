"use client";

import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Plus, Minus, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, coupon, couponError, applyCoupon, removeCoupon, getTotals } = useCartStore();
  const { addToast } = useToastStore();
  const [couponCode, setCouponCode] = useState("");

  const { subtotal, discount, shipping, total } = getTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const success = applyCoupon(couponCode);
    if (success) {
      addToast("Coupon Applied!", "success", `Discount active for code: ${couponCode.toUpperCase()}`);
      setCouponCode("");
    } else {
      addToast("Coupon Failed", "error", "The code you entered is invalid or does not meet minimum totals.");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    addToast("Coupon Removed", "info", "Discount coupon has been removed from your cart.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2E2528] z-[999] cursor-pointer"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FFF6F6] z-[1000] shadow-2xl flex flex-col border-l border-[#D4AF37]/20"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-lg md:text-xl font-semibold tracking-wide text-[#2E2528]">
                  Your Shopping Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#6B5E62] hover:text-[#D4AF37] p-1 transition-colors"
                aria-label="Close Cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-[#FDE2E4] flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#2E2528]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#6B5E62] max-w-[250px]">
                    Fill it with handpicked luxury creations from our trending collection.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[#2E2528] text-white text-xs tracking-widest uppercase font-medium hover:bg-[#D4AF37] transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4 p-3 bg-white border border-[#D4AF37]/10 rounded-lg shadow-sm"
                  >
                    <div className="w-20 h-20 bg-[#FFF6F6] rounded overflow-hidden flex-shrink-0 border border-[#D4AF37]/10 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-[#2E2528] uppercase tracking-wider line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => {
                              removeItem(item.product.id, item.selectedSize);
                              addToast("Removed from bag", "info", `${item.product.name} has been removed.`);
                            }}
                            className="text-[#6B5E62] hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-[#6B5E62] mt-0.5">
                          Size: <span className="font-semibold text-[#2E2528]">{item.selectedSize}</span> • Metal: <span className="font-semibold text-[#2E2528]">{item.product.specifications.Metal}</span>
                        </p>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-[#D4AF37]/30 rounded bg-[#FFF6F6] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            className="p-1 hover:bg-[#FDE2E4] transition-colors"
                          >
                            <Minus className="w-3 h-3 text-[#2E2528]" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#2E2528]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            className="p-1 hover:bg-[#FDE2E4] transition-colors"
                          >
                            <Plus className="w-3 h-3 text-[#2E2528]" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#D4AF37]">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {items.length > 0 && (
              <div className="bg-white border-t border-[#D4AF37]/20 p-5 space-y-4">
                {/* Coupon Code Section */}
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#FFF6F6] border border-dashed border-[#D4AF37] rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#D4AF37]" />
                      <div>
                        <span className="text-xs font-bold text-[#2E2528] tracking-wider uppercase">
                          {coupon.code}
                        </span>
                        <p className="text-[10px] text-[#6B5E62]">
                          {coupon.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-[10px] text-red-500 hover:text-red-700 underline tracking-wider uppercase font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="DISCOUNT CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full text-xs py-2 pl-3 pr-8 border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] placeholder-[#6B5E62]/60 uppercase tracking-widest font-medium"
                      />
                      <Tag className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#6B5E62]" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2E2528] text-white text-xs font-medium uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[10px] text-red-500 font-medium tracking-wide">
                    {couponError}
                  </p>
                )}

                {/* Subtotals breakdown */}
                <div className="space-y-1.5 text-xs text-[#2E2528]">
                  <div className="flex justify-between">
                    <span className="text-[#6B5E62] uppercase tracking-wide">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#D4AF37]">
                      <span className="uppercase tracking-wide">Discount</span>
                      <span className="font-semibold">-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#6B5E62] uppercase tracking-wide">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-[#D4AF37] uppercase tracking-wider font-bold text-[10px]">
                          Free
                        </span>
                      ) : (
                        `₹${shipping.toLocaleString("en-IN")}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[9px] text-[#6B5E62] text-right">
                      Add ₹{(1499 - subtotal).toLocaleString("en-IN")} more for free shipping
                    </p>
                  )}
                  <div className="h-px bg-[#D4AF37]/10 my-2" />
                  <div className="flex justify-between text-sm md:text-base font-bold text-[#2E2528]">
                    <span className="font-serif uppercase tracking-wider">Estimated Total</span>
                    <span className="text-[#D4AF37]">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Checkout Link */}
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full py-3 bg-[#2E2528] text-[#FFF6F6] text-center text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#D4AF37] transition-all duration-300 shadow-luxury"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
