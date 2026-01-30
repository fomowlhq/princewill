"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckSquare, Square, PackageCheck } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { AffiliateCommission, OrderWithTracking } from "@/types";

interface TrackOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function formatDate(dateStr?: string): { date: string; time: string } | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return {
        date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
        time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
}

function isStepComplete(
    status: string,
    step: "placed" | "processing" | "shipped" | "delivered"
): boolean {
    const flow = ["pending", "processing", "shipped", "delivered", "completed"];
    const stepMap: Record<string, number> = {
        placed: 0,
        processing: 1,
        shipped: 2,
        delivered: 3,
    };
    const statusIndex = flow.indexOf(status);
    return statusIndex >= stepMap[step];
}

const STEPS = [
    { key: "placed" as const, label: "Order Placed", dateField: "orderDate" as const },
    { key: "processing" as const, label: "Preparing Shipment", dateField: "processingDate" as const },
    { key: "shipped" as const, label: "Out For Delivery", dateField: "shippedDate" as const },
    { key: "delivered" as const, label: "Delivered", dateField: "deliveredDate" as const },
];

export function TrackOrderModal({ isOpen, onClose }: TrackOrderModalProps) {
    const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCommissions();
        }
    }, [isOpen]);

    const fetchCommissions = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient("/affiliate/commissions");
            if (res.success) {
                setCommissions(res.data.commissions || []);
            }
        } catch {
            // silently fail
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="relative mx-4 w-full max-w-2xl rounded-xl bg-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between rounded-t-xl border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <PackageCheck className="h-5 w-5 text-[#8C0000]" />
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Track Order Status
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-[#8C0000]" />
                                </div>
                            ) : commissions.length === 0 ? (
                                <div className="py-12 text-center text-gray-500">
                                    No commission orders found.
                                </div>
                            ) : (
                                commissions.map((item) => {
                                    if (!item.order) return null;
                                    const order = item.order;

                                    if (order.status === "cancelled") {
                                        return (
                                            <div
                                                key={item.id}
                                                className="rounded-lg bg-gray-50 overflow-hidden"
                                            >
                                                <h4 className="bg-gray-200/80 px-4 py-2 text-sm font-medium text-gray-800">
                                                    Order #{order.id}
                                                </h4>
                                                <div className="flex items-center justify-center py-8">
                                                    <span className="rounded bg-red-100 px-3 py-1 text-sm font-medium uppercase text-red-800">
                                                        Cancelled
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded-lg bg-gray-50 overflow-hidden"
                                        >
                                            <h4 className="bg-gray-200/80 px-4 py-2 text-sm font-medium text-gray-800">
                                                Order #{order.id}
                                            </h4>
                                            <div className="px-4 py-6 ml-4">
                                                {/* Stepper */}
                                                <div className="flex items-center">
                                                    {STEPS.map((step, i) => {
                                                        const complete = isStepComplete(order.status, step.key);
                                                        const dateInfo = formatDate(order[step.dateField]);
                                                        const isLast = step.key === "delivered";

                                                        return (
                                                            <div key={step.key} className="flex items-center flex-1">
                                                                {/* Step node */}
                                                                <div className="relative flex flex-col items-center">
                                                                    {complete ? (
                                                                        <CheckSquare
                                                                            className={`h-6 w-6 ${isLast && complete ? "text-green-600" : "text-gray-900"}`}
                                                                        />
                                                                    ) : (
                                                                        <Square className="h-6 w-6 text-gray-300" />
                                                                    )}
                                                                    <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-[11px] text-gray-700">
                                                                        {step.label}
                                                                    </span>
                                                                    {dateInfo && complete && (
                                                                        <span className="absolute top-[52px] left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-[10px] leading-tight text-gray-500">
                                                                            <span className="block">{dateInfo.date}</span>
                                                                            <span className="block">{dateInfo.time}</span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {/* Connector line */}
                                                                {i < STEPS.length - 1 && (
                                                                    <div
                                                                        className={`h-0.5 flex-1 mx-1 ${
                                                                            complete ? "bg-gray-900" : "bg-gray-300"
                                                                        }`}
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center rounded-b-xl border-t border-gray-200 px-6 py-4">
                            <button
                                onClick={onClose}
                                className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
