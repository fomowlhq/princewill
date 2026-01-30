"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Building2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import toast from "react-hot-toast";
import type { Bank } from "@/types";

interface AccountInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentBankName: string | null;
    currentAccountNumber: string | null;
    onSuccess: () => void;
}

const BANKS: Bank[] = [
    { name: "GTBank", code: "058" },
    { name: "Access Bank", code: "044" },
    { name: "UBA", code: "033" },
    { name: "First Bank", code: "011" },
    { name: "Zenith Bank", code: "057" },
    { name: "Airtel Smartcash PSB", code: "120004" },
    { name: "Ecobank Nigeria", code: "050" },
    { name: "Fidelity Bank", code: "070" },
    { name: "First City Monument Bank", code: "214" },
    { name: "Keystone Bank", code: "082" },
    { name: "Kuda Bank", code: "50211" },
    { name: "Moniepoint MFB", code: "50515" },
    { name: "MTN Momo PSB", code: "120003" },
    { name: "OPay Digital Services Limited (OPay)", code: "999992" },
    { name: "PalmPay", code: "999991" },
    { name: "Polaris Bank", code: "076" },
    { name: "Providus Bank", code: "101" },
    { name: "Stanbic IBTC Bank", code: "221" },
    { name: "Standard Chartered Bank", code: "068" },
    { name: "Sterling Bank", code: "232" },
    { name: "Union Bank of Nigeria", code: "032" },
    { name: "Unity Bank", code: "215" },
    { name: "Wema Bank", code: "035" },
];

export function AccountInfoModal({
    isOpen,
    onClose,
    currentBankName,
    currentAccountNumber,
    onSuccess,
}: AccountInfoModalProps) {
    const [bankName, setBankName] = useState(currentBankName || "");
    const [accountNumber, setAccountNumber] = useState(currentAccountNumber || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setBankName(currentBankName || "");
            setAccountNumber(currentAccountNumber || "");
            setError("");
        }
    }, [isOpen, currentBankName, currentAccountNumber]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!bankName) {
            setError("Please select a bank.");
            return;
        }

        if (!accountNumber || accountNumber.length !== 10) {
            setError("Account number must be exactly 10 digits.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiClient("/affiliate/bank-details", {
                method: "PUT",
                body: JSON.stringify({ bankName, accountNumber }),
            });

            if (res.success) {
                toast.success("Bank details updated successfully.");
                onClose();
                onSuccess();
            } else {
                toast.error(res.message || "Update failed.");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
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
                        className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8C0000]/10">
                                <Building2 className="h-5 w-5 text-[#8C0000]" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Account Information
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Current Bank Display */}
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Current Bank
                                </label>
                                <input
                                    type="text"
                                    value={bankName || "Not set"}
                                    readOnly
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600"
                                />
                            </div>

                            {/* Bank Selector */}
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Select a bank
                                </label>
                                <select
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-[#8C0000] focus:outline-none focus:ring-1 focus:ring-[#8C0000] transition-colors cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>
                                        Select Bank
                                    </option>
                                    {BANKS.map((bank) => (
                                        <option key={bank.name} value={bank.name}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Account Number */}
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={10}
                                    value={accountNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        setAccountNumber(val);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-[#8C0000] focus:outline-none focus:ring-1 focus:ring-[#8C0000] transition-colors"
                                    placeholder="1234567890"
                                    required
                                />
                                {error && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-lg bg-[#8C0000] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6B0000] disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </span>
                                ) : (
                                    "Update"
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
