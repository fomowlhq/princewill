"use client";

import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface CompleteTheLookProps {
  products: Product[];
}

export default function CompleteTheLook({ products }: CompleteTheLookProps) {
  const { formatPrice } = useCurrency();
  if (!products || products.length === 0) return null;

  return (
    <div className="py-16 border-t border-gray-100">
      {/* <div className="flex items-center justify-between mb-10">
        <h3 className="text-lg md:text-xl font-bold text-[#27231F]">Complete Your Look With</h3>
        <Link href="/" className="text-xs font-bold text-[#333333] flex items-center gap-2 group hover:text-[#8C0000] transition-colors">
            Browse All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <div key={item.id} className="group flex items-center gap-5 p-4 bg-[#F5F3F0] rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0">
              <Image 
                src={item.images[0]} 
                alt={item.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-1.5">
              <h4 className="text-sm font-medium text-[#100E0C] capitalize line-clamp-2">{item.name}</h4>
              
              <div className="flex items-center gap-2">
                {item.discount ? (
                  <>
                    <span className="text-sm font-bold text-[#6C655D] line-through">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-base font-bold text-[#27231F]">
                      {formatPrice(item.discount!)}
                    </span>
                  </>
                ) : (
                  <span className="text-base font-bold text-[#27231F]">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>

              <Link 
                href={`/product/${item.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6C655D] hover:text-[#8C0000] transition-colors mt-1"
              >
                View Detail
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#6C655D] hover:bg-[#8C0000] hover:text-white hover:border-[#8C0000] transition-all shrink-0">
                <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
