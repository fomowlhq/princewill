"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { Product } from "@/types";
import { cn, calculateDiscount } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";

interface ProductCardProps {
  product: Product;
  currency?: "NGN" | "USD";
  showWishlist?: boolean;
  isFlipped?: boolean;
  onFlip?: (productId: number) => void;
}

export default function ProductCard({
  product,
  showWishlist = true,
  isFlipped = false,
  onFlip,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const isWishlisted = isInWishlist(product.id);
  const [imageError, setImageError] = useState(false);

  const hasDiscount = product.discount && product.discount < product.price;
  const discountPercentage = hasDiscount
    ? calculateDiscount(product.price, product.discount!)
    : 0;

  const handleFlip = () => {
    if (onFlip) {
      onFlip(product.id);
    }
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleWishlist(product);
  };

  return (
    <div
      className="product-card group relative cursor-pointer"
      onClick={handleFlip}
    >
      <div
        className={cn(
          "card-inner relative w-full h-[260px] md:h-96 transition-transform duration-700 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front Side */}
        <div className="card-front absolute inset-0 backface-hidden">
          {/* Wishlist Button */}
          {showWishlist && (
            <button
              onClick={handleWishlistClick}
              className={cn(
                "absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300",
                isWishlisted
                  ? "bg-[#8C0000] text-white scale-110"
                  : "bg-white/90 text-gray-600 hover:bg-[#8C0000] hover:text-white hover:scale-110"
              )}
            >
              <Heart
                className={cn("w-4 h-4", isWishlisted && "fill-current")}
              />
            </button>
          )}

          {/* New Arrival Badge */}
          {product.newArrival && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-linear-to-r from-[#8C0000] to-[#B30000] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-lg">
                New
              </span>
            </div>
          )}

          {/* Image Container */}
          <div className="relative w-full h-full overflow-hidden rounded bg-gray-100">
            {/* Main Image */}
            <Image
              src={imageError ? "/images/placeholder.jpg" : (product.mainImage && product.mainImage[0]) || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover object-center transition-opacity duration-500 group-hover:opacity-0"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />

            {/* Hover Image */}
            {(product.mainImage && product.mainImage[1]) && (
              <Image
                src={product.mainImage[1]}
                alt={`${product.name} - Hover`}
                fill
                className="object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            )}

            {/* Quick View Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <span className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  <Eye className="w-4 h-4" />
                  Tap to view
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="card-back absolute inset-0 backface-hidden rotate-y-180">
          <div className="relative w-full h-full rounded bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-xl flex flex-col items-center justify-center p-6">
            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-3 right-3">
                <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
                  {discountPercentage}% OFF
                </span>
              </div>
            )}

            {/* Product Info */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                {product.name}
              </h3>

              {/* Pricing */}
              <div className="space-y-1">
                {hasDiscount ? (
                  <>
                    <p className="text-base text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-[#8C0000]">
                      {formatPrice(product.discount!)}
                    </p>
                  </>
                ) : (
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>

              {/* View Details Button */}
              <Link
                href={`/product/${product.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#8C0000] to-[#B30000] hover:from-[#6B0000] hover:to-[#8C0000] text-white font-semibold px-4 py-1.5 whitespace-nowrap rounded transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#8C0000]/30"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
