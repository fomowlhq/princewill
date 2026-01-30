"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Loader2, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface OrderItem {
    id: number;
    product_id: number;
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
    status: string;
    subtotal: number;
    shipping_fee: number;
    tax: number;
    discount: number;
    amount: number;
    payment_type: string;
    payment_method: string;
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

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { formatPrice: formatCurrency } = useCurrency();

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient(`/orders/${orderId}`);
            if (res.success) {
                setOrder(res.order);
            } else {
                toast.error("Order not found");
            }
        } catch (error) {
            toast.error("Failed to load order details");
        } finally {
            setIsLoading(false);
        }
    };

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
            }),
            time: date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }),
        };
    };

    const isStatusCompleted = (status: string, checkStatus: string[]) => {
        return checkStatus.includes(status.toLowerCase());
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#8C0000] animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-20">
                <div className="container-custom text-center">
                    <p className="text-gray-500">Order not found</p>
                    <Link href="/account/orders" className="text-[#8C0000] underline mt-4 inline-block">
                        Back to Order History
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-white pt-32 pb-20 overflow-x-hidden">
                <div className="container-custom">
                    {/* Breadcrumb */}
                    <nav className="mb-4" aria-label="Breadcrumb">
                        <ol className="flex flex-wrap items-center gap-1 md:gap-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm md:text-base font-normal text-[#C4C1BE] hover:text-gray-600 transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="text-[#C4C1BE]">|</li>
                            <li>
                                <Link
                                    href="/account"
                                    className="text-sm md:text-base font-normal text-[#C4C1BE] hover:text-gray-600 transition-colors"
                                >
                                    Profile
                                </Link>
                            </li>
                            <li className="text-[#C4C1BE]">|</li>
                            <li>
                                <Link
                                    href="/account/orders"
                                    className="text-sm md:text-base font-normal text-[#C4C1BE] hover:text-gray-600 transition-colors"
                                >
                                    Order history
                                </Link>
                            </li>
                            <li className="text-[#C4C1BE]">|</li>
                            <li className="text-sm md:text-base font-normal text-[#100E0C]">Order Detail</li>
                        </ol>
                    </nav>

                    {/* Page Title */}
                    <div className="my-6">
                        <h1 className="text-4xl text-[#100E0C]">Order Details</h1>
                        <div className="mt-8 w-full flex md:w-[35%] justify-between gap-4">
                            <p className="text-sm md:text-base font-semibold text-[#100E0C]">
                                Order No. {order.invoice_no}
                            </p>
                            <p className="text-sm md:text-base text-[#100E0C] whitespace-nowrap">
                                {formatDate(order.order_date)}
                            </p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                        {/* Items In Your Order - Left Column */}
                        <div className="md:col-span-5">
                            <div className="bg-[#D3D3D333]">
                                <h3 className="text-lg bg-[#D3D3D3CC] px-4 py-1 text-[#100E0C] 2xl:text-2xl">
                                    Items In Your Order
                                </h3>
                                <div className="mt-6 space-y-3 px-4 pb-4">
                                    {order.items.length > 0 ? (
                                        order.items.map((item) => (
                                            <div key={item.id} className="grid grid-cols-12 gap-0">
                                                <div className="col-span-5 md:col-span-4 flex items-stretch">
                                                    <Image
                                                        src={getProductImage(item.product?.images || "")}
                                                        alt={item.product?.name || "Product"}
                                                        width={200}
                                                        height={225}
                                                        className="h-auto md:h-[164px] w-full object-cover"
                                                    />
                                                </div>
                                                <div className="col-span-7 md:col-span-8 flex">
                                                    <div className="flex w-full flex-col md:flex-row overflow-hidden">
                                                        <div className="w-full space-y-1 px-2 md:px-3 md:w-[55%]">
                                                            <p className="text-sm md:text-base font-medium text-[#100E0C] wrap-break-word">
                                                                {item.product?.name}
                                                            </p>
                                                            <p className="text-sm md:text-base font-semibold text-[#100E0C]">
                                                                {formatCurrency(item.price * item.qty)}
                                                            </p>
                                                            <p className="text-xs md:text-base text-[#4E463D]">
                                                                {item.product?.category?.name || "N/A"}
                                                            </p>
                                                            <p className="text-xs md:text-base text-[#4E463D]">Qty: {item.qty}</p>
                                                            <p className="text-xs md:text-base text-[#4E463D]">
                                                                Color: {item.color?.name || "N/A"}
                                                            </p>
                                                            <p className="text-xs md:text-base text-[#4E463D]">
                                                                Size: {item.size?.size_code || "N/A"}
                                                            </p>
                                                        </div>
                                                        <div className="flex w-full items-start md:items-center px-2 md:px-3 my-2 md:my-0 md:w-[45%]">
                                                            <Link
                                                                href={`/product/${item.product?.slug}`}
                                                                className="block w-full rounded-md border border-[#8C0000] px-2 py-1.5 text-center text-sm md:text-base font-medium text-[#8C0000] hover:bg-[#8C0000] hover:text-white transition-colors"
                                                            >
                                                                Re-Order
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">No items found</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="md:col-span-7">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                {/* Payment Information */}
                                <div className="md:col-span-5 flex items-stretch">
                                    <div className="w-full bg-[#D3D3D333]">
                                        <h3 className="text-lg bg-[#D3D3D3CC] px-4 py-1 text-[#100E0C] 2xl:text-2xl">
                                            Payment Information
                                        </h3>
                                        <div className="mt-8 w-full px-4 mb-4">
                                            <p className="mb-4 text-base text-[#100E0C]">Payment Details</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[#27231F]">
                                                    <p className="text-sm">Items Subtotal:</p>
                                                    <p className="text-sm">{formatCurrency(order.subtotal || 0)}</p>
                                                </div>
                                                <div className="flex justify-between text-[#27231F]">
                                                    <p className="text-sm">Shipping Fee:</p>
                                                    <p className="text-sm">{formatCurrency(order.shipping_fee || 0)}</p>
                                                </div>
                                                <div className="flex justify-between text-[#27231F]">
                                                    <p className="text-sm">Tax:</p>
                                                    <p className="text-sm">{formatCurrency(order.tax || 0)}</p>
                                                </div>
                                                <div className="flex justify-between text-[#27231F]">
                                                    <p className="text-sm">Discount:</p>
                                                    <p className="text-sm">{formatCurrency(order.discount || 0)}</p>
                                                </div>
                                                <div className="flex justify-between text-[#27231F]">
                                                    <p className="text-sm font-semibold">Order Total:</p>
                                                    <p className="text-sm font-semibold">{formatCurrency(order.amount || 0)}</p>
                                                </div>
                                            </div>

                                            <div className="mt-6 space-y-2">
                                                <p className="text-base text-[#100E0C]">Payment Method Used</p>
                                                <p className="text-sm text-[#4E463D]">{order.payment_type || "N/A"}</p>
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                <p className="text-base text-[#100E0C]">Payment Method Type</p>
                                                <p className="text-sm text-[#4E463D]">{order.payment_method || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Package History & Delivery Info */}
                                <div className="md:col-span-7">
                                    {/* Package History */}
                                    <div className="w-full bg-[#D3D3D333]">
                                        <h3 className="text-lg bg-[#D3D3D3CC] px-4 py-1 text-[#100E0C] 2xl:text-2xl">
                                            Package History
                                        </h3>

                                        {order.status === "cancelled" ? (
                                            <div className="flex justify-center items-center h-[140px]">
                                                <span className="bg-red-100 text-red-800 text-xl font-medium px-2.5 py-0.5 rounded-sm uppercase">
                                                    {order.status}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="w-full overflow-x-auto px-4 pb-16 pt-8">
                                                {/* Stepper - matches Laravel design */}
                                                <div className="flex items-center min-w-[450px]">
                                                    {/* Start line */}
                                                    <div className="m-0 h-2 w-4 shrink-0 rounded-s-2xl bg-[#2E3131] p-0"></div>

                                                    {/* Order Placed */}
                                                    <div className="relative flex justify-center shrink-0">
                                                        <CheckSquare className="w-6 h-6 text-black" />
                                                        <span className="absolute left-1/2 -translate-x-1/2 top-8 text-center text-xs text-[#100E0C] whitespace-nowrap">
                                                            Order Placed
                                                        </span>
                                                        {order.order_date && (
                                                            <span className="absolute left-1/2 top-[52px] w-max -translate-x-1/2 text-center text-[10px] text-[#100E0C] leading-tight">
                                                                <span className="block">{formatDateTime(order.order_date).date}</span>
                                                                <span className="block">{formatDateTime(order.order_date).time}</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="h-2 flex-1 bg-[#D3D3D3]"></div>

                                                    {/* Preparing Shipment */}
                                                    <div className="relative flex items-center shrink-0">
                                                        {isStatusCompleted(order.status, ["processing", "shipped", "delivered", "completed"]) ? (
                                                            <CheckSquare className="w-6 h-6 text-black" />
                                                        ) : (
                                                            <Square className="w-6 h-6 text-[#D3D3D3]" />
                                                        )}
                                                        <span className="absolute left-1/2 -translate-x-1/2 top-8 text-center text-xs text-[#100E0C] whitespace-nowrap">
                                                            Preparing Shipment
                                                        </span>
                                                        {isStatusCompleted(order.status, ["processing", "shipped", "delivered", "completed"]) &&
                                                            order.processing_date && (
                                                                <span className="absolute left-1/2 top-[52px] w-max -translate-x-1/2 text-center text-[10px] text-[#100E0C] leading-tight">
                                                                    <span className="block">{formatDateTime(order.processing_date).date}</span>
                                                                    <span className="block">{formatDateTime(order.processing_date).time}</span>
                                                                </span>
                                                            )}
                                                    </div>

                                                    <div className="h-2 flex-1 bg-[#D3D3D3]"></div>

                                                    {/* Out For Delivery */}
                                                    <div className="relative flex items-center shrink-0">
                                                        {isStatusCompleted(order.status, ["shipped", "delivered", "completed"]) ? (
                                                            <CheckSquare className="w-6 h-6 text-black" />
                                                        ) : (
                                                            <Square className="w-6 h-6 text-[#D3D3D3]" />
                                                        )}
                                                        <span className="absolute left-1/2 -translate-x-1/2 top-8 text-center text-xs text-[#100E0C] whitespace-nowrap">
                                                            Out For Delivery
                                                        </span>
                                                        {isStatusCompleted(order.status, ["shipped", "delivered", "completed"]) &&
                                                            order.shipped_date && (
                                                                <span className="absolute left-1/2 top-[52px] w-max -translate-x-1/2 text-center text-[10px] text-[#100E0C] leading-tight">
                                                                    <span className="block">{formatDateTime(order.shipped_date).date}</span>
                                                                    <span className="block">{formatDateTime(order.shipped_date).time}</span>
                                                                </span>
                                                            )}
                                                    </div>

                                                    <div className="h-2 flex-1 bg-[#D3D3D3]"></div>

                                                    {/* Delivered */}
                                                    <div className="relative flex items-center shrink-0">
                                                        {isStatusCompleted(order.status, ["delivered", "completed"]) ? (
                                                            <CheckSquare className="w-6 h-6 text-green-600" />
                                                        ) : (
                                                            <Square className="w-6 h-6 text-[#D3D3D3]" />
                                                        )}
                                                        <span className="absolute left-1/2 -translate-x-1/2 top-8 text-center text-xs text-[#100E0C] whitespace-nowrap">
                                                            Delivered
                                                        </span>
                                                        {isStatusCompleted(order.status, ["delivered", "completed"]) &&
                                                            order.delivered_date && (
                                                                <span className="absolute left-1/2 top-[52px] w-max -translate-x-1/2 text-center text-[10px] text-[#100E0C] leading-tight">
                                                                    <span className="block">{formatDateTime(order.delivered_date).date}</span>
                                                                    <span className="block">{formatDateTime(order.delivered_date).time}</span>
                                                                </span>
                                                            )}
                                                    </div>

                                                    {/* End line */}
                                                    <div className="h-2 w-4 shrink-0 rounded-e-2xl bg-[#D3D3D3]"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Delivery Information */}
                                    <div className="mt-3 bg-[#D3D3D333] pb-3">
                                        <h3 className="text-lg bg-[#D3D3D3CC] px-4 py-1 text-[#100E0C] 2xl:text-2xl">
                                            Delivery Information
                                        </h3>
                                        <div className="mb-4 mt-8 w-full px-4">
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-base text-[#100E0C]">Shipping Address</p>
                                                    <p className="text-sm text-[#4E463D] wrap-break-word">
                                                        {order.address || ""}
                                                        {order.city?.name ? `, ${order.city.name}` : ""}
                                                        {order.state?.name ? `, ${order.state.name}` : ""}
                                                        {order.country?.name ? `, ${order.country.name}` : ""}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-base text-[#100E0C]">Shipping Method Used</p>
                                                    <p className="text-sm text-[#4E463D] capitalize">
                                                        {order.shipping_method || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
