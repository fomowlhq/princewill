"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductSlider from "./ProductSlider";
import { apiClient } from "@/lib/api-client";
import { mapApiProductToFrontend } from "@/lib/product-utils";
import { Product } from "@/types";
import { homeCache } from "@/lib/home-cache";

interface UnisexSectionProps {
  currency?: "NGN" | "USD";
}

export default function UnisexSection({ currency = "NGN" }: UnisexSectionProps) {
  // Always start with empty state to avoid hydration mismatch
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check cache after mount to avoid hydration mismatch
    if (homeCache.unisex && homeCache.isValid()) {
      setProducts(homeCache.unisex);
      setIsLoading(false);
      return;
    }

    const fetchUnisex = async () => {
      try {
        const response = await apiClient('/products/collection/unisex');
        const mappedProducts = response.data.map(mapApiProductToFrontend);
        homeCache.unisex = mappedProducts;
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch unisex products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnisex();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Section Header - Left Side */}
          <div className="md:col-span-2 flex flex-row md:flex-col justify-between md:justify-start items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 section-title">
                Unisex
              </h2>
              <p className="mt-2 text-gray-600 text-sm hidden md:block">
                Fashion for everyone
              </p>
            </div>
            {!isLoading && products.length > 0 && (
              <Link
                href="/collections/unisex"
                className="group flex items-center gap-1 text-[#8C0000] hover:text-[#6B0000] font-medium text-sm transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          {/* Products Slider - Right Side */}
          <div className="md:col-span-10">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-2xl">
                <Loader2 className="w-8 h-8 text-[#8C0000] animate-spin" />
              </div>
            ) : (
              <ProductSlider
                products={products}
                currency={currency}
                gridClasses="w-[calc(50%-4px)] sm:w-[calc(50%-4px)] md:w-[calc(33.333%-5.33px)] lg:w-[calc(33.333%-5.33px)] xl:w-[calc(33.333%-5.33px)] 2xl:w-[calc(25%-6px)]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
