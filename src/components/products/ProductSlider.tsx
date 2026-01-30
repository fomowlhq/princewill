"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductSliderProps {
  products: Product[];
  currency?: "NGN" | "USD";
  showArrows?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  gridClasses?: string;
}

export default function ProductSlider({
  products,
  currency = "NGN",
  showArrows = true,
  autoPlay = true,
  autoPlayInterval = 4000,
  gridClasses,
}: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [flippedProductId, setFlippedProductId] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isResettingRef = useRef(false);

  // Duplicate products for infinite scroll effect (only if we have products)
  const infiniteProducts = products.length > 0 ? [...products, ...products] : [];

  const handleFlip = (productId: number) => {
    setFlippedProductId(prevId => prevId === productId ? null : productId);
  };

  const checkScrollability = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Handle infinite scroll reset
  const handleScroll = useCallback(() => {
    if (!sliderRef.current || isResettingRef.current || products.length === 0) return;

    const slider = sliderRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = slider;
    const halfScrollWidth = (scrollWidth - clientWidth) / 2;

    // When we've scrolled past the first set of products, jump back
    if (scrollLeft >= halfScrollWidth + 50) {
      isResettingRef.current = true;
      slider.scrollLeft = scrollLeft - halfScrollWidth;
      requestAnimationFrame(() => {
        isResettingRef.current = false;
      });
    }
    // When we've scrolled before the start, jump to the duplicate set
    else if (scrollLeft <= 10 && canScrollLeft) {
      isResettingRef.current = true;
      slider.scrollLeft = scrollLeft + halfScrollWidth;
      requestAnimationFrame(() => {
        isResettingRef.current = false;
      });
    }

    checkScrollability();
  }, [products.length, canScrollLeft, checkScrollability]);

  useEffect(() => {
    checkScrollability();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", checkScrollability);
    }
    return () => {
      if (slider) {
        slider.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", checkScrollability);
    };
  }, [handleScroll, checkScrollability]);

  // Auto play functionality - continuous scrolling (pauses on hover)
  useEffect(() => {
    if (!autoPlay || products.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      if (sliderRef.current && !isResettingRef.current) {
        scrollRight();
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, products.length, isPaused]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.querySelector(".product-card")?.clientWidth || 280;
      sliderRef.current.scrollBy({ left: -(cardWidth + 16), behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.querySelector(".product-card")?.clientWidth || 280;
      sliderRef.current.scrollBy({ left: cardWidth + 16, behavior: "smooth" });
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div
      className="relative group/slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={scrollLeft}
            className={cn(
              "absolute -left-4 md:left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 transition-all duration-300",
              canScrollLeft
                ? "opacity-0 group-hover/slider:opacity-100 hover:bg-[#8C0000] hover:text-white hover:border-[#8C0000] hover:scale-110"
                : "opacity-0 cursor-not-allowed"
            )}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={scrollRight}
            className={cn(
              "absolute -right-4 md:right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 transition-all duration-300",
              canScrollRight
                ? "opacity-0 group-hover/slider:opacity-100 hover:bg-[#8C0000] hover:text-white hover:border-[#8C0000] hover:scale-110"
                : "opacity-0 cursor-not-allowed"
            )}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Gradient Overlays */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent z-10 pointer-events-none transition-opacity",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent z-10 pointer-events-none transition-opacity",
          canScrollRight ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Product Slider */}
      <div
        ref={sliderRef}
        className="flex gap-2 overflow-x-auto hide-scrollbar scroll-smooth px-1 py-2"
      >
        {infiniteProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className={cn(
              "shrink-0",
              gridClasses || "w-[calc(50%-4px)] sm:w-[calc(33.333%-5.33px)] md:w-[calc(25%-6px)] lg:w-[calc(20%-6px)] xl:w-[calc(20%-6px)] 2xl:w-[calc(20%-6.4px)]"
            )}
          >
            <ProductCard
              product={product}
              currency={currency}
              isFlipped={flippedProductId === product.id}
              onFlip={handleFlip}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
