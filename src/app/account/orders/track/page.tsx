"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api-client";
import { Loader2, CheckSquare, Square, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface OrderItem {
    id: number;
    qty: number;
    price: number;
    color?: { name: string };
    size?: { size_code: string };
    product: {
        id: number;
        name: string;
        slug: string;
        images: string | string[];
        category?: { name: string };
    };
}

interface Order {
    id: number;
    invoice_no: string;
    order_date: string;
    created_at: string;
    status: string;
    subtotal: number;
    shipping_fee: number;
    tax: number;
    discount: number;
    amount: number;
    shipping_method: string;
    address: string;
    processing_date?: string;
    shipped_date?: string;
    delivered_date?: string;
    country?: { name: string };
    state?: { name: string };
    city?: { name: string };
    items: OrderItem[];
}

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getProductImage = (images: string | string[]): string => {
        let imageArray: string[] = [];
        if (typeof images === "string") {
            try {
                imageArray = JSON.parse(images);
            } catch {
                imageArray = [images];
            }
        } else if (Array.isArray(images)) {
            imageArray = images;
        }
        const firstImage = imageArray[0] || "";
        return firstImage.startsWith("http")
            ? firstImage
            : `${process.env.NEXT_PUBLIC_STORAGE_URL}/${firstImage}`;
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
            time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        };
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const isStatusCompleted = (status: string, checkStatus: string[]) => {
        return checkStatus.includes(status.toLowerCase());
    };

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;

        setIsLoading(true);
        setOrder(null);
        setNotFound(false);

        try {
            const res = await apiClient("/orders/track", {
                method: "POST",
                body: JSON.stringify({ order_number: orderNumber }),
            });
            if (res.success) {
                setOrder(res.order);
            } else {
                setNotFound(true);
            }
        } catch {
            toast.error("Failed to track order");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="section-padding overflow-x-hidden pt-32 pb-20 bg-white">
                <div className="container-custom">
                    {/* Breadcrumb ... (rest of the file content) */}
                    <div className="mb-4">
                        {/* ... */}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
