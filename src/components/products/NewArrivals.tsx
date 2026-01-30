"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductSlider from "./ProductSlider";
import { apiClient } from "@/lib/api-client";
import { mapApiProductToFrontend } from "@/lib/product-utils";
import { Product } from "@/types";
import { homeCache } from "@/lib/home-cache";

interface NewArrivalsProps {
  currency?: "NGN" | "USD";
}

export default function NewArrivals({ currency = "NGN" }: NewArrivalsProps) {
  // Always start with empty state to avoid hydration mismatch
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check cache after mount to avoid hydration mismatch
    if (homeCache.newArrivals && homeCache.isValid()) {
      setProducts(homeCache.newArrivals);
      setIsLoading(false);
      return;
    }

    const fetchNewArrivals = async () => {
      try {
        const response = await apiClient('/products/collection/new-arrivals');
        const mappedProducts = response.data.map(mapApiProductToFrontend);
        homeCache.newArrivals = mappedProducts;
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide section-title-center">
            New Arrivals
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover our latest collection of premium fashion items
          </p>
        </div>

        {/* Products Slider */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Curating the latest styles...</p>
          </div>
        ) : (
          <ProductSlider
            products={products}
            currency={currency}
            gridClasses="w-[calc(50%-4px)] sm:w-[calc(33.333%-5.33px)] md:w-[calc(33.333%-5.33px)] lg:w-[calc(25%-6px)] xl:w-[calc(25%-6px)] 2xl:w-[calc(20%-6.4px)]"
          />
        )}

        {/* View More Button */}
        {!isLoading && products.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link
              href="/collections/new-arrivals"
              className="group inline-flex items-center gap-2 bg-linear-to-r from-[#8C0000] to-[#B30000] hover:from-[#6B0000] hover:to-[#8C0000] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#8C0000]/30 hover:scale-105"
            >
              View More
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
