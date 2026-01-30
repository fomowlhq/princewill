"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Check, Home, Package, LogIn } from "lucide-react";
import { AuthDrawer } from "@/components/navbar/AuthDrawer";
import { useCurrency } from "@/context/CurrencyContext";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, cartCount, cartTotal, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Auth drawer state
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot-password">("login");

  // Check auth state on mount and listen for changes
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    setIsLoggedIn(!!token);
    setIsHydrated(true);

    const handleAuthChange = (event: any) => {
      if (event.detail?.user) {
        setIsLoggedIn(true);
      } else if (event.detail?.logout) {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener('auth-state-changed', handleAuthChange as EventListener);

    // Auto-open auth drawer if redirected from checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'login' && !token) {
      setShowAuthDrawer(true);
    }

    return () => window.removeEventListener('auth-state-changed', handleAuthChange as EventListener);
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setIsLoggedIn(true);
    setShowAuthDrawer(false);
    
    // Dispatch custom event to notify Navbar of auth state change
    window.dispatchEvent(new CustomEvent('auth-state-changed', { 
      detail: { user: userData } 
    }));
    
    // Redirect to checkout after successful login
    router.push('/checkout');
  };

  const { formatPrice } = useCurrency();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-[#E4E4E4] pt-28 md:pt-32">
        <div className="container-custom">
          <div className="relative flex items-center justify-between py-8 md:py-12">
            <div className="z-10">
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-medium text-[#050505] leading-tight">
                Your Style, <br className="hidden md:block" />
                <span className="md:hidden"> </span>Your Cart
              </h1>
              <p className="mt-2 text-base md:text-xl text-[#050505]">Review Your Items Before Checkout.</p>
            </div>
            <div className="absolute right-0 top-0 md:relative opacity-30 md:opacity-100">
              <div className="relative w-32 h-40 md:w-48 md:h-60 lg:w-64 lg:h-80">
                <Image
                  src="/images/cart-hero.png"
                  alt="Cart Hero"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container-custom py-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#C4C1BE] hover:text-[#6C655D] transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <span className="text-[#C4C1BE]">|</span>
          <span className="text-[#100E0C]">Cart</span>
        </nav>
        <p className="mt-4 text-base text-[#A9A9A9]">{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</p>
      </div>

      {/* Main Content */}
      <div className="container-custom pb-20">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative w-40 h-40 mb-8">
              <div className="absolute inset-0 bg-linear-to-br from-[#F5F3F0] to-[#E8E6E3] rounded-full shadow-inner" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="w-20 h-20 text-[#C4C1BE]" strokeWidth={1} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#27231F] mb-4">Your cart is empty</h2>
            <p className="text-[#6C655D] mb-10 max-w-md text-lg">
              Looks like you haven&apos;t added any items to your bag yet. Discover our latest collections.
            </p>
            <Link
              href="/"
              className="cursor-pointer inline-flex items-center gap-3 bg-linear-to-r from-[#8C0000] to-[#6B0000] text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-red-900/20 transition-all hover:-translate-y-0.5"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    {/* Product Image */}
                    <div className="relative w-28 md:w-40 shrink-0">
                      {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full min-h-[120px] bg-gray-100 flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-sm md:text-base font-semibold text-[#100E0C] capitalize line-clamp-2">{item.name}</h3>
                            <p className="text-xs text-[#6C655D] mt-1">{formatPrice(item.price)}</p>
                            
                            {/* Size & Color */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.sizeName && (
                                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded text-xs text-[#4E463D]">
                                  Size: <strong className="ml-1">{item.sizeName}</strong>
                                </span>
                              )}
                              {item.colorName && (
                                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded text-xs text-[#4E463D]">
                                  Color: <strong className="ml-1 capitalize">{item.colorName}</strong>
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-base md:text-lg font-bold text-[#27231F] shrink-0">{formatPrice(item.price * item.qty)}</p>
                        </div>
                        
                        {/* Availability */}
                        <div className="flex items-center gap-1.5 mt-3">
                          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                          <span className="text-xs text-emerald-600 font-medium">In Stock</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                        <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.qty - 1))}
                            className="cursor-pointer p-2 text-[#6C655D] hover:text-[#27231F] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-l-full transition-colors"
                            disabled={isLoading || item.qty <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-bold text-[#27231F] w-10 text-center">{item.qty}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            className="cursor-pointer p-2 text-[#6C655D] hover:text-[#27231F] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-r-full transition-colors"
                            disabled={isLoading}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="cursor-pointer flex items-center gap-1.5 text-sm text-[#6C655D] hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button 
                onClick={clearCart}
                className="cursor-pointer text-sm text-[#6C655D] hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Clear Shopping Bag
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32">
                <h2 className="text-lg font-bold text-[#27231F] mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6C655D]">Subtotal ({cartCount} items)</span>
                    <span className="font-semibold text-[#27231F]">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6C655D]">Shipping</span>
                    <span className="text-[#6C655D] italic">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-[#27231F]">Estimated Total</span>
                    <span className="text-xl font-black text-[#27231F]">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                {/* Checkout Button - Conditional based on auth */}
                {isHydrated && !isLoggedIn ? (
                  <button
                    onClick={() => setShowAuthDrawer(true)}
                    className="cursor-pointer flex items-center justify-center gap-2 w-full bg-[#27231F] text-white py-4 rounded-xl font-bold text-center hover:bg-black transition-all"
                  >
                    <LogIn className="w-5 h-5" />
                    Login to Checkout
                  </button>
                ) : (
                  <Link
                    href="/checkout"
                    className="cursor-pointer block w-full bg-linear-to-r from-[#8C0000] to-[#6B0000] text-white py-4 rounded-xl font-bold text-center hover:shadow-lg hover:shadow-red-900/20 transition-all"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Link>
                )}

                <Link
                  href="/"
                  className="cursor-pointer block w-full text-center text-sm text-[#6C655D] mt-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-xs text-[#A9A9A9]">
                    <span>🔒 Secure Checkout</span>
                    <span>•</span>
                    <span>🚚 Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Drawer */}
      <AuthDrawer
        isOpen={showAuthDrawer}
        onClose={() => setShowAuthDrawer(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

