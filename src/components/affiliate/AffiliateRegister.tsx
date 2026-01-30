"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export function AffiliateRegister() {
    const router = useRouter();
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        const user = localStorage.getItem("user-data");

        if (token && user && user !== "undefined") {
            setIsAuthenticated(true);
            // Check if already affiliate
            try {
                const parsed = JSON.parse(user);
                if (parsed.isAffiliate) {
                    router.push("/affiliate/dashboard");
                    return;
                }
            } catch {
                // ignore parse error
            }
        }
        setIsCheckingAuth(false);
    }, [router]);

    const handleRegister = async () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }

        if (!acceptTerms) {
            toast.error("You must accept the terms and conditions.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiClient("/affiliate/register", {
                method: "POST",
            });

            if (res.success || res.status === 409) {
                if (res.status === 409) { toast.success("Welcome back\! Redirecting to your dashboard..."); } else { toast.success("Affiliate account created successfully\!"); }
                // Update user data in localStorage
                const userData = localStorage.getItem("user-data");
                if (userData) {
                    try {
                        const parsed = JSON.parse(userData);
                        parsed.isAffiliate = true;
                        localStorage.setItem(
                            "user-data",
                            JSON.stringify(parsed)
                        );
                        window.dispatchEvent(new CustomEvent("auth-state-changed", { detail: { user: parsed } }));
                    } catch {
                        // ignore
                    }
                }
                router.push("/affiliate/dashboard");
            } else if (res.redirect) {
                router.push(res.redirect);
            } else {
                toast.error(res.message || "Registration failed.");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Join Our Affiliate Program
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Start earning commissions by promoting our products
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                            <h3 className="mb-3 font-medium text-gray-900">
                                Affiliate Program Details:
                            </h3>
                            <ul className="space-y-2">
                                {[
                                    "Earn 5% commission on every successful sale",
                                    "Real-time tracking and monitor your performance",
                                    `Minimum payout: ${formatCurrency(20000)}`,
                                    "Marketing materials: Provided exclusively for VIP affiliates",
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2"
                                    >
                                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#8C0000]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t pt-4">
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) =>
                                        setAcceptTerms(e.target.checked)
                                    }
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#8C0000] focus:ring-[#8C0000]"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    I accept the{" "}
                                    <a
                                        href="/affiliate"
                                        className="text-[#8C0000] hover:text-[#6B0000] underline"
                                    >
                                        terms and conditions & affiliate
                                        agreement
                                    </a>
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleRegister}
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-md bg-[#8C0000] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#6B0000] focus:outline-none focus:ring-2 focus:ring-[#8C0000] focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Create Affiliate Account"
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
                    >
                        <button
                            onClick={() => setShowLoginPrompt(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <div className="p-4 text-center">
                            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500">
                                You need to log in or create an account to join
                                the affiliate program.
                            </h3>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => {
                                        setShowLoginPrompt(false);
                                        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'register' } }));
                                    }}
                                    className="inline-flex items-center rounded-lg bg-[#8C0000] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#6B0000] cursor-pointer"
                                >
                                    Register
                                </button>
                                <button
                                    onClick={() => {
                                        setShowLoginPrompt(false);
                                        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
                                    }}
                                    className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
