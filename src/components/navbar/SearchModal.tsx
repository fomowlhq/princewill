"use client";

import { useEffect, useRef, useState } from "react";
import { X, Search, TrendingUp, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { popularSearches } from "./types";
import { apiClient } from "@/lib/api-client";
import { mapApiProductToFrontend } from "@/lib/product-utils";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleQuickSearch: (term: string) => void;
}

export function SearchModal({ 
  isOpen, 
  onClose, 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  handleQuickSearch 
}: SearchModalProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flippedProductId, setFlippedProductId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // Clear results when modal closes
      setResults([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiClient(`/products/search/query?q=${encodeURIComponent(trimmedQuery)}`);
        if (response.status === 'success' && response.data) {
          const mappedProducts = response.data.map(mapApiProductToFrontend);
          setResults(mappedProducts);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Live search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 400);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const onFlip = (id: number) => {
    setFlippedProductId(flippedProductId === id ? null : id);
  };

  // Override handleSearch to prevent full page navigation if needed, 
  // but for now let's just make it a "close and go" if the user hits enter
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      // If we have results, maybe we don't need to do anything 
      // as they are already visible. 
      // If the user REALLY wants to go to a full page, they can, 
      // but let's just keep them in the modal for now as requested.
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 z-110 transition-all duration-500 overflow-hidden",
      isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
    )}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={onClose} />
      
      <div className={cn(
        "relative w-full h-full max-w-7xl mx-auto flex flex-col p-6 md:p-12 transition-all duration-500 transform",
        isOpen ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
      )}>
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors cursor-pointer z-50">
          <X className="w-10 h-10" />
        </button>
        
        {/* Search Header */}
        <div className="w-full max-w-4xl mx-auto mb-8 md:mb-16">
          <form onSubmit={onFormSubmit} className="mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-[#8C0000] to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative flex items-center bg-white rounded-2xl overflow-hidden shadow-2xl">
                <Search className="w-8 h-8 text-gray-400 ml-8" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you searching for today?"
                  className="flex-1 bg-transparent text-gray-900 text-2xl md:text-3xl py-8 px-6 focus:outline-none font-medium"
                />
                {isLoading && (
                  <div className="mr-8">
                    <Loader2 className="w-8 h-8 text-[#8C0000] animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Trending if no query */}
          {searchQuery.length < 2 && !isLoading && (
            <div className="animate-fadeInUp">
              <div className="flex items-center gap-3 mb-6 text-white/40 uppercase tracking-widest text-sm font-bold">
                <TrendingUp className="w-5 h-5" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {popularSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => handleQuickSearch(term)}
                    className="px-8 py-4 bg-white/5 hover:bg-[#8C0000] text-white rounded-full text-base font-bold transition-all border border-white/5 hover:border-transparent hover:scale-105 cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Area - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
          {searchQuery.length >= 2 && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-white text-base md:text-3xl font-black uppercase tracking-tight">
                  {isLoading ? "Searching..." : `Found ${results.length} results for "${searchQuery}"`}
                </h2>
                {results.length > 0 && (
                  <Link 
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={onClose}
                    className="text-white/60 hover:text-[#8C0000] flex items-center gap-2 text-xs md:text-sm text-nowrap font-bold uppercase tracking-widest transition-colors group"
                  >
                    View All Results
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10 pb-20">
                  {results.slice(0, 10).map((product) => (
                    <div key={product.id} onClick={(e) => e.stopPropagation()}>
                      <ProductCard 
                        product={product} 
                        isFlipped={flippedProductId === product.id}
                        onFlip={onFlip}
                      />
                    </div>
                  ))}
                </div>
              ) : !isLoading && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                  <p className="text-white/40 text-lg font-bold uppercase tracking-widest">No products found matching your search</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
