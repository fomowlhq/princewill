"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, CheckCircle2, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

function VerifyEmailForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const id = searchParams.get("id");
    const hash = searchParams.get("hash");

    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [errors, setErrors] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [code, setCode] = useState("");

    // Auto-verify if coming from email link
    useEffect(() => {
        if (id && hash) {
            verifyFromLink();
        }
    }, [id, hash]);

    const verifyFromLink = async () => {
        setIsLoading(true);
        setErrors(null);
        try {
            const response = await apiClient(`/email/verify/${id}/${hash}`, {
                method: 'GET',
            });

            if (response.verified) {
                setIsSuccess(true);
                setSuccessMessage("Your email has been verified successfully!");
                // Update local storage user data
                const userData = localStorage.getItem('user-data');
                if (userData) {
                    const user = JSON.parse(userData);
                    user.email_verified_at = new Date().toISOString();
                    localStorage.setItem('user-data', JSON.stringify(user));
                }
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } else {
                setErrors({ message: response.message || "Verification failed" });
            }
        } catch (error: any) {
            setErrors({ message: "An unexpected error occurred. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            setErrors({ message: "Please enter a 6-digit verification code" });
            return;
        }

        setIsLoading(true);
        setErrors(null);
        try {
            const response = await apiClient('/email/verify-code', {
                method: 'POST',
                body: JSON.stringify({ code }),
            });

            if (response.verified) {
                setIsSuccess(true);
                setSuccessMessage("Your email has been verified successfully!");
                // Update local storage user data
                const userData = localStorage.getItem('user-data');
                if (userData) {
                    const user = JSON.parse(userData);
                    user.email_verified_at = new Date().toISOString();
                    localStorage.setItem('user-data', JSON.stringify(user));
                }
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } else {
                setErrors({ message: response.message || "Invalid verification code" });
            }
        } catch (error: any) {
            setErrors({ message: "An unexpected error occurred. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        setErrors(null);
        setSuccessMessage("");
        try {
            const response = await apiClient('/email/verification-notification', {
                method: 'POST',
            });

            if (response.message) {
                setSuccessMessage(response.message);
            }
        } catch (error: any) {
            setErrors({ message: "Failed to resend verification email. Please try again." });
        } finally {
            setIsResending(false);
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
                    <h2 className="text-3xl font-black text-gray-900">Email Verified!</h2>
                    <p className="text-gray-500">{successMessage} Redirecting you to home page...</p>
                </div>
                <Link
                    href="/"
                    className="inline-block bg-[#8C0000] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    // Show loading if auto-verifying from link
    if (id && hash && isLoading) {
        return (
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-16 h-16 border-4 border-[#8C0000] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium">Verifying your email...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl mb-4">
                    <Mail className="w-6 h-6 text-[#8C0000]" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Verify Your Email</h2>
                <p className="text-[12px] text-gray-500 font-bold uppercase tracking-widest italic">Almost There!</p>
            </div>

            <div className="text-center space-y-4 max-w-sm mx-auto">
                <p className="text-gray-600">
                    We&apos;ve sent a 6-digit verification code to your email address. Enter the code below to verify your account.
                </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-8 max-w-sm mx-auto">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit code"
                            className="w-full py-4 bg-transparent border-b border-gray-200 focus:border-[#8C0000] outline-none transition-colors text-gray-900 text-center text-2xl tracking-[0.5em] font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        disabled={isLoading || code.length !== 6}
                        type="submit"
                        className="w-full bg-[#8C0000] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-900/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </button>

                    {successMessage && !isSuccess && (
                        <p className="text-center text-xs text-green-600 font-bold mt-2">
                            {successMessage}
                        </p>
                    )}

                    {errors?.message && (
                        <p className="text-center text-xs text-red-600 font-bold mt-2">
                            {errors.message}
                        </p>
                    )}

                    <div className="text-center">
                        <p className="text-gray-500 text-sm mb-2">Didn&apos;t receive the code?</p>
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending}
                            className="inline-flex items-center gap-2 text-[#8C0000] font-bold hover:underline cursor-pointer disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                            {isResending ? "Sending..." : "Resend Code"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 bg-gray-50/50">
            <div className="container-custom max-w-lg">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <Suspense fallback={<div className="text-center py-20 font-black text-gray-300 animate-pulse">LOADING...</div>}>
                        <VerifyEmailForm />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
