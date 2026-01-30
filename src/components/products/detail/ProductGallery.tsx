"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Controller } from "swiper/modules";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Thumbnails - Order 2 on mobile (below), Order 1 on desktop (left side) */}
      <div className="md:w-24 shrink-0 order-2 md:order-1">
        {!isMobile ? (
          /* Desktop Vertical Thumbnails */
          <div className="h-[500px] lg:h-[600px]">
             <Swiper
                onSwiper={setThumbsSwiper}
                direction="vertical"
                spaceBetween={12}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="h-full w-full"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className="cursor-pointer group">
                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent transition-all duration-300 group-[.swiper-slide-thumb-active]:border-[#8C0000] group-[.swiper-slide-thumb-active]:shadow-lg group-[.swiper-slide-thumb-active]:shadow-red-900/10">
                            <Image
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
          </div>
        ) : (
          /* Mobile Horizontal Thumbnails */
          <Swiper
            onSwiper={setThumbsSwiper}
            direction="horizontal"
            spaceBetween={10}
            slidesPerView={4.5}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="w-full mt-4"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="cursor-pointer">
                <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent transition-all duration-300 in-[.swiper-slide-thumb-active]:border-[#8C0000]">
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Main Image - Order 1 on mobile (above), Order 2 on desktop (right side) */}
      <div className="flex-1 bg-gray-50 rounded-[2.5rem] overflow-hidden relative group shadow-2xl shadow-black/5 border border-gray-100/50 order-1 md:order-2">
        <Swiper
          spaceBetween={10}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs, Controller]}
          className="h-full w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <div className="relative w-full aspect-4/5 md:aspect-auto md:h-[600px] lg:h-[700px]">
                <Image
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
            <button className="swiper-button-prev-custom pointer-events-auto w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#8C0000] hover:text-white -translate-x-4 group-hover:translate-x-0">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="swiper-button-next-custom pointer-events-auto w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#8C0000] hover:text-white translate-x-4 group-hover:translate-x-0">
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
      </div>
    </div>
  );
}
