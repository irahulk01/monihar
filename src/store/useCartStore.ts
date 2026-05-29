import { create } from "zustand";
import { Product, CartItem, Coupon } from "@/types";

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  couponError: string | null;
  addItem: (product: Product, size?: string, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean; // returns true if applied, false if failed
  removeCoupon: () => void;
  clearCart: () => void;
  getTotals: () => {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    discountPercentage: 10,
    minOrderValue: 0,
    description: "10% off your first purchase!",
  },
  {
    code: "MONIHARGOLD",
    discountPercentage: 15,
    minOrderValue: 2499,
    description: "15% off orders above ₹2,499",
  },
  {
    code: "LUXURY20",
    discountPercentage: 20,
    minOrderValue: 4999,
    description: "20% off orders above ₹4,999",
  },
];

const getInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("monihar-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const getInitialCoupon = (): Coupon | null => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("monihar-coupon");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveCartToStorage = (items: CartItem[], coupon: Coupon | null) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("monihar-cart", JSON.stringify(items));
    if (coupon) {
      localStorage.setItem("monihar-coupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("monihar-coupon");
    }
  }
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: getInitialCart(),
  coupon: getInitialCoupon(),
  couponError: null,

  addItem: (product, size = "One Size", quantity = 1) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );

    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = currentItems.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updated = [...currentItems, { product, quantity, selectedSize: size }];
    }

    set({ items: updated });
    saveCartToStorage(updated, get().coupon);
    
    // Validate coupon on cart change
    get().applyCoupon(get().coupon?.code || "");
  },

  removeItem: (productId, size) => {
    const updated = get().items.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size)
    );
    set({ items: updated });
    saveCartToStorage(updated, get().coupon);

    // Validate coupon on cart change
    get().applyCoupon(get().coupon?.code || "");
  },

  updateQuantity: (productId, size, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId, size);
      return;
    }

    const updated = get().items.map((item) =>
      item.product.id === productId && item.selectedSize === size
        ? { ...item, quantity }
        : item
    );

    set({ items: updated });
    saveCartToStorage(updated, get().coupon);

    // Validate coupon on cart change
    get().applyCoupon(get().coupon?.code || "");
  },

  applyCoupon: (code) => {
    if (!code) {
      set({ couponError: null });
      return false;
    }

    const uppercaseCode = code.trim().toUpperCase();
    const couponDef = AVAILABLE_COUPONS.find((c) => c.code === uppercaseCode);

    if (!couponDef) {
      set({ coupon: null, couponError: "Invalid coupon code" });
      saveCartToStorage(get().items, null);
      return false;
    }

    // Check order subtotal
    const subtotal = get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    if (subtotal < couponDef.minOrderValue) {
      set({
        coupon: null,
        couponError: `Minimum order value of ₹${couponDef.minOrderValue.toLocaleString("en-IN")} required for this coupon`,
      });
      saveCartToStorage(get().items, null);
      return false;
    }

    set({ coupon: couponDef, couponError: null });
    saveCartToStorage(get().items, couponDef);
    return true;
  },

  removeCoupon: () => {
    set({ coupon: null, couponError: null });
    saveCartToStorage(get().items, null);
  },

  clearCart: () => {
    set({ items: [], coupon: null, couponError: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("monihar-cart");
      localStorage.removeItem("monihar-coupon");
    }
  },

  getTotals: () => {
    const items = get().items;
    const coupon = get().coupon;

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    let discount = 0;
    if (coupon && subtotal >= coupon.minOrderValue) {
      discount = Math.round((subtotal * coupon.discountPercentage) / 100 * 100) / 100;
    }

    // Free shipping on orders above ₹1,499, else ₹99. If cart empty, shipping is 0
    const shipping = subtotal === 0 ? 0 : subtotal >= 1499 ? 0 : 99;
    const total = Math.max(0, Math.round((subtotal - discount + shipping) * 100) / 100);

    return { subtotal, discount, shipping, total };
  },
}));
