"use client";

import PageWrapper from "@/components/common/PageWrapper";
import { ProductGridSkeleton } from "@/components/common/SkeletonLoader";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Heart, ShoppingBag, Search, Star, Filter, X, ChevronDown } from "lucide-react";
import Link from "next/link";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const addToast = useToastStore((state) => state.addToast);

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get("material") || "");
  const [selectedRating, setSelectedRating] = useState(searchParams.get("rating") || "0");
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "featured");

  const categories = ["Rings", "Earrings", "Necklaces", "Bracelets", "Anklets", "Sets", "Men's Collection"];
  const materials = ["Gold", "Silver", "Platinum", "Diamond", "Pearl"];

  // 1. Debounce text search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Sync URL search queries
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
      setDebouncedSearch(urlSearch);
    }
    const urlCategory = searchParams.get("category") || "";
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
    const urlMaterial = searchParams.get("material") || "";
    if (urlMaterial !== selectedMaterial) {
      setSelectedMaterial(urlMaterial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 2. Fetch Products on filters modification
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (debouncedSearch) query.append("search", debouncedSearch);
        if (selectedCategory) query.append("category", selectedCategory);
        if (priceMin) query.append("priceMin", priceMin);
        if (priceMax) query.append("priceMax", priceMax);
        if (selectedMaterial) query.append("material", selectedMaterial);
        if (selectedRating !== "0") query.append("rating", selectedRating);
        query.append("sort", selectedSort);
        query.append("limit", "100"); // Load a larger batch for smooth filtering

        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          setProducts(data.products);
          setTotalCount(data.total);
        }
      } catch (err) {
        console.error("Failed to fetch filtered products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [debouncedSearch, selectedCategory, priceMin, priceMax, selectedMaterial, selectedRating, selectedSort]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addItem(product, product.sizes[0] || "One Size");
    addToast("Added to Bag", "success", `${product.name} has been added to your shopping bag.`);
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const added = toggleWishlist(product);
    if (added) {
      addToast("Added to Wishlist", "success", `${product.name} has been added to your wishlist.`);
    } else {
      addToast("Removed from Wishlist", "info", `${product.name} was removed from your wishlist.`);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setPriceMin("");
    setPriceMax("");
    setSelectedMaterial("");
    setSelectedRating("0");
    setSelectedSort("featured");
    router.replace("/products");
    addToast("Filters Cleared", "info", "All search and category filters have been reset.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      
      {/* Page Title */}
      <div className="text-center mb-10 text-left">
        <span className="font-serif text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold">Monihar Curation</span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-[#2E2528] mt-1">
          Our Exquisite Collections
        </h1>
        <p className="text-xs text-[#6B5E62] uppercase tracking-widest font-semibold mt-1">
          Showing {totalCount} exquisite fashion jewellery pieces
        </p>
      </div>

      {/* Controls Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white border border-[#D4AF37]/15 rounded-lg mb-8 shadow-sm">
        
        {/* Search bar */}
        <div className="relative w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search our curation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-2.5 pl-4 pr-10 border border-[#D4AF37]/35 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] rounded text-[#2E2528] uppercase tracking-wider font-semibold placeholder-[#6B5E62]/40"
          />
          <Search className="absolute right-3 top-3 w-4 h-4 text-[#6B5E62]" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#FFF6F6] border border-[#D4AF37]/25 rounded text-xs font-bold uppercase tracking-wider text-[#2E2528] hover:border-[#D4AF37] transition-all flex-grow justify-center"
          >
            <Filter className="w-4 h-4 text-[#D4AF37]" /> Filters
          </button>

          {/* Sort selection */}
          <div className="relative flex-grow md:flex-grow-0">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full md:w-48 appearance-none text-xs py-2.5 pl-4 pr-10 border border-[#D4AF37]/35 focus:border-[#D4AF37] focus:outline-none bg-[#FFF6F6] rounded text-[#2E2528] uppercase tracking-widest font-bold"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
              <option value="trending">Trending First</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-3.5 h-3.5 text-[#2E2528] pointer-events-none" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block space-y-6 text-left">
          
          <div className="flex justify-between items-center pb-4 border-b border-[#D4AF37]/25">
            <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-[#2E2528]">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-[10px] text-[#6B5E62] hover:text-[#D4AF37] underline tracking-wider uppercase font-semibold"
            >
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Categories</h4>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                  className={`text-left text-xs py-1 px-2 rounded tracking-wide font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-[#2E2528] text-white pl-3 font-semibold border-l-2 border-[#D4AF37]"
                      : "text-[#6B5E62] hover:text-[#D4AF37] hover:bg-[#FFF6F6]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Price Limit (₹)</h4>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="MIN"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full text-xs p-2 border border-[#D4AF37]/25 bg-white text-[#2E2528] placeholder-[#6B5E62]/40 uppercase tracking-widest font-bold focus:border-[#D4AF37] focus:outline-none"
              />
              <input
                type="number"
                placeholder="MAX"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full text-xs p-2 border border-[#D4AF37]/25 bg-white text-[#2E2528] placeholder-[#6B5E62]/40 uppercase tracking-widest font-bold focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Metal / Material</h4>
            <div className="flex flex-col gap-2">
              {materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(selectedMaterial === mat ? "" : mat)}
                  className={`text-left text-xs py-1 px-2 rounded tracking-wide font-medium transition-all ${
                    selectedMaterial === mat
                      ? "bg-[#2E2528] text-white pl-3 font-semibold border-l-2 border-[#D4AF37]"
                      : "text-[#6B5E62] hover:text-[#D4AF37] hover:bg-[#FFF6F6]"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Minimum Rating</h4>
            <div className="flex flex-col gap-2">
              {["0", "4.2", "4.5", "4.8"].map((rat) => (
                <button
                  key={rat}
                  onClick={() => setSelectedRating(rat)}
                  className={`text-left text-xs py-1 px-2 rounded tracking-wide font-medium transition-all flex items-center gap-1.5 ${
                    selectedRating === rat
                      ? "bg-[#2E2528] text-white pl-3 font-semibold border-l-2 border-[#D4AF37]"
                      : "text-[#6B5E62] hover:text-[#D4AF37] hover:bg-[#FFF6F6]"
                  }`}
                >
                  {rat === "0" ? (
                    "All Ratings"
                  ) : (
                    <>
                      <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" /> {rat} & Above
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* PRODUCTS GRID AREA */}
        <div className="lg:col-span-3">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="bg-white border border-[#D4AF37]/15 rounded-xl p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF6F6] border border-[#D4AF37]/20 flex items-center justify-center mx-auto text-[#D4AF37]">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg md:text-xl font-bold text-[#2E2528]">No Products Found</h3>
              <p className="text-xs text-[#6B5E62] max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any premium pieces matching your criteria. Try adjusting your filters or clearing search keys.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-[#2E2528] text-white text-xs font-medium uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => {
                const hasLiked = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-[#D4AF37]/15 overflow-hidden group shadow-sm flex flex-col justify-between luxury-card-hover text-left"
                  >
                    <Link href={`/products/${product.id}`} className="block relative aspect-square bg-[#FFF6F6] overflow-hidden">
                      {/* Wishlist toggle */}
                      <button
                        onClick={(e) => handleToggleWishlist(e, product)}
                        className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
                          hasLiked ? "bg-[#D4AF37] text-white" : "bg-white/80 text-[#6B5E62] hover:text-[#D4AF37]"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
                      </button>

                      {/* Image hover swaps */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0 animate-fade-in"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[1] || product.images[0]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />

                      {!product.inStock && (
                        <div className="absolute inset-0 bg-[#2E2528]/40 flex items-center justify-center z-10">
                          <span className="bg-white text-[#2E2528] text-[9px] font-bold tracking-widest uppercase py-1 px-3 shadow-md rounded border border-[#D4AF37]/30">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-[#6B5E62] font-semibold">
                          {product.category}
                        </span>
                        <Link href={`/products/${product.id}`} className="block">
                          <h4 className="text-xs font-semibold text-[#2E2528] uppercase tracking-widest line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                            {product.name}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                          <span className="text-[10px] font-bold text-[#2E2528]">{product.rating}</span>
                          <span className="text-[10px] text-[#6B5E62] font-medium">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/5 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#D4AF37]">₹{product.price.toLocaleString("en-IN")}</span>
                          {product.originalPrice && (
                            <span className="text-[9px] text-[#6B5E62] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                          )}
                        </div>

                        {product.inStock && (
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="p-2 bg-[#FFF6F6] border border-[#D4AF37]/20 rounded-full hover:bg-[#2E2528] hover:text-white transition-all text-[#2E2528]"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* MOBILE FULL-SCREEN FILTERS DIALOG */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-[#2E2528] bg-opacity-50 z-[1000] lg:hidden flex justify-end">
          <div className="w-full max-w-sm bg-[#FFF6F6] h-full p-6 flex flex-col justify-between overflow-y-auto border-l border-[#D4AF37]/20">
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center pb-4 border-b border-[#D4AF37]/15">
                <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-[#2E2528]">Refine Search</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-[#6B5E62] p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                      className={`text-xs py-1.5 px-3 rounded-full border transition-all ${
                        selectedCategory === cat
                          ? "bg-[#2E2528] border-[#2E2528] text-white font-bold"
                          : "border-[#D4AF37]/20 text-[#6B5E62] bg-white hover:border-[#D4AF37]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Limits */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Price Limit (₹)</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="MIN"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full text-xs p-2 border border-[#D4AF37]/25 bg-white text-[#2E2528] uppercase tracking-widest font-bold"
                  />
                  <input
                    type="number"
                    placeholder="MAX"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full text-xs p-2 border border-[#D4AF37]/25 bg-white text-[#2E2528] uppercase tracking-widest font-bold"
                  />
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Materials</h4>
                <div className="flex flex-wrap gap-2">
                  {materials.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(selectedMaterial === mat ? "" : mat)}
                      className={`text-xs py-1.5 px-3 rounded-full border transition-all ${
                        selectedMaterial === mat
                          ? "bg-[#2E2528] border-[#2E2528] text-white font-bold"
                          : "border-[#D4AF37]/20 text-[#6B5E62] bg-white hover:border-[#D4AF37]"
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Minimum Rating</h4>
                <div className="flex flex-col gap-2">
                  {["0", "4.2", "4.5", "4.8"].map((rat) => (
                    <button
                      key={rat}
                      onClick={() => setSelectedRating(rat)}
                      className={`text-left text-xs py-2 px-3 border border-[#D4AF37]/10 bg-white rounded tracking-wide font-medium flex items-center gap-1.5 ${
                        selectedRating === rat
                          ? "bg-[#2E2528] text-white font-semibold"
                          : "text-[#6B5E62]"
                      }`}
                    >
                      {rat === "0" ? "All Ratings" : `${rat} & Above`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#D4AF37]/15 flex gap-2">
              <button
                onClick={clearFilters}
                className="w-1/2 py-2.5 border border-[#2E2528] text-[#2E2528] text-xs font-bold uppercase tracking-widest hover:bg-[#2E2528] hover:text-white transition-all"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-[#2E2528] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <PageWrapper>
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37]/35 border-t-[#D4AF37] animate-spin mx-auto" />
        </div>
      }>
        <ProductsPageContent />
      </Suspense>
    </PageWrapper>
  );
}
