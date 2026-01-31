"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { getImageUrl } from "@/lib/product-utils";
import { homeCache } from "@/lib/home-cache";

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  is_subtitle: boolean;
  is_button: boolean;
}

export default function Hero() {
  // Always start with empty state to avoid hydration mismatch
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check cache after mount to avoid hydration mismatch
    if (homeCache.banners && homeCache.isValid()) {
      setSlides(homeCache.banners);
      setIsLoading(false);
      return;
    }

    const fetchBanners = async () => {
      try {
        const response = await apiClient('/banners');
        if (response.status === 'success' && response.data) {
          const transformedSlides = response.data.map((banner: any) => ({
            id: banner.id,
            title: banner.title,
            subtitle: banner.subtitle || "",
            description: "",
            buttonText: banner.button_text || "Shop Now",
            buttonLink: banner.banner_url || "/shop",
            image: getImageUrl(banner.images),
            is_subtitle: banner.is_subtitle,
            is_button: banner.is_button
          }));
          homeCache.banners = transformedSlides;
          setSlides(transformedSlides);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, slides.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, slides.length]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Auto-advance slides
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  if (isLoading) {
    return (
      <section className="relative h-[70vh] md:h-screen w-full overflow-hidden flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin" />
      </section>
    );
  }

  if (slides.length === 0) {
    return null; // Or show a static hero
  }

  return (
    <section className="relative h-[70vh] md:h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-800 ease-in-out",
            index === currentSlide
              ? "opacity-100 scale-100 z-10"
              : "opacity-0 scale-105 z-0"
          )}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gray-900">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center"
              priority={index === 0}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-md text-left">
                {/* Animated Content */}
                <div
                  className={cn(
                    "transition-all duration-700 delay-200",
                    index === currentSlide
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  )}
                >
                  <h1 className="text-xl md:text-3xl lg:text-[40px] font-bold text-white mb-4 leading-tight capitalize tracking-tight">
                    {slide.title}
                  </h1>
                </div>

                {slide.is_subtitle && slide.subtitle && (
                  <div
                    className={cn(
                      "transition-all duration-700 delay-300",
                      index === currentSlide
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    )}
                  >
                    <h2 className="text-base md:text-2xl font-bold text-white/90 tracking-wide">
                      {slide.subtitle}
                    </h2>
                  </div>
                )}

                {slide.is_button && (
                  <div
                    className={cn(
                      "transition-all duration-700 delay-500 mt-8",
                      index === currentSlide
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    )}
                  >
                    <Link
                      href={slide.buttonLink}
                      className="inline-flex items-center gap-3 bg-[#8C0000] hover:bg-black text-white px-6 md:px-10 py-3 md:py-4 rounded-md font-bold text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-2xl group uppercase tracking-widest"
                    >
                      {slide.buttonText}
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-transparent text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-300 group border border-white/5"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:-translate-x-1" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-transparent text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-300 group border border-white/5"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:translate-x-1" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "transition-all duration-300",
                index === currentSlide
                  ? "w-12 h-1.5 bg-[#8C0000]"
                  : "w-6 h-1.5 bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
