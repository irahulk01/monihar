"use client";

import PageWrapper from "@/components/common/PageWrapper";
import { ProductGridSkeleton } from "@/components/common/SkeletonLoader";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense, useRef } from "react";
import { Heart, ShoppingBag, Search, Star, Filter, X, ChevronDown, Eye } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

  // Dynamic Scroll Squeeze & Expand States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Trigger Squeeze on Scroll down
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 180;
      setIsScrolled(scrolled);
      if (!scrolled) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Collapse Search box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Debounce text search query (300ms)
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

  // Fetch Products on filters modification
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
        query.append("limit", "100");

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative select-none">
      
      {/* Editorial Page Header */}
      <div className="text-left space-y-2 mb-12 border-b border-[#D4AF37]/15 pb-8">
        <span className="font-serif text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-bold">Monihar Curation</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide text-[#2C1B24]">
          Our Exquisite Collections
        </h1>
        <p className="text-[10px] text-[#7A6A73] uppercase tracking-[0.25em] font-bold">
          Showing {totalCount} exquisite fashion jewellery designs
        </p>
      </div>

      {/* Premium Controls Header */}
      <div
        ref={headerRef}
        onClick={() => { if (isScrolled && !isExpanded) setIsExpanded(true); }}
        className={`sticky top-[78px] z-[40] flex transition-all duration-500 ease-in-out bg-[#FFF9FC]/95 backdrop-blur-md border border-[#D4AF37]/20 rounded-xl mb-12 shadow-sm relative ${
          isScrolled && !isExpanded
            ? "lg:w-[23%] lg:max-w-[280px] lg:mr-auto rounded-r-none border-r-0 cursor-pointer hover:bg-[#FFEFF7]/60 flex-col items-stretch gap-3 p-3.5"
            : "w-full flex-col md:flex-row items-center justify-between gap-6 p-4 md:px-6"
        }`}
      >
        {isScrolled && !isExpanded && (
          <div className="text-[8px] font-bold text-[#E75480] uppercase tracking-[0.25em] text-center border-b border-[#D4AF37]/15 pb-1 select-none animate-pulse">
            ✦ Expand Search & Sort ✦
          </div>
        )}

        {isScrolled && isExpanded && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
            className="absolute -top-2.5 -right-2.5 p-2 bg-[#2C1B24] text-white rounded-full hover:bg-[#E75480] transition-all shadow-md z-[50]"
            aria-label="Collapse search box"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        
        {/* Minimal Search Bar */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search our curation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-3 pl-4 pr-12 border border-[#D4AF37]/25 focus:border-[#E75480] focus:outline-none bg-[#FFF5FA] rounded uppercase tracking-widest font-semibold placeholder-[#7A6A73]/35"
          />
          <Search className="absolute right-4 top-3.5 w-4.5 h-4.5 text-[#7A6A73]" />
        </div>

        <div className={`flex items-center gap-4 w-full justify-end ${
          isScrolled && !isExpanded ? "w-full" : "md:w-auto"
        }`}>
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-5 py-3 bg-[#FFF5FA] border border-[#D4AF37]/25 rounded text-xs font-bold uppercase tracking-[0.2em] text-[#2C1B24] hover:border-[#E75480] transition-all flex-grow justify-center"
          >
            <Filter className="w-4.5 h-4.5 text-[#D4AF37]" /> Refine
          </button>

          {/* Sort Selection Menu */}
          <div className={`relative flex-grow ${
            isScrolled && !isExpanded ? "w-full" : "md:flex-grow-0"
          }`}>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className={`w-full appearance-none text-[10px] py-3.5 pl-4 pr-12 border border-[#D4AF37]/25 focus:border-[#E75480] focus:outline-none bg-[#FFF5FA] rounded text-[#2C1B24] uppercase tracking-[0.2em] font-bold ${
                isScrolled && !isExpanded ? "w-full" : "md:w-52"
              }`}
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
              <option value="trending">Trending First</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-[#2C1B24] pointer-events-none" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside
          className={`hidden lg:block space-y-8 text-left border-r border-[#D4AF37]/15 pr-8 sticky transition-all duration-500 overflow-y-auto scrollbar-none pb-8 ${
            isScrolled && !isExpanded
              ? "top-[270px] max-h-[calc(100vh-290px)]"
              : "top-[165px] max-h-[calc(100vh-195px)]"
          }`}
        >
          
          <div className="flex justify-between items-center pb-4 border-b border-[#D4AF37]/25">
            <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-[#2C1B24]">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-[9px] text-[#7A6A73] hover:text-[#E75480] underline tracking-widest uppercase font-bold"
            >
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Categories</h4>
            <div className="flex flex-col gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                  className={`text-left text-xs py-1 px-2.5 rounded tracking-wide font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-[#2C1B24] text-white pl-4 font-semibold border-l-2 border-[#D4AF37]"
                      : "text-[#7A6A73] hover:text-[#E75480] hover:bg-[#FFF5FA]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Price Limit (₹)</h4>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="MIN"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full text-xs p-2.5 border border-[#D4AF37]/25 bg-white text-[#2C1B24] placeholder-[#7A6A73]/35 uppercase tracking-widest font-bold focus:border-[#E75480] focus:outline-none"
              />
              <input
                type="number"
                placeholder="MAX"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full text-xs p-2.5 border border-[#D4AF37]/25 bg-white text-[#2C1B24] placeholder-[#7A6A73]/35 uppercase tracking-widest font-bold focus:border-[#E75480] focus:outline-none"
              />
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Material</h4>
            <div className="flex flex-col gap-2.5">
              {materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(selectedMaterial === mat ? "" : mat)}
                  className={`text-left text-xs py-1 px-2.5 rounded tracking-wide font-medium transition-all ${
                    selectedMaterial === mat
                      ? "bg-[#2C1B24] text-white pl-4 font-semibold border-l-2 border-[#D4AF37]"
                      : "text-[#7A6A73] hover:text-[#E75480] hover:bg-[#FFF5FA]"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Rating Range</h4>
            <div className="flex flex-col gap-2.5">
              {["0", "4.2", "4.5", "4.8"].map((rat) => (
                <button
                  key={rat}
                  onClick={() => setSelectedRating(rat)}
                  className={`text-left text-xs py-1 px-2.5 rounded tracking-wide font-medium transition-all flex items-center gap-2 ${
                    selectedRating === rat
                      ? "bg-[#2C1B24] text-white pl-4 font-semibold border-l-2 border-[#D4AF37]"
                      : "text-[#7A6A73] hover:text-[#E75480] hover:bg-[#FFF5FA]"
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
            <div className="bg-[#FFF5FA] border border-[#D4AF37]/15 rounded-2xl p-16 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#FFF9FC] border border-[#D4AF37]/20 flex items-center justify-center mx-auto text-[#D4AF37]">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg md:text-xl font-bold text-[#2C1B24]">No Creations Found</h3>
              <p className="text-xs text-[#7A6A73] max-w-sm mx-auto leading-relaxed font-medium">
                We couldn&apos;t match any fine jewellery pieces to your refined selections. Try clearing your filters or adjustment values.
              </p>
              <button
                onClick={clearFilters}
                className="px-7 py-3 bg-[#2C1B24] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#E75480] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const hasLiked = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-[#FFF9FC] rounded-2xl border border-[#D4AF37]/15 overflow-hidden group shadow-sm flex flex-col justify-between luxury-card text-left"
                  >
                    <Link href={`/products/${product.id}`} className="block relative aspect-square bg-[#FFEFF7] overflow-hidden">
                      {/* Wishlist toggle action */}
                      <button
                        onClick={(e) => handleToggleWishlist(e, product)}
                        className={`absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
                          hasLiked ? "bg-[#E75480] text-white" : "bg-white/80 text-[#7A6A73] hover:text-[#E75480]"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-current" : ""}`} />
                      </button>

                      {/* Image hover swaps */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <img
                        src={product.images[1] || product.images[0]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />

                      {/* Quick view overlay */}
                      <div className="absolute inset-0 bg-[#2C1B24]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
                        <div className="px-4 py-2 bg-white/95 text-[#2C1B24] rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md flex items-center gap-1 backdrop-blur-sm">
                          <Eye className="w-3.5 h-3.5" /> Quick View
                        </div>
                      </div>

                      {!product.inStock && (
                        <div className="absolute inset-0 bg-[#2C1B24]/40 flex items-center justify-center z-10">
                          <span className="bg-white text-[#2C1B24] text-[8.5px] font-bold tracking-[0.25em] uppercase py-1.5 px-4 shadow-md rounded border border-[#D4AF37]/25">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="p-4 space-y-3.5 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[8.5px] uppercase tracking-widest text-[#7A6A73] font-bold">
                          {product.category}
                        </span>
                        <Link href={`/products/${product.id}`} className="block">
                          <h4 className="text-[11px] font-bold text-[#2C1B24] uppercase tracking-[0.18em] line-clamp-1 group-hover:text-[#E75480] transition-colors">
                            {product.name}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3 h-3 text-[#D4AF37] fill-current" />
                          <span className="text-[10px] font-bold text-[#2C1B24]">{product.rating}</span>
                          <span className="text-[9.5px] text-[#7A6A73] font-medium">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/10 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#D4AF37]">₹{product.price.toLocaleString("en-IN")}</span>
                          {product.originalPrice && (
                            <span className="text-[9px] text-[#7A6A73] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                          )}
                        </div>

                        {product.inStock && (
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="p-2.5 bg-[#FFF5FA] border border-[#D4AF37]/20 rounded-full hover:bg-[#2C1B24] hover:text-white transition-all text-[#2C1B24]"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
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

      {/* MOBILE DRAWER FILTERS DIALOG */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-[#2C1B24]/40 z-[1000] lg:hidden flex justify-end backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-sm bg-[#FFF9FC] h-full p-6 flex flex-col justify-between overflow-y-auto border-l border-[#D4AF37]/20"
            >
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center pb-4 border-b border-[#D4AF37]/15">
                  <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-[#2C1B24]">Refine Search</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-[#7A6A73] p-1.5 hover:text-[#2C1B24] transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                        className={`text-[10px] py-2 px-3.5 rounded-full border transition-all ${
                          selectedCategory === cat
                            ? "bg-[#2C1B24] border-[#2C1B24] text-white font-bold"
                            : "border-[#D4AF37]/20 text-[#7A6A73] bg-white hover:border-[#D4AF37]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Limits */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Price Limit (₹)</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="MIN"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full text-xs p-2.5 border border-[#D4AF37]/25 bg-white text-[#2C1B24] font-bold"
                    />
                    <input
                      type="number"
                      placeholder="MAX"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full text-xs p-2.5 border border-[#D4AF37]/25 bg-white text-[#2C1B24] font-bold"
                    />
                  </div>
                </div>

                {/* Materials */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Material</h4>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((mat) => (
                      <button
                        key={mat}
                        onClick={() => setSelectedMaterial(selectedMaterial === mat ? "" : mat)}
                        className={`text-[10px] py-2 px-3.5 rounded-full border transition-all ${
                          selectedMaterial === mat
                            ? "bg-[#2C1B24] border-[#2C1B24] text-white font-bold"
                            : "border-[#D4AF37]/20 text-[#7A6A73] bg-white hover:border-[#D4AF37]"
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ratings */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Minimum Rating</h4>
                  <div className="flex flex-col gap-2">
                    {["0", "4.2", "4.5", "4.8"].map((rat) => (
                      <button
                        key={rat}
                        onClick={() => setSelectedRating(rat)}
                        className={`text-left text-xs py-2 px-4 border border-[#D4AF37]/10 bg-white rounded tracking-wide font-medium flex items-center gap-2 ${
                          selectedRating === rat
                            ? "bg-[#2C1B24] text-white font-semibold"
                            : "text-[#7A6A73]"
                        }`}
                      >
                        {rat === "0" ? "All Ratings" : `${rat} & Above`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#D4AF37]/15 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="w-1/2 py-3 border border-[#2C1B24] text-[#2C1B24] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#2C1B24] hover:text-white transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-1/2 py-3 bg-[#2C1B24] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#E75480] transition-all"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <PageWrapper>
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/35 border-t-[#D4AF37] animate-spin mx-auto" />
        </div>
      }>
        <ProductsPageContent />
      </Suspense>
    </PageWrapper>
  );
}
