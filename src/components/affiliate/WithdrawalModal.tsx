"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Loader2, Wallet, Building2, Bitcoin } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import toast from "react-hot-toast";

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    bankName: string | null;
    accountNumber: string | null;
    userName: string;
    onSuccess: () => void;
}

const CRYPTO_OPTIONS = [
    { key: "bitcoin", label: "Bitcoin" },
    { key: "usdc", label: "USDC" },
    { key: "solana", label: "Solana" },
] as const;

export function WithdrawalModal({
    isOpen,
    onClose,
    bankName,
    accountNumber,
    userName,
    onSuccess,
}: WithdrawalModalProps) {
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [cryptoAddress, setCryptoAddress] = useState("");
    const [selectedCrypto, setSelectedCrypto] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleWithdraw = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("Enter a valid amount.");
            return;
        }

        if (Number(amount) < 20000) {
            toast.error("Minimum withdrawal amount is ₦20,000.");
            return;
        }

        if (!paymentMethod) {
            toast.error("Select a payment method.");
            return;
        }

        if (paymentMethod === "crypto" && (!cryptoAddress || !selectedCrypto)) {
            toast.error("Please provide your wallet address and choose a crypto type.");
            return;
        }

        setIsProcessing(true);
        try {
            const res = await apiClient("/affiliate/withdraw", {
                method: "POST",
                body: JSON.stringify({
                    amount: Number(amount),
                    paymentMethod,
                    cryptoAddress: paymentMethod === "crypto" ? cryptoAddress : undefined,
                    cryptoType: paymentMethod === "crypto" ? selectedCrypto : undefined,
                }),
            });

            if (res.success) {
                toast.success(res.message || "Withdrawal request submitted!");
                resetForm();
                onClose();
                onSuccess();
            } else {
                toast.error(res.message || "Withdrawal failed.");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const resetForm = () => {
        setAmount("");
        setPaymentMethod("");
        setCryptoAddress("");
        setSelectedCrypto("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
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
                        className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8C0000]/10">
                                <Wallet className="h-5 w-5 text-[#8C0000]" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Withdraw Funds
                            </h2>
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Amount
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                inputMode="numeric"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:border-[#8C0000] focus:outline-none focus:ring-1 focus:ring-[#8C0000] transition-colors"
                                placeholder="Enter amount"
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="mb-4">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Select Method
                            </label>
                            <div className="relative">
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:border-[#8C0000] focus:outline-none focus:ring-1 focus:ring-[#8C0000] transition-colors cursor-pointer"
                                >
                                    <option value="" disabled>
                                        Select Payment Detail
                                    </option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="crypto">Crypto Payment</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Crypto Fields */}
                        <AnimatePresence>
                            {paymentMethod === "crypto" && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mb-4 space-y-4">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Wallet Address
                                            </label>
                                            <input
                                                type="text"
                                                value={cryptoAddress}
                                                onChange={(e) => setCryptoAddress(e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:border-[#8C0000] focus:outline-none focus:ring-1 focus:ring-[#8C0000] transition-colors"
                                                placeholder="Enter your crypto wallet address"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Select Crypto Type
                                            </label>
                                            <div className="flex flex-col gap-2">
                                                {CRYPTO_OPTIONS.map((option) => (
                                                    <label
                                                        key={option.key}
                                                        className="inline-flex items-center cursor-pointer text-gray-900"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="cryptoType"
                                                            value={option.key}
                                                            checked={selectedCrypto === option.key}
                                                            onChange={(e) => setSelectedCrypto(e.target.value)}
                                                            className="h-4 w-4 border-gray-300 text-[#8C0000] focus:ring-[#8C0000]"
                                                        />
                                                        <span className="ml-2 text-sm">
                                                            {option.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bank Info Display */}
                        <AnimatePresence>
                            {paymentMethod === "bank_transfer" && bankName && accountNumber && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                                        <Building2 className="h-4 w-4 text-gray-500" />
                                        <p className="text-sm text-gray-700">
                                            {bankName} - {accountNumber} - {userName}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Warning */}
                        <div className="mb-4 flex items-center gap-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>
                                Please confirm details before requesting a withdraw
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleWithdraw}
                            disabled={isProcessing}
                            className="w-full rounded-lg bg-[#8C0000] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#6B0000] disabled:opacity-50 cursor-pointer"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                "Withdraw Now"
                            )}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
