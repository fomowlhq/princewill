"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeItem, isLoading } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <div
      className={cn(
        "lg:hidden fixed inset-0 z-120 transition-all duration-500",
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
          "absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-gray-900" />
              <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest">Shopping Bag</h3>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{cartCount}</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-10 text-center">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-gray-50 rounded-full scale-110" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-gray-200" />
                </div>
              </div>
              <h4 className="text-gray-900 font-black text-xl mb-2">YOUR BAG IS EMPTY</h4>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed">
                Add your favorite items to your bag. They will stay here until you're ready to checkout.
              </p>
              <Link
                href="/"
                onClick={onClose}
                className="w-full bg-[#8C0000] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl text-center"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-gray-50 p-3 rounded-xl">
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#100E0C] line-clamp-2">{item.name}</p>
                        <p className="text-sm font-bold text-[#8C0000] mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.qty - 1))}
                            className="p-2 text-gray-400 hover:text-gray-600"
                            disabled={isLoading}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-gray-900 w-6 text-center">{item.qty}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                            disabled={isLoading}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#6C655D]">Subtotal</span>
                  <span className="text-lg font-black text-[#27231F]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <Link 
                  href="/cart"
                  onClick={onClose}
                  className="block w-full bg-[#8C0000] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm text-center hover:bg-black transition-colors"
                >
                  View Bag & Checkout
                </Link>
                <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
                  Shipping calculated at checkout
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

