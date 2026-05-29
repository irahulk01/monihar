export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewsCount: number;
  material: string;
  metalColor: string;
  description: string;
  inStock: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  images: string[];
  sizes: string[];
  specifications: {
    Metal: string;
    Finish: string;
    "Metal Color": string;
    "Stone Type"?: string;
    "Carat Weight"?: string;
    "Pearl Grade"?: string;
    Weight: string;
    Width: string;
    [key: string]: string | undefined;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minOrderValue: number;
  description: string;
}

export interface Toast {
  id: string;
  message: string;
  description?: string;
  type: "success" | "error" | "info";
  duration?: number;
}
