"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { apiClient } from "@/lib/api-client";
import { mapApiProductToFrontend } from "@/lib/product-utils";
import toast from "react-hot-toast";

interface WishlistContextType {
    wishlistItems: Product[];
    wishlistCount: number;
    toggleWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Load user from localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem("user-data");
        if (savedUser && savedUser !== "undefined") {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user-data in WishlistContext:", e);
                localStorage.removeItem("user-data");
            }
        }

        const handleAuthChange = (event: CustomEvent) => {
            if (event.detail?.user) {
                setUser(event.detail.user);
            } else if (event.detail?.logout) {
                setUser(null);
                setWishlistItems([]); // Clear wishlist on logout
            }
        };

        window.addEventListener("auth-state-changed", handleAuthChange as EventListener);
        return () => window.removeEventListener("auth-state-changed", handleAuthChange as EventListener);
    }, []);

    // Fetch or Load wishlist
    useEffect(() => {
        const loadWishlist = async () => {
            setIsLoading(true);
            if (user) {
                try {
                    // Sync local wishlist with backend if exists
                    const localWishlist = JSON.parse(localStorage.getItem("wishlist-items") || "[]");
                    if (localWishlist.length > 0) {
                        const productIds = localWishlist.map((item: Product) => item.id);
                        const res = await apiClient("/wishlist/sync", {
                            method: "POST",
                            body: JSON.stringify({ product_ids: productIds })
                        });
                        if (res.status === "success" && Array.isArray(res.data)) {
                            setWishlistItems(res.data.map((item: any) => mapApiProductToFrontend(item)));
                            localStorage.removeItem("wishlist-items"); // Clear local after sync
                            toast.success("Wishlist synced successfully");
                        }
                    } else {
                        const res = await apiClient("/wishlist");
                        if (res.status === "success" && Array.isArray(res.data)) {
                            setWishlistItems(res.data.map((item: any) => mapApiProductToFrontend(item)));
                        } else if (res.data && Array.isArray(res.data)) {
                            // Fallback in case status is missing but data is present (e.g. wrapper changed)
                            setWishlistItems(res.data.map((item: any) => mapApiProductToFrontend(item)));
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch wishlist:", error);
                    toast.error("Failed to load wishlist");
                }
            } else {
                // Load from localStorage for guests
                const localItems = JSON.parse(localStorage.getItem("wishlist-items") || "[]");
                setWishlistItems(localItems);
            }
            setIsLoading(false);
        };

        loadWishlist();
    }, [user]);

    const toggleWishlist = async (product: Product) => {
        const exists = wishlistItems.some(item => item.id === product.id);

        if (exists) {
            await removeFromWishlist(product.id);
        } else {
            if (user) {
                try {
                    const res = await apiClient("/wishlist", {
                        method: "POST",
                        body: JSON.stringify({ product_id: product.id })
                    });
                    if (res.status === "success") {
                        setWishlistItems(prev => [product, ...prev]);
                        toast.success("Added to wishlist");
                    }
                } catch (error) {
                    console.error("Failed to add to wishlist:", error);
                    toast.error("Failed to add to wishlist");
                }
            } else {
                const newWishlist = [product, ...wishlistItems];
                setWishlistItems(newWishlist);
                localStorage.setItem("wishlist-items", JSON.stringify(newWishlist));
                toast.success("Added to wishlist");
            }
        }
    };

    const removeFromWishlist = async (productId: number) => {
        if (user) {
            try {
                const res = await apiClient(`/wishlist/${productId}`, {
                    method: "DELETE"
                });
                if (res.status === "success") {
                    setWishlistItems(prev => prev.filter(item => item.id !== productId));
                    toast.success("Removed from wishlist");
                }
            } catch (error) {
                console.error("Failed to remove from wishlist:", error);
                toast.error("Failed to remove from wishlist");
            }
        } else {
            const newWishlist = wishlistItems.filter(item => item.id !== productId);
            setWishlistItems(newWishlist);
            localStorage.setItem("wishlist-items", JSON.stringify(newWishlist));
            toast.success("Removed from wishlist");
        }
    };

    const isInWishlist = (productId: number) => {
        return wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                wishlistCount: wishlistItems.length,
                toggleWishlist,
                removeFromWishlist,
                isInWishlist,
                isLoading
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
