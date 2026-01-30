"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !email) {
            setErrors({ message: "Invalid or expired reset link." });
            return;
        }

        setIsLoading(true);
        setErrors(null);
        try {
            const response = await apiClient('/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    token,
                    email,
                    ...formData
                }),
            });

            if (response.success === false) {
                setErrors(response.errors || { message: response.message || "Failed to reset password" });
                setIsLoading(false);
                return;
            }

            if (response.message === "Password reset successfully") {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } else {
                setErrors(response.errors || { message: response.message || "Failed to reset password" });
            }
        } catch (error: any) {
            setErrors({ message: "An unexpected error occurred. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-gray-900">Successfully Reset</h2>
                    <p className="text-gray-500">Your password has been updated. Redirecting you to home page...</p>
                </div>
                <Link
                    href="/"
                    className="inline-block bg-[#8C0000] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all"
                >
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl mb-4">
                    <Lock className="w-6 h-6 text-[#8C0000]" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Set New Password</h2>
                <p className="text-[12px] text-gray-500 font-bold uppercase tracking-widest italic">Secure Your Account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-sm mx-auto">
                <div className="space-y-6">
                    <div className="space-y-1 relative group">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="New Password"
                            className="w-full py-4 bg-transparent border-b border-gray-200 focus:border-[#8C0000] outline-none transition-colors text-gray-900 pr-10"
                        />
                        {errors?.password && <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{errors.password[0]}</p>}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-4 text-gray-300 hover:text-gray-500 cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="space-y-1 relative group">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            placeholder="Confirm New Password"
                            className="w-full py-4 bg-transparent border-b border-gray-200 focus:border-[#8C0000] outline-none transition-colors text-gray-900 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-4 text-gray-300 hover:text-gray-500 cursor-pointer"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-[#8C0000] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-900/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </button>

                    {errors?.message && (
                        <p className="text-center text-xs text-red-600 font-bold mt-2">
                            {errors.message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 bg-gray-50/50">
            <div className="container-custom max-w-lg">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <Suspense fallback={<div className="text-center py-20 font-black text-gray-300 animate-pulse">LOADING...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
