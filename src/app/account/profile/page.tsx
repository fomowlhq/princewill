"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Loader2, User, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("user-data");
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setFormData({
                name: userData.name || "",
                phone: userData.phone || "",
            });
        }
        setIsLoading(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await apiClient("/update-profile", {
                method: "PUT",
                body: JSON.stringify(formData)
            });
            if (res.success) {
                toast.success("Profile updated successfully");
                const updatedUser = { ...user, ...res.user };
                localStorage.setItem("user-data", JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#8C0000] animate-spin" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-white pt-32 pb-20">
                <div className="container-custom max-w-2xl">
                    {/* Breadcrumb */}
                    <nav className="mb-8" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2">
                            <li>
                                <Link href="/" className="text-sm font-medium text-[#C4C1BE] hover:text-[#100E0C] transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li className="text-[#C4C1BE]">|</li>
                            <li>
                                <Link href="/account" className="text-sm font-medium text-[#C4C1BE] hover:text-[#100E0C] transition-colors">
                                    Profile
                                </Link>
                            </li>
                            <li className="text-[#C4C1BE]">|</li>
                            <li className="text-sm font-medium text-[#100E0C]">Edit Information</li>
                        </ol>
                    </nav>

                    <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-black text-[#100E0C] tracking-tight mb-2">
                                Edit Personal Information
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Review and update your details to ensure your information is current.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20"
                                        placeholder="Your Name"
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                </div>
                            </div>

                            <div className="space-y-1 opacity-60">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm cursor-not-allowed"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 italic pl-1">Email address cannot be changed.</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20"
                                        placeholder="e.g. +234..."
                                    />
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#8C0000] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-2 mt-8"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
