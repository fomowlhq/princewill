"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductDetail, Size } from "@/types";
import { ShoppingBag, Star, Heart, Share2, Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import SizeGuideDrawer from "./SizeGuideDrawer";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize || product.qty <= 0 || isAdding) return;

    const selectedSizeObj = product.sizeDetails?.find(s => s.id === selectedSize);
    const price = product.discount && product.discount < product.price
      ? product.discount
      : product.price;

    setIsAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      qty: quantity,
      price: price,
      image: product.images?.[0] || '',
      sizeId: selectedSize,
      sizeName: selectedSizeObj?.sizeCode || '',
      colorId: product.color?.id,
      colorName: product.color?.name,
    });

    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setIsAdding(false);
    }, 1500);
  };

  const { formatPrice } = useCurrency();

  const hasDiscount = product.discount && product.discount < product.price;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="bg-[#F5F3F0] text-[#6C655D] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {product.category?.name}
          </span>
          <div className="flex gap-4">
            <button
              onClick={() => toggleWishlist(product)}
              className={cn(
                "transition-colors",
                isWishlisted ? "text-[#8C0000]" : "text-[#6C655D] hover:text-[#8C0000]"
              )}
            >
              <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
            </button>
            <button className="text-[#6C655D] hover:text-[#100E0C] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#100E0C] capitalize">
          {product.name}
        </h1>

        <div className="flex items-center gap-3">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-[#6C655D] line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-2xl font-bold text-[#27231F]">
                {formatPrice(product.discount!)}
              </span>
              <span className="bg-[#FFAE0D] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                -{Math.round((1 - product.discount! / product.price) * 100)}%
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-[#27231F]">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Color Variations */}
      {product.variations && product.variations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#333333]">Color Variations</span>
            <span className="text-sm text-[#6C655D]">({product.color?.name})</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Current Product */}
            <div className="border-2 border-[#8C0000] p-1 rounded-lg">
              <div
                className="w-10 h-10 rounded-md relative overflow-hidden"
              >
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              </div>
            </div>
            {/* Variations */}
            {product.variations.map((v) => (
              <Link
                key={v.id}
                href={`/product/${v.slug}`}
                className="border-2 border-transparent hover:border-gray-200 p-1 rounded-lg transition-all"
                title={v.color?.name}
              >
                <div
                  className="w-10 h-10 rounded-md relative overflow-hidden"
                >
                  <Image src={v.images[0]} alt={v.name} fill className="object-cover" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#333333]">Size</span>
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="text-xs font-bold text-[#333333] flex items-center gap-1 hover:text-[#8C0000] transition-colors"
          >
            <Info className="w-3 h-3" />
            Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizeDetails.map((size) => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size.id)}
              className={cn(
                "min-w-12 h-10 flex items-center justify-center px-4 rounded-lg text-sm font-medium transition-all border",
                selectedSize === size.id
                  ? "bg-[#27231F] border-[#27231F] text-white"
                  : "bg-white border-gray-200 text-[#333333] hover:border-[#27231F]"
              )}
            >
              {size.sizeCode}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm font-medium text-[#333333]">Quantity</p>
          <div className="flex items-center gap-6">
            {product.qty > 0 ? (
              <>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-fit px-4 py-2 border border-gray-200 rounded-lg text-sm text-[#333333] bg-white focus:outline-none focus:border-[#27231F]"
                >
                  {Array.from({ length: Math.min(product.qty, 10) }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <p className="text-xs text-[#6C655D]">
                  Available ({product.qty} in stock)
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-red-500">
                Sold Out
              </p>
            )}
          </div>
        </div>

        {product.qty > 0 ? (
          <button
            disabled={!selectedSize || isAdding}
            onClick={handleAddToCart}
            className={cn(
              "w-full flex items-center justify-center gap-3 py-4 rounded-lg text-sm font-medium transition-all duration-300",
              !selectedSize
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : addSuccess
                  ? "bg-green-600 text-white"
                  : isAdding
                    ? "bg-[#FFAE0D] text-white"
                    : "text-white hover:opacity-90"
            )}
            style={{
              background: !selectedSize ? '#e5e7eb' :
                addSuccess ? '#16a34a' :
                  isAdding ? '#FFAE0D' :
                    'linear-gradient(135deg, #8C0000 0%, #6B0000 100%)'
            }}
          >
            {addSuccess ? (
              <>
                <Check className="w-5 h-5" />
                Added to Bag!
              </>
            ) : isAdding ? (
              <>Adding to Bag...</>
            ) : (
              <>
                Add To Bag
                <ShoppingBag className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 py-4 rounded-lg text-sm font-medium bg-gray-200 text-gray-400 cursor-not-allowed"
          >
            Out of Stock
            <ShoppingBag className="w-5 h-5" />
          </button>
        )}
      </div>

      <SizeGuideDrawer
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
}
