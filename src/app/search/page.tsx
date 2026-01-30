"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShoppingBag, ArrowLeft, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { mapApiProductToFrontend } from "@/lib/product-utils";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import Link from "next/link";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flippedProductId, setFlippedProductId] = useState<number | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiClient(`/products/search/query?q=${encodeURIComponent(query)}`);
        if (response.status === 'success' && response.data) {
          const mappedProducts = response.data.map(mapApiProductToFrontend);
          setProducts(mappedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleFlip = (productId: number) => {
    setFlippedProductId(flippedProductId === productId ? null : productId);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container-custom">
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            <div className="flex items-center gap-6">
                <div className="w-1.5 h-12 bg-[#8C0000]" />
                <h1 className="text-2xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                {query ? `Results for "${query}"` : "Search Our Collection"}
                </h1>
            </div>
            {!isLoading && (
               <p className="text-gray-400 font-bold text-sm uppercase tracking-widest pl-8">
                 {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
               </p>
            )}
          </div>

          <div className="relative group w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search..."
              defaultValue={query}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/search?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                }
              }}
              className="w-full bg-gray-50 border-b-2 border-gray-100 py-4 px-0 text-xl font-bold focus:outline-none focus:border-[#8C0000] transition-colors placeholder:text-gray-200"
            />
            <SearchIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
          </div>
        </div>

        {/* Results Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#8C0000] animate-spin mb-6" />
            <span className="text-gray-300 font-bold uppercase tracking-[0.2em] text-[10px]">Filtering Experience</span>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-y-12 gap-x-6 md:gap-x-10">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isFlipped={flippedProductId === product.id}
                onFlip={handleFlip}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 bg-gray-50/50 rounded-[40px] border border-gray-100">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-gray-100 rounded-full scale-150 blur-2xl opacity-50" />
              <ShoppingBag className="relative w-16 h-16 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">No Discoveries Made</h3>
            <p className="text-gray-400 text-center max-w-sm mb-12 text-sm font-medium leading-relaxed uppercase tracking-wider">
              We couldn't find any products matching your criteria. Explore our latest arrivals instead.
            </p>
            <Link 
              href="/shop" 
              className="bg-black text-white px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#8C0000] transition-all hover:scale-105 shadow-2xl shadow-red-900/10"
            >
              Explore Collection
            </Link>
          </div>
        )}
      </div>

      {/* Modern Decoration */}
      <div className="fixed top-0 right-0 -z-10 opacity-[0.03] pointer-events-none">
        <span className="text-[20rem] font-black leading-none uppercase select-none tracking-tighter">
            Search
        </span>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-[#8C0000] animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
