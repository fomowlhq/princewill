"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import type { AffiliateTransaction } from "@/types";

interface CommissionTableProps {
    refreshKey?: number;
}

interface Pagination {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}

function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        completed: "bg-green-100 text-green-800",
        credited: "bg-green-100 text-green-800",
        approved: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
        processing: "bg-blue-100 text-blue-800",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
}

export function CommissionTable({ refreshKey }: CommissionTableProps) {
    const [transactions, setTransactions] = useState<AffiliateTransaction[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("filter", filter);
            params.set("page", currentPage.toString());

            const res = await apiClient(`/affiliate/transactions?${params}`);
            if (res.success) {
                setTransactions(res.data.transactions || []);
                setPagination(res.data.pagination || null);
            }
        } catch {
            // silently fail
        } finally {
            setIsLoading(false);
        }
    }, [filter, currentPage]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions, refreshKey]);

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    return (
        <div className="rounded-lg bg-[#111111] p-4">
            {/* Filter */}
            <div className="flex items-center justify-end border-b border-gray-700 pb-4 mb-4">
                <select
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="rounded-md border border-gray-600 bg-[#1a1a1a] px-3 py-1.5 text-sm text-gray-300 focus:border-[#8C0000] focus:outline-none cursor-pointer"
                >
                    <option value="all">All Transactions</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdrawals</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[#8C0000]" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-gray-500">No transaction history yet.</p>
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead>
                                <tr className="uppercase">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                                        tx-ref
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                                        Note
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {transactions.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className="transition-colors hover:bg-[#1a1a1a]"
                                    >
                                        <td className="px-4 py-4 text-sm text-gray-300">
                                            {new Date(tx.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-300 font-mono">
                                            {tx.meta?.reference || "-"}
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            <span
                                                className={`text-xs font-semibold uppercase tracking-wider ${
                                                    tx.type === "deposit"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {tx.type === "deposit" ? "Credited" : tx.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-200">
                                            {formatCurrency(Math.abs(tx.amount))}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-400">
                                            {tx.type === "deposit"
                                                ? `Affiliate payout for order ${tx.productName || ""}`
                                                : tx.meta?.note || "-"}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusBadge(tx.status)}`}
                                            >
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {pagination && pagination.lastPage > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-700 px-4 pt-4 mt-4">
                                <p className="text-sm text-gray-500">
                                    Page {pagination.currentPage} of {pagination.lastPage}
                                    {" "}({pagination.total} total)
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="rounded-md border border-gray-600 p-1.5 text-gray-400 hover:bg-[#1a1a1a] disabled:opacity-30 cursor-pointer"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(pagination.lastPage, p + 1)
                                            )
                                        }
                                        disabled={currentPage === pagination.lastPage}
                                        className="rounded-md border border-gray-600 p-1.5 text-gray-400 hover:bg-[#1a1a1a] disabled:opacity-30 cursor-pointer"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
