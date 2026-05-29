"use client";

import PageWrapper from "@/components/common/PageWrapper";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Package, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { CartItem } from "@/types";

interface OrderData {
  orderId: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  couponCode: string | null;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    pinCode: string;
    phone: string;
    email: string;
  };
  deliveryDate: string;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("monihar-last-order");
      if (saved) {
        setOrder(JSON.parse(saved));
      } else {
        router.replace("/products");
      }
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37]/35 border-t-[#D4AF37] animate-spin" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#2E2528]">Loading Order Details...</span>
        </div>
      </PageWrapper>
    );
  }

  if (!order) return null;

  const timelineSteps = [
    { label: "Order Placed", desc: "Your secure transaction is completed", done: true, current: false },
    { label: "Handcrafting", desc: "Expert jewellers preparing your curate", done: false, current: true },
    { label: "Packaging", desc: "Housed in our premium blush & gold signature box", done: false, current: false },
    { label: "Shipped", desc: "Insured transport tracking dispatched", done: false, current: false },
    { label: "Delivered", desc: "Estimated by " + order.deliveryDate.split(",")[1]?.trim(), done: false, current: false },
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
        
        {/* Success Header banner */}
        <div className="bg-white border border-[#D4AF37]/20 rounded-2xl p-6 md:p-10 shadow-luxury text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#FFF6F6] border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Simulation Complete
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-[#2E2528] uppercase">
              Your Fake Order is Placed!
            </h1>
            <p className="text-xs text-[#6B5E62] font-semibold uppercase tracking-wider">
              Order ID: <span className="text-[#D4AF37] font-bold">{order.orderId}</span>
            </p>
          </div>
          <p className="text-xs text-[#6B5E62] leading-relaxed max-w-md mx-auto">
            A mock confirmation receipt has been dispatched. This is a shopping simulation—no real currency has been charged, and your fake order is now recorded.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Progress Tracking and Address (7 Columns) */}
          <div className="md:col-span-7 space-y-8">
            
            {/* Tracking Progress timeline */}
            <div className="bg-white border border-[#D4AF37]/15 p-6 rounded-xl shadow-sm space-y-6">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#2E2528] flex items-center gap-2 border-b border-[#D4AF37]/10 pb-3">
                <Package className="w-5 h-5 text-[#D4AF37]" /> Track Your Curate
              </h3>

              {/* Timeline list */}
              <div className="relative pl-6 border-l-2 border-[#D4AF37]/20 space-y-6 ml-3">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle status indicators */}
                    <div
                      className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                        step.done
                          ? "bg-[#D4AF37] border-[#D4AF37]"
                          : step.current
                          ? "bg-white border-[#D4AF37] animate-ping"
                          : "bg-white border-[#D4AF37]/30"
                      }`}
                    />
                    <div
                      className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                        step.done
                          ? "bg-[#D4AF37] border-[#D4AF37]"
                          : step.current
                          ? "bg-white border-[#D4AF37]"
                          : "bg-white border-[#D4AF37]/30"
                      }`}
                    />

                    <div>
                      <h4
                        className={`text-xs font-bold uppercase tracking-wider ${
                          step.done || step.current ? "text-[#2E2528]" : "text-[#6B5E62]/75"
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-[#6B5E62] mt-0.5 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping details */}
            <div className="bg-white border border-[#D4AF37]/15 p-6 rounded-xl shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#2E2528] flex items-center gap-2 border-b border-[#D4AF37]/10 pb-3">
                <MapPin className="w-5 h-5 text-[#D4AF37]" /> Shipping Destination
              </h3>

              <div className="text-xs text-[#6B5E62] space-y-1.5 font-medium">
                <p className="text-[#2E2528] font-bold uppercase tracking-wide">
                  {order.shippingAddress.name}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, PIN Code: {order.shippingAddress.pinCode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>

              <div className="flex gap-3 items-start p-3 bg-[#FFF6F6] border border-[#D4AF37]/15 rounded-lg text-xs leading-relaxed text-[#6B5E62] mt-4">
                <Calendar className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#2E2528]">
                    Estimated Luxury Delivery
                  </span>
                  <p className="font-bold text-[#D4AF37] mt-0.5">{order.deliveryDate}</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order summary details (5 Columns) */}
          <div className="md:col-span-5 space-y-6">
            
            <div className="bg-white border border-[#D4AF37]/15 p-6 rounded-xl shadow-sm space-y-6">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#2E2528] border-b border-[#D4AF37]/10 pb-3">
                Order Receipt
              </h3>

              {/* Items List */}
              <div className="space-y-4">
                {order.items.map((item: CartItem) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex justify-between items-center text-xs gap-4 border-b border-[#D4AF37]/5 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex gap-2">
                      <div className="w-10 h-10 bg-[#FFF6F6] border border-[#D4AF37]/10 rounded overflow-hidden flex-shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-[#2E2528] uppercase line-clamp-1 max-w-[140px]">
                          {item.product.name}
                        </span>
                        <span className="block text-[9px] text-[#6B5E62] mt-0.5 font-medium">
                          Size: {item.selectedSize} • Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-[#2E2528]">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing details */}
              <div className="space-y-2 text-xs text-[#2E2528] pt-2 border-t border-[#D4AF37]/10">
                <div className="flex justify-between">
                  <span className="text-[#6B5E62] uppercase tracking-wide">Subtotal</span>
                  <span className="font-semibold">₹{order.totals.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span className="uppercase tracking-wide">Discount ({order.couponCode})</span>
                    <span className="font-semibold">-₹{order.totals.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#6B5E62] uppercase tracking-wide">Shipping</span>
                  <span className="font-semibold">
                    {order.totals.shipping === 0 ? (
                      <span className="text-[#D4AF37] uppercase tracking-wider font-bold text-[9px]">
                        Free
                      </span>
                    ) : (
                      `₹${order.totals.shipping.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>
                
                <div className="h-px bg-[#D4AF37]/10 my-2" />
                
                <div className="flex justify-between text-sm md:text-base font-bold text-[#2E2528]">
                  <span className="font-serif uppercase tracking-wider">Paid Amount</span>
                  <span className="text-[#D4AF37]">₹{order.totals.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Continue button */}
              <Link
                href="/products"
                className="block w-full py-3 bg-[#2E2528] text-white text-center text-xs font-semibold uppercase tracking-[0.25em] hover:bg-[#D4AF37] transition-all shadow-md"
              >
                Continue Shopping
              </Link>
            </div>

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
