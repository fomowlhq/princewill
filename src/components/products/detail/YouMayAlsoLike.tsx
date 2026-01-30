"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { mapApiProductToFrontend } from "@/lib/product-utils";
import ProductCard from "@/components/products/ProductCard";

interface YouMayAlsoLikeProps {
  productId: number;
}

export default function YouMayAlsoLike({ productId }: YouMayAlsoLikeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await apiClient(`/products/${productId}/related`);
        if (response.status === 'success' && response.data) {
          const mapped = response.data.map((p: any) => mapApiProductToFrontend(p));
          setProducts(mapped.slice(0, 6)); // Limit to 6 products like Laravel
        }
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId]);

  const handleFlip = (id: number) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="py-10">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#6C655D] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="flex items-center gap-2 mb-8">
        <h3 className="text-lg md:text-2xl text-[#27231F]">You may also like</h3>
      </div>

      {products.length === 0 ? (
        <div className="bg-[#1A1714] px-4 py-6">
          <p className="text-white text-sm md:text-lg">No product found...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isFlipped={flippedCard === item.id}
              onFlip={handleFlip}
            />
          ))}
        </div>
      )}
    </div>
  );
}

