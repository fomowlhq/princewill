"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { mapApiProductDetailToFrontend } from "@/lib/product-utils";
import { ProductDetail } from "@/types";
import { Loader2, Home, ChevronRight } from "lucide-react";
import Link from "next/link";

// Components
import ProductGallery from "@/components/products/detail/ProductGallery";
import ProductInfo from "@/components/products/detail/ProductInfo";
import ProductAccordions from "@/components/products/detail/ProductAccordions";
import CompleteTheLook from "@/components/products/detail/CompleteTheLook";
import YouMayAlsoLike from "@/components/products/detail/YouMayAlsoLike";

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient(`/products/slug/${slug}`);
        if (response.status === 'success' && response.data) {
          const detail = mapApiProductDetailToFrontend(response.data);
          setProduct(detail);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Something went wrong while loading the product.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-6">
        <Loader2 className="w-12 h-12 text-[#8C0000] animate-spin" />
        <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Preparing Luxury Experience</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">Discovery Failed</h2>
        <p className="text-gray-400 text-center mb-12 max-w-sm uppercase text-xs font-bold leading-relaxed tracking-widest">
            {error || "We couldn't find the product you were looking for. It might have been moved or removed."}
        </p>
        <Link 
          href="/shop" 
          className="bg-black text-white px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#8C0000] transition-all"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: product.category?.name || "Shop", href: `/category/${product.category?.slug || "all"}` },
    // { name: product.subcategory?.name || "Collection", href: `/collection/${product.subcategory?.slug || "all"}` },
    { name: product.name, href: "#" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Header */}
      <div className="bg-white pt-32 pb-6">
        <div className="container-custom">
            <nav className="flex items-center" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                    {breadcrumbs.map((bc, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <Link 
                                href={bc.href}
                                className={i === breadcrumbs.length - 1 
                                    ? "text-[#100E0C] text-xs md:text-base font-normal" 
                                    : "text-[#C4C1BE] hover:text-[#6C655D] text-xs md:text-base font-normal transition-colors"
                                }
                            >
                                {bc.name}
                            </Link>
                            {i < breadcrumbs.length - 1 && (
                                <span className="text-[#C4C1BE]">|</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left: Product Gallery */}
          <div className="lg:sticky lg:top-32 h-fit">
            <ProductGallery images={product.images} />
          </div>

          {/* Right: Product Details & Actions */}
          <div className="flex flex-col gap-12">
            <ProductInfo product={product} />
            <ProductAccordions 
                description={product.description || ""} 
                shippingDetail={product.shippingDetail} 
            />
          </div>
        </div>

        {/* Cross-Sell: Complete The Look */}
        <CompleteTheLook products={product.completeDetails} />

        {/* You May Also Like */}
        <YouMayAlsoLike productId={product.id} />
      </div>

      {/* Modern Decoration */}
      <div className="fixed top-0 left-0 -z-10 opacity-[0.02] pointer-events-none">
        <span className="text-[25rem] font-black leading-none uppercase select-none tracking-tighter">
            {product.name.split(' ')[0]}
        </span>
      </div>
    </div>
  );
}
