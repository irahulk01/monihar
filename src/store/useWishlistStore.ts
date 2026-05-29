import { create } from "zustand";
import { Product } from "@/types";

interface WishlistStore {
  items: Product[];
  toggleWishlist: (product: Product) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
}

const getInitialWishlist = (): Product[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("monihar-wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: getInitialWishlist(),
  toggleWishlist: (product) => {
    const currentItems = get().items;
    const exists = currentItems.some((item) => item.id === product.id);
    let updated: Product[];
    let added = false;

    if (exists) {
      updated = currentItems.filter((item) => item.id !== product.id);
    } else {
      updated = [...currentItems, product];
      added = true;
    }

    set({ items: updated });
    if (typeof window !== "undefined") {
      localStorage.setItem("monihar-wishlist", JSON.stringify(updated));
    }
    return added;
  },
  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },
}));
