"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShippingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ShippingModal({ isOpen, onClose }: ShippingModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-200 flex items-center justify-center px-4"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-xl font-bold text-[#100E0C]">Shipping And Returns</h3>
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded-full p-1 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="text-lg font-bold text-[#100E0C] mb-2">Shipping</h4>
                        <div className="text-sm text-gray-600 leading-relaxed">
                            <p>
                                Shipping will take four to five (4-5) business days within Lagos State, Nigeria, and five to seven (5-7) business days for locations outside Lagos.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-[#100E0C] mb-2">Returns</h4>
                        <div className="text-sm text-gray-600 leading-relaxed">
                            <p>
                                Products purchased on our website must be returned in good condition within three (3) days of delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
