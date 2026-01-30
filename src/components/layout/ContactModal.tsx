"use client";

import { useEffect, useState } from "react";
import { X, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SettingsData {
    email: string;
    phone: string;
    address?: string;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && !settings) {
            const fetchSettings = async () => {
                try {
                    const response = await apiClient('/settings');
                    if (response.success) {
                        setSettings(response.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch settings", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchSettings();
        }
    }, [isOpen, settings]);

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
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#100E0C]">Contact Us</h3>
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded-full p-1 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="py-8 text-center text-gray-500 text-sm">
                        Loading contact info...
                    </div>
                ) : settings ? (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-[#8C0000]">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Us</p>
                                    <a href={`mailto:${settings.email}`} className="text-[#100E0C] font-medium hover:text-[#8C0000] transition-colors break-all">
                                        {settings.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-[#8C0000]">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Call Us</p>
                                    <a href={`tel:${settings.phone}`} className="text-[#100E0C] font-medium hover:text-[#8C0000] transition-colors">
                                        {settings.phone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-2">
                            <p className="text-sm text-gray-500">
                                We are available Mon-Fri, 9am - 5pm
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center text-red-500 text-sm">
                        Failed to load contact information.
                    </div>
                )}
            </div>
        </div>
    );
}
