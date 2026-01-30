"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectionBannerProps {
  title: string;
  images: string[];
  link: string;
  variant?: "primary" | "secondary";
}

export default function CollectionBanner({
  title,
  images,
  link,
  variant = "primary",
}: CollectionBannerProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Auto-rotate images if multiple
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className={cn(
      "py-8 md:py-12",
      variant === "secondary" && "bg-gray-50"
    )}>
      <div className="container-custom">
        <div className="relative w-full h-[280px] sm:h-[360px] md:h-[440px] lg:h-[520px] rounded-xl overflow-hidden group">
          {/* Background Image with Fade Transition */}
          <div className="absolute inset-0">
            {images.map((image, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000",
                  index === currentImage ? "opacity-100" : "opacity-0"
                )}
              >
                <Image
                  src={imageError ? "/images/placeholder-banner.jpg" : image}
                  alt={`${title} Collection`}
                  fill
                  className="object-cover object-center"
                  onError={() => setImageError(true)}
                  priority={index === 0}
                />
              </div>
            ))}
            
            {/* Gradient Overlay */}
            {/* <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/20 to-transparent" /> */}
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-8 md:bottom-12 lg:bottom-16 left-6 md:left-10 lg:left-14 z-10">
            {/* Logo */}
            <div className="mb-3 md:mb-4">
              <div className="">
                <Image
                  src="/images/logo-small.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 whitespace-nowrap mb-4 md:mb-6">
              {title} <span className="text-[#8C0000]">COLLECTIONS</span>
            </h3>

            {/* CTA Button */}
            <Link
              href={link}
              className="group/btn inline-flex items-center gap-2 bg-[#8C0000] hover:bg-[#6d0000] text-white font-semibold px-5 md:px-8 py-2.5 md:py-3 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base"
            >
              Explore all
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>

          {/* Image Indicators (if multiple images) */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-6 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentImage
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </div>
      </div>
    </section>
  );
}

// Wrapper for two collection banners (men's and women's)
export function CollectionBanners() {
  return (
    <>
      <CollectionBanner
        title="MEN'S"
        images={["/images/banners/men-collection.jpg"]}
        link="/category/men"
        variant="primary"
      />
      
      <CollectionBanner
        title="WOMEN'S"
        images={["/images/banners/women-collection.jpg"]}
        link="/category/women"
        variant="secondary"
      />
    </>
  );
}
