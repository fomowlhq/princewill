"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Product, Category, SubCategory } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { FilterDrawer, FilterState } from "@/components/products/FilterDrawer";
import { cn } from "@/lib/utils";
import { mapApiProductToFrontend } from "@/lib/product-utils";

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "New Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [flippedProductId, setFlippedProductId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    sizes: [],
    minPrice: "",
    maxPrice: "",
    subcategories: [], // New filter
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchCategoryInfo = useCallback(async () => {
    try {
      const res = await apiClient(`/categories/slug/${slug}`);
      if (res.success !== false) {
        const catData = res.data || res;
        setCategory(catData);
        // Map sub_categories from API to subcategories state if needed
        if (catData.sub_categories) {
            setSubcategories(catData.sub_categories.map((sub: any) => ({
                id: sub.id,
                name: sub.name,
                slug: sub.slug,
                status: Boolean(sub.status),
                categoryId: sub.category_id
            })));
        } else if (catData.subcategories) {
             setSubcategories(catData.subcategories);
        }
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  }, [slug]);

  const fetchProducts = useCallback(async (pageNum: number, currentFilters: FilterState, currentSort: string) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        per_page: "12",
        sort_by: currentSort,
      });

      if (currentFilters.colors.length > 0) {
        queryParams.append("colors", currentFilters.colors.join(","));
      }
      if (currentFilters.sizes.length > 0) {
        queryParams.append("sizes", currentFilters.sizes.join(","));
      }
      if (currentFilters.subcategories && currentFilters.subcategories.length > 0) {
        queryParams.append("subcategories", currentFilters.subcategories.join(","));
      }
      if (currentFilters.minPrice) {
        queryParams.append("min_price", currentFilters.minPrice);
      }
      if (currentFilters.maxPrice) {
        queryParams.append("max_price", currentFilters.maxPrice);
      }

      const res = await apiClient(`/products/category-slug/${slug}?${queryParams.toString()}`);
      
      if (res.success !== false) {
        const rawProducts = res.data?.data || res.data || [];
        const newProducts = rawProducts.map(mapApiProductToFrontend);
        setProducts((prev) => (pageNum === 1 ? newProducts : [...prev, ...newProducts]));
        setHasMore(res.data?.next_page_url !== null && newProducts.length > 0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [slug]);

  // Initial load: info + first page
  useEffect(() => {
    fetchCategoryInfo();
  }, [fetchCategoryInfo]);

  // Fetch products when page, filters, or sort changes
  useEffect(() => {
    fetchProducts(page, filters, sortBy);
  }, [page, filters, sortBy, fetchProducts]);

  // Reset to page 1 when filters or sort change
  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    setProducts([]);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
    setProducts([]);
    setIsSortOpen(false);
  };

  const handleFlip = (productId: number) => {
    setFlippedProductId(flippedProductId === productId ? null : productId);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="container-custom">

        {/* Header */}
        <div className="pt-32 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#C4C1BE] mb-4">
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                <span>/</span>
                <span className="text-black">{category?.name || "Category"}</span>
              </nav>
              <h1 className="text-2xl md:text-4xl font-black text-[#100E0C] uppercase tracking-tighter leading-none">
                {category?.name || "Category"}
              </h1>
              <p className="text-[#6C655D] font-bold text-sm mt-4 uppercase tracking-widest">
                {products.length} Products Found
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="cursor-pointer flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-600">Sort:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isSortOpen && "rotate-180")} />
                </button>

                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={cn(
                            "cursor-pointer w-full text-left px-5 py-3 text-sm font-bold transition-colors",
                            sortBy === option.value ? "text-[#8C0000] bg-gray-50" : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="cursor-pointer flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-black transition-all shadow-xl shadow-gray-200"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="">
          {(isInitialLoading || isLoading) && products.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-4/5 bg-gray-100 rounded-2xl" />
                  <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <SlidersHorizontal className="w-8 h-8 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase">No products found</h3>
              <p className="text-gray-500 font-bold text-sm mt-2 uppercase tracking-widest">
                Try adjusting your filters or search criteria
              </p>
              <button 
                onClick={() => handleFilterApply({ colors: [], sizes: [], minPrice: "", maxPrice: "", subcategories: [] })}
                className="cursor-pointer mt-8 text-[10px] font-black uppercase tracking-widest text-[#8C0000] hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-1.5">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  ref={products.length === index + 1 ? lastProductElementRef : undefined}
                >
                  <ProductCard 
                    product={product} 
                    isFlipped={flippedProductId === product.id}
                    onFlip={handleFlip}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {isLoading && products.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100 text-[#6C655D] font-bold text-[10px] uppercase tracking-widest">
                <Loader2 className="w-4 h-4 animate-spin text-[#8C0000]" />
                Loading More
              </div>
            </div>
          )}
        </div>

        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleFilterApply}
          initialFilters={filters}
          subcategories={subcategories}
        />
      </div>
    </div>
  );
}
