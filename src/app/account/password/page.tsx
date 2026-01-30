"use client";

import { useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Loader2, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function PasswordPage() {
    const [formData, setFormData] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            toast.error("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiClient("/change-password", {
                method: "POST",
                body: JSON.stringify(formData)
            });
            if (res.success) {
                toast.success("Password changed successfully");
                setFormData({
                    current_password: "",
                    password: "",
                    password_confirmation: "",
                });
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to change password");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            <li className="text-sm font-medium text-[#100E0C]">Reset Password</li>
                        </ol>
                    </nav>

                    <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-black text-[#100E0C] tracking-tight mb-2">
                                Reset Your Password
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Update your account security by choosing a new password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        value={formData.current_password}
                                        onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20"
                                    />
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20"
                                    />
                                    <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#8C0000] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-2 mt-8"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
