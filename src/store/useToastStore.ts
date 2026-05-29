import { create } from "zustand";
import { Toast } from "@/types";

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"], description?: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "success", description) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type, description };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove toast after 3000ms
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
