import { NextResponse } from "next/server";
import productsData from "@/data/products.json";
import { Product } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const category = searchParams.get("category") || "";
    const priceMin = parseFloat(searchParams.get("priceMin") || "0");
    const priceMax = parseFloat(searchParams.get("priceMax") || "999999");
    const material = searchParams.get("material") || "";
    const rating = parseFloat(searchParams.get("rating") || "0");
    const sort = searchParams.get("sort") || "featured";
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    let filtered = [...productsData] as Product[];

    // 1. Text Search Filter
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.material.toLowerCase().includes(search)
      );
    }

    // 2. Category Filter (supports comma separation)
    if (category) {
      const categoriesList = category.split(",").map((c) => c.trim().toLowerCase());
      filtered = filtered.filter((p) =>
        categoriesList.includes(p.category.toLowerCase())
      );
    }

    // 3. Price Filter
    filtered = filtered.filter((p) => p.price >= priceMin && p.price <= priceMax);

    // 4. Material Filter (supports comma separation)
    if (material) {
      const materialsList = material.split(",").map((m) => m.trim().toLowerCase());
      filtered = filtered.filter((p) =>
        materialsList.some((m) => p.material.toLowerCase().includes(m))
      );
    }

    // 5. Rating Filter
    if (rating > 0) {
      filtered = filtered.filter((p) => p.rating >= rating);
    }

    // 6. Sorting
    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "trending":
        filtered.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
        break;
      case "featured":
      default:
        // Sort featured first, then by rating
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    // 7. Pagination Computations
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(total / limit);

    // Return structured payload
    return NextResponse.json({
      success: true,
      products: paginated,
      total,
      page,
      pages: totalPages,
      limit,
    });
  } catch (error) {
    console.error("API error in GET /api/products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
