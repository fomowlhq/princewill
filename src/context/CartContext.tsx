"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  slug: string;
  qty: number;
  price: number;
  image: string;
  sizeId?: number;
  sizeName?: string;
  colorId?: number;
  colorName?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  getCartForCheckout: () => CartItem[];
}

const CART_STORAGE_KEY = 'princewill_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate unique ID for cart items
const generateId = () => Date.now() + Math.random();

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Calculate totals
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setCartItems(parsed);
        } catch (e) {
          console.error('Failed to parse saved cart:', e);
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } else {
        setCartItems([]);
      }
    };

    loadCart();
    setIsHydrated(true);

    // Listen for cart updates from other components (e.g., payment callback)
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  // Save cart to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setIsLoading(true);
    
    setCartItems(prev => {
      // Check if item with same productId and sizeId already exists
      const existingIndex = prev.findIndex(
        item => item.productId === newItem.productId && item.sizeId === newItem.sizeId
      );

      if (existingIndex > -1) {
        // Update quantity of existing item
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + newItem.qty
        };
        return updated;
      }

      // Add new item
      return [...prev, { ...newItem, id: generateId() }];
    });

    setTimeout(() => setIsLoading(false), 300);
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, qty: quantity } : item
      )
    );
  };

  const removeItem = (itemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Get cart data formatted for checkout API
  const getCartForCheckout = () => {
    return cartItems;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        cartCount,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        getCartForCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
