"use client";

import React from "react";
import { X, Heart, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { WishlistEmpty } from "./WishlistEmpty";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import Image from "next/image";
import Link from "next/link";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  return (
    <div
      className={cn(
        "fixed inset-0 z-150 transition-all duration-500",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full bg-white relative">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-[#8C0000] fill-[#8C0000]" />
              <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest">
                My Wishlist ({wishlistItems.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
            {wishlistItems.length === 0 ? (
              <WishlistEmpty onClose={onClose} />
            ) : (
              <div className="p-6 space-y-6">
                {wishlistItems.map((product) => (
                  <div key={product.id} className="flex gap-4 group">
                    <div className="relative w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={(product.mainImage && product.mainImage[0]) || "/images/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1 truncate">{product.name}</h4>
                        <p className="text-sm font-black text-[#8C0000] mt-1">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                        <Link
                          href={`/product/${product.slug}`}
                          className="text-[10px] font-black uppercase tracking-widest text-[#8C0000] hover:underline flex items-center gap-1"
                          onClick={onClose}
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
              Items in wishlist are not reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
