"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
    Loader2,
    Copy,
    Check,
    MoreVertical,
    Link2,
    Users,
    ShoppingBag,
    TrendingUp,
    Clock,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CommissionTable } from "@/components/affiliate/CommissionTable";
import { WithdrawalModal } from "@/components/affiliate/WithdrawalModal";
import { AccountInfoModal } from "@/components/affiliate/AccountInfoModal";
import { TrackOrderModal } from "@/components/affiliate/TrackOrderModal";
import type { AffiliateDashboardData } from "@/types";
import toast from "react-hot-toast";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
    }),
};

export function AffiliateDashboard() {
    const router = useRouter();
    const [data, setData] = useState<AffiliateDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [affiliateLink, setAffiliateLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userName, setUserName] = useState("");

    // Modal states
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showTrackOrderModal, setShowTrackOrderModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchDashboard = useCallback(async () => {
        try {
            const res = await apiClient("/affiliate/dashboard");
            if (res.success) {
                setData(res.data);
                setAffiliateLink(res.data.affiliateLink);
            } else if (res.redirect) {
                router.push(res.redirect);
            }
        } catch {
            // silently fail
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchDashboard();
        const userData = localStorage.getItem("user-data");
        if (userData) {
            try {
                const parsed = JSON.parse(userData);
                setUserName(parsed.name || "");
            } catch {
                // ignore
            }
        }
    }, [fetchDashboard]);

    const generateLink = async (productId?: string) => {
        try {
            const res = await apiClient("/affiliate/generate-link", {
                method: "POST",
                body: JSON.stringify({
                    productId: productId || undefined,
                }),
            });
            if (res.success) {
                setAffiliateLink(res.data.affiliateLink);
            }
        } catch {
            // silently fail
        }
    };

    const handleProductChange = (value: string) => {
        setSelectedProduct(value);
        generateLink(value);
    };

    const copyToClipboard = async (text: string) => {
        try {
            // Try the modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for non-secure contexts (HTTP)
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
            setCopied(true);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy.");
        }
    };

    const handleRefresh = () => {
        setRefreshKey((k) => k + 1);
        fetchDashboard();
    };

    if (isLoading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin" />
            </div>
        );
    }

    const { affiliate, stats, products } = data;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-white overflow-hidden">
                <div className="container-custom py-8 pt-28 lg:pt-32 pb-20">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="mb-2 text-3xl font-bold text-black lg:text-4xl">
                            Dashboard
                        </h1>
                        <p className="text-base font-medium text-gray-600 md:text-lg">
                            Here&apos;s how your referrals are performing today.
                        </p>
                    </motion.div>

                    {/* Balance Banner */}
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="relative mb-6 rounded-xl bg-linear-to-r from-[#8C0000] to-red-700 p-6 text-white shadow-lg overflow-hidden"
                    >
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

                        {/* Dropdown menu */}
                        <div className="relative flex justify-end">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="relative inline-flex cursor-pointer items-center rounded-lg bg-white/20 p-2 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </button>

                            {showDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowDropdown(false)}
                                    />
                                    <div className="absolute right-0 top-12 z-20 w-44 rounded-lg bg-white py-1 shadow-lg">
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setShowAccountModal(true);
                                            }}
                                            className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Account Info
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setShowTrackOrderModal(true);
                                            }}
                                            className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Track Order
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="relative flex items-center justify-between max-sm:flex-col max-sm:gap-4">
                            <div>
                                <h3 className="mb-2 text-base font-medium md:text-lg opacity-90">
                                    Total available profit payout
                                </h3>
                                <p className="text-3xl font-bold text-green-400 md:text-4xl">
                                    {formatCurrency(stats.availablePayout)}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowWithdrawalModal(true)}
                                className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gray-100 hover:shadow-md cursor-pointer md:px-6 md:text-base"
                            >
                                Request Payout
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <motion.div
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="rounded-xl bg-[#050505] p-6 text-white border-l-4 border-green-500 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                                    <TrendingUp className="h-4 w-4 text-green-400" />
                                </div>
                                <h3 className="text-lg font-medium text-[#737B7A]">
                                    Total Earnings
                                </h3>
                            </div>
                            <p className="text-3xl font-bold">
                                {formatCurrency(stats.totalEarnings)}
                            </p>
                        </motion.div>
                        <motion.div
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="rounded-xl bg-[#050505] p-6 text-white border-l-4 border-red-500 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                                    <Clock className="h-4 w-4 text-red-400" />
                                </div>
                                <h3 className="text-lg font-medium text-[#737B7A]">
                                    Pending Profit
                                </h3>
                            </div>
                            <p className="text-3xl font-bold text-red-500">
                                {formatCurrency(stats.pendingEarnings)}
                            </p>
                        </motion.div>
                    </div>

                    {/* Affiliate ID Section */}
                    <motion.div
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="mb-8 rounded-xl bg-[#050505] p-6 text-white"
                    >
                        <h3 className="mb-4 text-lg font-medium text-[#737B7A]">
                            Your Affiliate ID
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 mb-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-400">
                                    Your Affiliate Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={affiliate.affiliateCode}
                                        readOnly
                                        className="flex-1 rounded-lg border border-gray-600 bg-transparent px-3 py-2.5 text-white font-mono tracking-wider"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(affiliate.affiliateCode)}
                                        className="rounded-lg border border-gray-600 px-3 py-2 hover:bg-gray-800 transition-colors cursor-pointer"
                                        title="Copy code"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <Copy className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-400">
                                    Select Product (Optional)
                                </label>
                                <select
                                    value={selectedProduct}
                                    onChange={(e) => handleProductChange(e.target.value)}
                                    className="w-full rounded-lg border border-gray-600 bg-transparent px-3 py-2.5 text-gray-300 focus:border-[#8C0000] focus:outline-none cursor-pointer"
                                >
                                    <option value="" className="bg-[#050505]">
                                        General Link
                                    </option>
                                    {products.map((p) => (
                                        <option
                                            key={p.id}
                                            value={p.id}
                                            className="bg-[#050505]"
                                        >
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Generated Link */}
                        <div className="grid w-full gap-2 sm:grid-cols-8">
                            <input
                                type="text"
                                value={affiliateLink}
                                readOnly
                                className="col-span-full block w-full rounded-lg border border-gray-600 bg-transparent p-2.5 text-sm text-white sm:col-span-7 font-mono"
                            />
                            <button
                                onClick={() => copyToClipboard(affiliateLink)}
                                className="col-span-full inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#8C0000] py-2.5 text-center text-sm font-medium text-white hover:bg-[#6B0000] transition-colors cursor-pointer sm:col-span-1"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3 w-3" />
                                        Copied!
                                    </>
                                ) : (
                                    "Copy"
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Referral Overview */}
                    <motion.div
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="mb-8"
                    >
                        <h2 className="mb-6 text-2xl font-bold text-black">
                            Referral Overview
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {[
                                {
                                    icon: Link2,
                                    value: stats.totalClicks,
                                    label: "Total Clicks",
                                    color: "text-blue-400",
                                    bg: "bg-blue-500/20",
                                    border: "border-blue-500",
                                },
                                {
                                    icon: Users,
                                    value: data.frequentAffiliateBuyers,
                                    label: "Unique Visitors",
                                    color: "text-purple-400",
                                    bg: "bg-purple-500/20",
                                    border: "border-purple-500",
                                },
                                {
                                    icon: ShoppingBag,
                                    value: stats.approvedPurchasesCount,
                                    label: "Purchases Made",
                                    color: "text-emerald-400",
                                    bg: "bg-emerald-500/20",
                                    border: "border-emerald-500",
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className={`flex items-center justify-between rounded-xl bg-[#050505] p-6 text-white border-t-2 ${item.border} hover:shadow-lg transition-shadow`}
                                >
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.bg}`}>
                                        <item.icon className={`h-6 w-6 ${item.color}`} />
                                    </div>
                                    <div className="text-right">
                                        <p className="mb-1 text-3xl font-bold lg:text-4xl">
                                            {typeof item.value === "number"
                                                ? item.value.toLocaleString()
                                                : item.value}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {item.label}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Commission Table */}
                    <motion.div
                        custom={5}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="rounded-xl bg-[#050505] p-6 text-white"
                    >
                        <h3 className="mb-4 text-xl font-semibold text-[#AAAAAA]">
                            Referrals Payout
                        </h3>
                        <CommissionTable refreshKey={refreshKey} />
                    </motion.div>
                </div>

                {/* Modals */}
                <WithdrawalModal
                    isOpen={showWithdrawalModal}
                    onClose={() => setShowWithdrawalModal(false)}
                    bankName={affiliate.bankName}
                    accountNumber={affiliate.accountNumber}
                    userName={userName}
                    onSuccess={handleRefresh}
                />

                <AccountInfoModal
                    isOpen={showAccountModal}
                    onClose={() => setShowAccountModal(false)}
                    currentBankName={affiliate.bankName}
                    currentAccountNumber={affiliate.accountNumber}
                    onSuccess={handleRefresh}
                />

                <TrackOrderModal
                    isOpen={showTrackOrderModal}
                    onClose={() => setShowTrackOrderModal(false)}
                />
            </div>
        </ProtectedRoute>
    );
}
