"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { WishlistDrawer } from "../wishlist/WishlistDrawer";
import { apiClient } from "@/lib/api-client";

// Sub-components
import { AuthDrawer } from "./AuthDrawer";
import { SearchModal } from "./SearchModal";
import { MobileMenu } from "./MobileMenu";
import { CartDrawer } from "./CartDrawer";
import { DesktopNav } from "./DesktopNav";
import { UserMenu } from "./UserMenu";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import Image from "next/image";

interface NavbarProps {
  variant?: "transparent" | "solid";
}

// Pages that don't have a hero and need solid navbar styling
const SOLID_NAVBAR_PATHS = [
  "/product/",
  "/search",
  "/cart",
  "/checkout",
  "/account",
  "/subcategory/",
  "/category",
  "/collections/",
  "/reset-password",
  "/about",
  "/policy",
  "/affiliate",
  "/verify-email",
  "order-success",
];

export default function Navbar({ variant = "transparent" }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if current page needs solid navbar
  const needsSolidNavbar = SOLID_NAVBAR_PATHS.some(path => pathname.startsWith(path));

  // Use solid styling when variant is solid, on solid pages, OR when scrolled
  const useSolidStyle = variant === "solid" || needsSolidNavbar || isScrolled;
  const { cartItems, cartCount, cartTotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot-password">("login");
  const [user, setUser] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient('/categories');
        const categories = response.data;

        // Transform categories into MenuItem structure
        const dynamicItems: any[] = [
          {
            name: "NEW ARRIVALS",
            href: "/new-arrivals",
            hasDropdown: true,
            dropdownItems: categories.map((cat: any) => ({
              name: cat.name,
              href: `/category/${cat.slug}`,
              hasSubmenu: cat.sub_categories && cat.sub_categories.length > 0,
              submenuItems: cat.sub_categories ? cat.sub_categories.map((sub: any) => ({
                name: sub.name,
                href: `/subcategory/${sub.slug}`
              })) : []
            }))
          },
          ...categories.map((cat: any) => ({
            name: cat.name.toUpperCase(),
            href: `/category/${cat.slug}`,
            hasDropdown: cat.sub_categories && cat.sub_categories.length > 0,
            dropdownItems: cat.sub_categories ? cat.sub_categories.map((sub: any) => ({
              name: sub.name,
              href: `/subcategory/${sub.slug}`
            })) : []
          }))
        ];

        setMenuItems(dynamicItems);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();

    const savedUser = localStorage.getItem("user-data");
    if (savedUser && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Check affiliate status from API if user is logged in and not marked as affiliate
        const token = localStorage.getItem("auth-token");
        if (token && !parsedUser.isAffiliate) {
          apiClient('/affiliate/dashboard').then(res => {
            // If dashboard returns success, user is an affiliate
            if (res.success) {
              const updatedUser = { ...parsedUser, isAffiliate: true };
              setUser(updatedUser);
              localStorage.setItem("user-data", JSON.stringify(updatedUser));
            }
          }).catch(() => {
            // Silently fail - user is not an affiliate or API error
          });
        }
      } catch (e) {
        console.error("Failed to parse user-data:", e);
        localStorage.removeItem("user-data");
      }
    }

    // Listen for auth state changes from other components (like cart page AuthDrawer)
    const handleAuthChange = (event: CustomEvent) => {
      if (event.detail?.user) {
        setUser(event.detail.user);
      } else if (event.detail?.logout) {
        setUser(null);
      }
    };
    window.addEventListener('auth-state-changed', handleAuthChange as EventListener);

    // Listen for requests to open the auth modal from other components
    const handleOpenAuthModal = (event: CustomEvent) => {
      const mode = event.detail?.mode || 'login';
      setAuthMode(mode);
      setAuthOpen(true);
    };
    window.addEventListener('open-auth-modal', handleOpenAuthModal as EventListener);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (e: MouseEvent) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('auth-state-changed', handleAuthChange as EventListener);
      window.removeEventListener('open-auth-modal', handleOpenAuthModal as EventListener);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || cartOpen || searchOpen || authOpen || wishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, cartOpen, searchOpen, authOpen, wishlistOpen]);

  const handleLogout = async () => {
    try {
      await apiClient('/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');

      // Dispatch custom event to notify other components of logout
      window.dispatchEvent(new CustomEvent('auth-state-changed', {
        detail: { logout: true }
      }));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // With live search, we might not need to navigate. 
    // If the user hits enter, we can either navigate to a full page or just close the modal if they are happy with results.
    // For now, let's keep the navigation as a fallback but maybe the user will prefer staying in the modal.
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    // Remove immediate navigation to allow live results to show in modal
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        useSolidStyle ? "bg-white shadow-md" : mobileMenuOpen ? "bg-black shadow-lg" : "bg-transparent"
      )}
    >
      {/* Desktop Header */}
      <div className="hidden lg:block py-4">
        <div className="container-custom">
          <div className="grid grid-cols-3 items-center">
            {/* Left: Affiliate */}
            <div className="flex justify-start">
              <Link
                href={user?.isAffiliate ? "/affiliate/dashboard" : "/affiliate"}
                className="bg-[#8C0000] hover:bg-[#6B0000] text-white px-6 py-2 rounded-md text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                {user?.isAffiliate ? "Affiliate Dashboard" : "Become an Affiliate"}
              </Link>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <Link href="/" className="flex items-center cursor-pointer">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex justify-end items-center gap-6">
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "transition-colors cursor-pointer",
                  useSolidStyle ? "text-gray-600 hover:text-black" : "text-white hover:text-white/80"
                )}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Currency */}
              <div className="relative" ref={currencyDropdownRef}>
                <button
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className={cn(
                    "flex items-center gap-1.5 font-medium text-sm cursor-pointer",
                    useSolidStyle ? "text-gray-600" : "text-white"
                  )}
                >
                  {currency === "NGN" ? (
                    <div className="w-5 h-3.5 relative overflow-hidden flex rounded-[1px]">
                      <div className="w-1/3 h-full bg-green-600" />
                      <div className="w-1/3 h-full bg-white" />
                      <div className="w-1/3 h-full bg-green-600" />
                    </div>
                  ) : (
                    <div className="w-5 h-3.5 relative overflow-hidden bg-[#002868] rounded-[1px] flex items-start">
                      <div className="absolute inset-0 flex flex-col">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-[#BF0A30]" : "bg-white"}`} />
                        ))}
                      </div>
                      <div className="absolute top-0 left-0 w-[40%] h-[57%] bg-[#002868]" />
                    </div>
                  )}
                  <span>{currency === "NGN" ? "NGN ₦" : "USD $"}</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", currencyDropdownOpen && "rotate-180")} />
                </button>

                {currencyDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100 z-50">
                    <button
                      onClick={() => { setCurrency("NGN"); setCurrencyDropdownOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer",
                        currency === "NGN" ? "bg-gray-50 font-semibold text-gray-900" : "text-gray-600"
                      )}
                    >
                      <div className="w-5 h-3.5 relative overflow-hidden flex rounded-[1px] shrink-0">
                        <div className="w-1/3 h-full bg-green-600" />
                        <div className="w-1/3 h-full bg-white" />
                        <div className="w-1/3 h-full bg-green-600" />
                      </div>
                      <span>NGN ₦</span>
                    </button>
                    <button
                      onClick={() => { setCurrency("USD"); setCurrencyDropdownOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer",
                        currency === "USD" ? "bg-gray-50 font-semibold text-gray-900" : "text-gray-600"
                      )}
                    >
                      <div className="w-5 h-3.5 relative overflow-hidden bg-[#002868] rounded-[1px] flex items-start shrink-0">
                        <div className="absolute inset-0 flex flex-col">
                          {[...Array(7)].map((_, i) => (
                            <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-[#BF0A30]" : "bg-white"}`} />
                          ))}
                        </div>
                        <div className="absolute top-0 left-0 w-[40%] h-[57%] bg-[#002868]" />
                      </div>
                      <span>USD $</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setWishlistOpen(true)}
                className={cn(
                  "cursor-pointer transition-colors relative",
                  useSolidStyle ? "text-gray-600 hover:text-black" : "text-white hover:text-white/80"
                )}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8C0000] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black/50">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <div className="relative group/cart pt-1">
                <Link href="/cart" className={cn(
                  "relative block transition-colors p-1 cursor-pointer",
                  useSolidStyle ? "text-gray-600 hover:text-black" : "text-white hover:text-white/80"
                )}>
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#8C0000] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black/50">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* Mini Cart Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-2xl rounded-2xl opacity-0 invisible group-hover/cart:opacity-100 group-hover/cart:visible transition-all duration-300 transform translate-y-4 group-hover/cart:translate-y-0 z-50 overflow-hidden border border-gray-100">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-gray-900 font-black text-xs uppercase tracking-widest">Your Bag</h3>
                    <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded">{cartCount} ITEMS</span>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="p-8 text-center bg-white">
                      <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gray-50 rounded-full animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingCart className="w-10 h-10 text-gray-200" />
                        </div>
                      </div>
                      <p className="text-gray-900 font-black text-base mb-1">BAG IS EMPTY</p>
                      <p className="text-gray-400 text-[11px] mb-8 leading-relaxed px-4">
                        Your shopping bag is currently empty. Start exploring our latest collections.
                      </p>
                      <Link
                        href="/"
                        className="inline-block w-full bg-[#8C0000] text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all duration-300"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                        {cartItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              {item.image && (
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                              <p className="text-[10px] text-gray-400">Qty: {item.qty}</p>
                              <p className="text-xs font-bold text-[#8C0000]">
                                {formatPrice(item.price * item.qty)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {cartItems.length > 3 && (
                          <p className="text-[10px] text-gray-400 text-center">+{cartItems.length - 3} more items</p>
                        )}
                      </div>
                      <div className="p-4 border-t border-gray-100 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-gray-600">Subtotal:</span>
                          <span className="font-black text-gray-900">
                            {formatPrice(cartTotal)}
                          </span>
                        </div>
                        <Link
                          href="/cart"
                          className="block w-full bg-[#8C0000] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest text-center hover:bg-black transition-all"
                        >
                          View Bag & Checkout
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {user ? (
                <UserMenu user={user} onLogout={handleLogout} isScrolled={useSolidStyle} />
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthOpen(true);
                  }}
                  className={cn(
                    "cursor-pointer font-medium text-sm transition-colors",
                    useSolidStyle ? "text-gray-600 hover:text-black" : "text-white hover:text-white/80"
                  )}
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <DesktopNav items={menuItems} isScrolled={useSolidStyle} />

      {/* Mobile Bar */}
      <div className={cn(
        "lg:hidden flex items-center justify-between h-16 px-4 border-b backdrop-blur-md transition-colors",
        useSolidStyle ? "bg-white/90 border-gray-100" : "bg-black/50 border-white/5"
      )}>
        <button
          className={cn(
            "p-2 cursor-pointer transition-colors",
            useSolidStyle ? "text-gray-600" : "text-white"
          )}
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link href="/" className="flex items-center cursor-pointer">
          <img src="/logo.png" alt="Logo" className="h-6 w-40" />
          {/* <span className="text-xl font-black text-[#8C0000] tracking-tighter">PRINCEWILL</span> */}
        </Link>

        <button
          onClick={() => setCartOpen(true)}
          className={cn(
            "relative p-2 cursor-pointer transition-colors",
            useSolidStyle ? "text-gray-600" : "text-white"
          )}
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className={cn(
              "absolute top-1 right-1 bg-[#8C0000] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2",
              useSolidStyle ? "border-white" : "border-black"
            )}>
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        handleLogout={handleLogout}
        setAuthOpen={setAuthOpen}
        setAuthMode={setAuthMode}
        items={menuItems}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Auth Drawer */}
      <AuthDrawer
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        onAuthSuccess={(userData) => {
          setUser(userData);
          // Dispatch custom event to notify other components of login
          window.dispatchEvent(new CustomEvent('auth-state-changed', {
            detail: { user: userData }
          }));
        }}
      />

      {/* Cart Drawer (Mobile) */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />

      {/* Search Modal (Desktop) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleQuickSearch={handleQuickSearch}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />
    </header>
  );
}
