"use client";

import PageWrapper from "@/components/common/PageWrapper";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, CreditCard, Landmark, ArrowRight, Smartphone, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon, clearCart, getTotals } = useCartStore();
  const { addToast } = useToastStore();

  const { subtotal, discount, shipping, total } = getTotals();

  // Form States
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [phone, setPhone] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("upi");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  // Loading sequences
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Contacting premium payment gateway...",
    "Securing transaction with end-to-end 256-bit encryption...",
    "Validating your luxury voucher discount...",
    "Finalizing order details and handcrafting receipt...",
  ];

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isProcessing, loadingMessages.length]);

  // Prevent accessing checkout if cart is empty
  useEffect(() => {
    if (!isProcessing && items.length === 0) {
      router.replace("/products");
    }
  }, [items, router, isProcessing]);

  if (items.length === 0 && !isProcessing) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validations
    if (!email || !firstName || !lastName || !address || !city || !pinCode || !phone) {
      addToast("Missing Fields", "error", "Please fill in all shipping details.");
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCvv)) {
      addToast("Card Details Missing", "error", "Please complete your credit card fields.");
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      addToast("UPI ID Missing", "error", "Please complete your UPI ID field.");
      return;
    }

    // Trigger secure payment simulation
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Compile final order specifications
      const orderId = `MH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderData = {
        orderId,
        items: [...items],
        totals: { subtotal, discount, shipping, total },
        couponCode: coupon?.code || null,
        shippingAddress: {
          name: `${firstName} ${lastName}`,
          address,
          city,
          pinCode,
          phone,
          email,
        },
        deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      // 2. Persist order details in localStorage for receipt retrieval
      if (typeof window !== "undefined") {
        localStorage.setItem("monihar-last-order", JSON.stringify(orderData));
      }

      // 3. Clear cart stores
      clearCart();

      // 4. Redirect to order success
      setIsProcessing(false);
      router.push("/success");
    }, 2800);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        
        {/* Page Title */}
        <div className="text-center mb-10 text-left">
          <span className="font-serif text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold">Secure Gateway</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-[#2E2528] mt-1">
            Checkout Details
          </h1>
          <div className="gold-divider w-24 mx-auto mt-3" />
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 text-left">
          
          {/* LEFT PANEL: Shipping & Payment Forms (7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Shipping Address */}
            <div className="bg-white border border-[#D4AF37]/15 p-6 rounded-xl shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#2E2528] flex items-center gap-2 border-b border-[#D4AF37]/10 pb-3">
                <Truck className="w-5 h-5 text-[#D4AF37]" /> Shipping Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-wider rounded font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-wider rounded font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-wider rounded font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-wider rounded font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">Delivery Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street Address, Apartment, Suite"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-wider rounded font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-wider rounded font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-wider rounded font-medium"
                  />
                </div>
              </div>

            </div>

            {/* Payment Details */}
            <div className="bg-white border border-[#D4AF37]/15 p-6 rounded-xl shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#2E2528] flex items-center gap-2 border-b border-[#D4AF37]/10 pb-3">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" /> Payment Gateway
              </h3>

              {/* Payment selector row */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`py-3 rounded-lg border text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-1.5 transition-all duration-300 ${
                    paymentMethod === "upi"
                      ? "bg-[#2E2528] border-[#2E2528] text-white"
                      : "border-[#D4AF37]/20 hover:border-[#D4AF37] bg-[#FFF6F6] text-[#2E2528]"
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> UPI
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`py-3 rounded-lg border text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-1.5 transition-all duration-300 ${
                    paymentMethod === "card"
                      ? "bg-[#2E2528] border-[#2E2528] text-white"
                      : "border-[#D4AF37]/20 hover:border-[#D4AF37] bg-[#FFF6F6] text-[#2E2528]"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`py-3 rounded-lg border text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-1.5 transition-all duration-300 ${
                    paymentMethod === "netbanking"
                      ? "bg-[#2E2528] border-[#2E2528] text-white"
                      : "border-[#D4AF37]/20 hover:border-[#D4AF37] bg-[#FFF6F6] text-[#2E2528]"
                  }`}
                >
                  <Landmark className="w-4 h-4" /> Net Banking
                </button>
              </div>

              {/* Dynamic Payment Fields */}
              {paymentMethod === "card" && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">Credit Card Number *</label>
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-widest rounded font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">Expiration Date *</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-widest rounded font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">CVV *</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-widest rounded font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-1 pt-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">UPI Virtual Address *</label>
                  <input
                    type="text"
                    placeholder="username@bankname"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-wider rounded font-semibold"
                  />
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="space-y-3 pt-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E62]">Select Your Bank *</label>
                  <select
                    className="w-full text-xs p-2.5 border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] text-[#2E2528] tracking-wider rounded font-semibold"
                    defaultValue="sbi"
                  >
                    <option value="sbi">State Bank of India (SBI)</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="pnb">Punjab National Bank (PNB)</option>
                  </select>
                  <p className="text-[10px] text-[#6B5E62] italic mt-1">
                    You will be redirected securely to your bank&apos;s portal to authorize the payment.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* RIGHT PANEL: Checkout Order Summary (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border border-[#D4AF37]/15 p-6 rounded-xl shadow-sm space-y-6 sticky top-28">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#2E2528] border-b border-[#D4AF37]/10 pb-3">
                Order Review
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-56 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex justify-between items-center text-xs gap-4 border-b border-[#D4AF37]/5 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-[#FFF6F6] border border-[#D4AF37]/10 rounded overflow-hidden flex-shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-[#2E2528] uppercase line-clamp-1">
                          {item.product.name}
                        </span>
                        <span className="block text-[9px] text-[#6B5E62] mt-0.5">
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

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-[#2E2528] pt-2 border-t border-[#D4AF37]/10">
                <div className="flex justify-between">
                  <span className="text-[#6B5E62] uppercase tracking-wide">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span className="uppercase tracking-wide">Coupon Discount ({coupon?.code})</span>
                    <span className="font-semibold">-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#6B5E62] uppercase tracking-wide">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-[#D4AF37] uppercase tracking-wider font-bold text-[10px]">
                        Complimentary
                      </span>
                    ) : (
                      `₹${shipping.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>
                
                <div className="h-px bg-[#D4AF37]/10 my-3" />
                
                <div className="flex justify-between text-base font-bold text-[#2E2528]">
                  <span className="font-serif uppercase tracking-wider">Estimated Total</span>
                  <span className="text-[#D4AF37] text-lg">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#2E2528] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-2 shadow-luxury"
              >
                Place Secure Order <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-[#6B5E62] text-center italic">
                By clicking Place Secure Order, you authorize this transaction as part of a premium shopping simulation. No real money will be charged.
              </p>
            </div>

          </div>

        </form>

      </div>

      {/* SECURE LOADING MODAL OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[9999] bg-[#FFF6F6]/95 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            
            {/* Custom spinner */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
              <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <div className="space-y-2">
              <span className="font-serif text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold animate-pulse">
                Securing Transaction
              </span>
              
              <h3 className="font-serif text-lg md:text-xl font-bold tracking-wide text-[#2E2528]">
                Processing Premium Order
              </h3>
            </div>

            {/* Micro loading step messages */}
            <div className="h-10 flex items-center justify-center px-4">
              <p className="text-xs text-[#6B5E62] font-semibold uppercase tracking-wider animate-fade-in text-center max-w-sm">
                {loadingMessages[loadingStep]}
              </p>
            </div>

          </div>
        </div>
      )}

    </PageWrapper>
  );
}
