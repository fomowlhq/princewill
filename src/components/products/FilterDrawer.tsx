"use client";

import { useState, useEffect } from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { Color, Size, SubCategory } from "@/types";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
  subcategories?: SubCategory[];
}

export interface FilterState {
  colors: number[];
  sizes: number[];
  minPrice: string;
  maxPrice: string;
  subcategories?: number[];
}

export function FilterDrawer({ isOpen, onClose, onApply, initialFilters, subcategories = [] }: FilterDrawerProps) {
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>(initialFilters.colors);
  const [selectedSizes, setSelectedSizes] = useState<number[]>(initialFilters.sizes);
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(initialFilters.subcategories || []);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFilterData() {
      try {
        const [colorsRes, sizesRes] = await Promise.all([
          apiClient("/colors"),
          apiClient("/sizes"),
        ]);

        if (colorsRes.success !== false) setColors(colorsRes.data || colorsRes);
        if (sizesRes.success !== false) setSizes(sizesRes.data || sizesRes);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      fetchFilterData();
    }
  }, [isOpen]);

  // Sync with initialFilters when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedColors(initialFilters.colors);
      setSelectedSizes(initialFilters.sizes);
      setSelectedSubcategories(initialFilters.subcategories || []);
      setMinPrice(initialFilters.minPrice);
      setMaxPrice(initialFilters.maxPrice);
    }
  }, [isOpen, initialFilters]);

  const toggleColor = (id: number) => {
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleSize = (id: number) => {
    setSelectedSizes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSubcategory = (id: number) => {
    setSelectedSubcategories((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApply({
      colors: selectedColors,
      sizes: selectedSizes,
      minPrice,
      maxPrice,
      subcategories: selectedSubcategories,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedSubcategories([]);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 transition-all duration-500",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-in-out transform flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-900" />
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest">Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w- 6 h-6 text-gray-900" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6C655D] mb-4">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => toggleSubcategory(sub.id)}
                    className={cn(
                      "cursor-pointer px-4 py-2 rounded-lg border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                      selectedSubcategories.includes(sub.id)
                        ? "border-[#8C0000] bg-[#8C0000] text-white"
                        : "border-gray-100 bg-gray-50 text-gray-900 hover:border-gray-200"
                    )}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6C655D] mb-4">Colors</h4>
            {isLoading ? (
              <div className="flex gap-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => toggleColor(color.id)}
                    className={cn(
                      "cursor-pointer w-8 h-8 rounded-full border-2 transition-all p-0.5",
                      selectedColors.includes(color.id)
                        ? "border-[#8C0000] scale-110"
                        : "border-gray-200"
                    )}
                    title={color.name}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color.code }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6C655D] mb-4">Sizes</h4>
            {isLoading ? (
              <div className="flex gap-2 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-lg bg-gray-200" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => toggleSize(size.id)}
                    className={cn(
                      "cursor-pointer min-w-10 h-10 px-3 rounded-lg border-2 text-[10px] font-black transition-all",
                      selectedSizes.includes(size.id)
                        ? "border-[#8C0000] bg-[#8C0000] text-white"
                        : "border-gray-100 bg-gray-50 text-gray-900 hover:border-gray-200"
                    )}
                  >
                    {(size as any).size_code || size.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6C655D] mb-4">Price Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Min Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₦</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-8 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#8C0000]/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Max Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₦</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="50,000"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-8 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#8C0000]/20 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3">
          <button
            onClick={handleApply}
            className="cursor-pointer w-full bg-[#8C0000] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-black transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="cursor-pointer w-full bg-white text-gray-900 py-4 rounded-xl font-black uppercase tracking-widest text-sm border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}
