"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

interface WishlistEmptyProps {
  onClose: () => void;
}

export const WishlistEmpty: React.FC<WishlistEmptyProps> = ({ onClose }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-gray-50 rounded-full scale-110" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="w-12 h-12 text-gray-200" />
        </div>
      </div>
      <h4 className="text-gray-900 font-black text-xl mb-2 italic">YOUR WISHLIST IS EMPTY</h4>
      <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">
        Save your favorite items here to keep track of what you love.
      </p>
      <Link
        href="/"
        onClick={onClose}
        className="w-full bg-[#8C0000] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-900/20 active:scale-95 transition-all cursor-pointer"
      >
        Explore Collection
      </Link>
    </div>
  );
};
