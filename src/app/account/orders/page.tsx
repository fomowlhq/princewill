"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("recent");
    const { formatPrice: formatCurrency } = useCurrency();

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient(`/orders`);
            if (res.success) {
                setOrders(res.orders || []);
            }
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.invoice_no.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-[#4D5251]';
            case 'processing': return 'bg-orange-300';
            case 'shipped': return 'bg-cyan-400';
            case 'delivered': return 'bg-green-200';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-green-400';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <ProtectedRoute>
            <div className="section-padding overflow-hidden pt-32 pb-20 bg-white">
                <div className="container-custom">
                    {/* Breadcrumb */}
                    <div className="mb-4">
                        <nav className="justify-between" aria-label="Breadcrumb">
                            <ol className="mb-3 inline-flex items-center space-x-1">
                                <li>
                                    <div className="flex items-center">
                                        <Link href="/" className="text-sm md:text-base font-normal text-[#C4C1BE] hover:text-gray-600">
                                            Home
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <Link href="/account">
                                        <div className="flex items-center">
                                            <span className="text-[#C4C1BE]">|</span>
                                            <span className="mx-1 text-sm md:text-base font-normal text-[#C4C1BE]">Profile</span>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <span className="text-[#C4C1BE]">|</span>
                                        <span className="mx-1 text-sm md:text-base font-normal text-[#100E0C]">Order history</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="">
                        {/* Title */}
                        <h3 className="bg-[#FCF2F2] py-2 text-center text-2xl font-medium capitalize">Order history</h3>

                        <div className="mt-6">
                            {/* Search and Filter */}
                            <div className="flex flex-col md:items-center md:justify-between gap-5 md:flex-row">
                                {/* Search Form */}
                                <form className="w-full md:w-[371px]">
                                    <label htmlFor="default-search" className="sr-only mb-2 text-sm font-medium text-gray-900">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            id="default-search"
                                            className="block w-full rounded-sm border border-[#737B7A] bg-[#FEFEFE] p-2 ps-4 text-sm text-[#A6A29E] focus:outline-none focus:ring-1 focus:ring-[#737B7A]"
                                            placeholder="Enter your order number"
                                        />
                                        <button type="button" className="absolute bottom-0 end-2 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white">
                                            <Search className="w-4 h-4 text-[#A6A29E]" />
                                        </button>
                                    </div>
                                </form>

                                {/* Date Filter */}
                                <div className="max-sm:w-1/2">
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        id="order-filter"
                                        className="block w-full rounded-sm border border-[#737B7A] bg-[#FEFEFE] p-2 text-sm font-medium text-[#100E0C] focus:outline-none focus:ring-1 focus:ring-[#737B7A]"
                                    >
                                        <option value="recent">Most recent</option>
                                        <option value="last_month">Last Month</option>
                                        <option value="april_june">June - April</option>
                                        <option value="jan_march">March - January</option>
                                    </select>
                                </div>
                            </div>

                            {/* Order List */}
                            <div className="mt-6">
                                {isLoading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="w-8 h-8 text-[#8C0000] animate-spin" />
                                    </div>
                                ) : filteredOrders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center gap-4 py-10">
                                        <p className="text-xl text-gray-500">You haven't placed any orders yet</p>
                                        <Link href="/" className="bg-[#8C0000] px-6 py-2 text-sm text-white rounded">
                                            Start Shopping
                                        </Link>
                                    </div>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <div key={order.id} className="item my-5">
                                            <div className="flex w-full flex-col bg-[#D3D3D333] md:h-[150px] md:flex-row">
                                                {/* Order Info */}
                                                <div className="w-full space-y-2 py-2 pl-6 md:w-[70%]">
                                                    <p className="text-base text-[#4E463D]">Order No. {order.invoice_no}</p>
                                                    <p className="text-base font-semibold text-[#100E0C]">
                                                        {formatCurrency(order.amount ?? 0)}
                                                    </p>
                                                    <p className="text-base text-[#4E463D]">
                                                        Qty: {order.items?.reduce((sum: number, item: any) => sum + item.qty, 0) || 0}
                                                    </p>
                                                    <span className={cn(
                                                        "me-2 rounded-sm px-2.5 py-0.5 text-sm text-white inline-block",
                                                        getStatusColor(order.status)
                                                    )}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>

                                                {/* View Details & Date */}
                                                <div className="w-full md:w-[30%] flex flex-col justify-between">
                                                    <Link
                                                        href={`/account/orders/${order.id}`}
                                                        className="block w-full whitespace-nowrap rounded-b-md md:rounded-b-none md:rounded-tr-md bg-[#8C0000] py-2.5 text-center text-base font-medium text-[#FAFDFD] hover:bg-red-800 transition-colors"
                                                    >
                                                        View Details
                                                    </Link>
                                                    <div className="text-right p-3 text-sm text-gray-600 mt-auto">
                                                        {formatDate(order.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
