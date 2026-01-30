"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Loader2, Plus, Edit2, Trash2, CheckCircle2, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { AddressForm } from "@/components/account/AddressForm";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user-data");
        if (savedUser) setUser(JSON.parse(savedUser));
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient("/addresses");
            if (res.success) {
                setAddresses(res.data);
            }
        } catch (error) {
            toast.error("Failed to load addresses");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (formData: any) => {
        setIsSubmitting(true);
        try {
            if (editingAddress) {
                const res = await apiClient(`/addresses/${editingAddress.id}`, {
                    method: "PUT",
                    body: JSON.stringify(formData)
                });
                if (res.success) {
                    toast.success("Address updated");
                    setEditingAddress(null);
                    setShowForm(false);
                    fetchAddresses();
                }
            } else {
                const res = await apiClient("/addresses", {
                    method: "POST",
                    body: JSON.stringify(formData)
                });
                if (res.success) {
                    toast.success("Address saved");
                    setShowForm(false);
                    fetchAddresses();
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            const res = await apiClient(`/addresses/${id}`, { method: "DELETE" });
            if (res.success) {
                toast.success("Address deleted");
                fetchAddresses();
            }
        } catch (error) {
            toast.error("Failed to delete address");
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            const res = await apiClient(`/addresses/${id}/default`, { method: "PATCH" });
            if (res.success) {
                toast.success("Default address updated");
                // Update local user data
                const newUser = { ...user, default_address_id: id };
                setUser(newUser);
                localStorage.setItem("user-data", JSON.stringify(newUser));
                // Force re-fetch to update icons
                fetchAddresses();
            }
        } catch (error) {
            toast.error("Failed to set default address");
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-white pt-32 pb-20">
                <div className="container-custom">
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
                            <li className="text-sm font-medium text-[#100E0C]">Shipping Address</li>
                        </ol>
                    </nav>

                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-3xl font-black text-[#100E0C] tracking-tight mb-2">
                                Manage Your Addresses
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Add, edit, or delete your shipping addresses for a faster checkout.
                            </p>
                        </div>
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-[#8C0000] text-white h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Address
                            </button>
                        )}
                    </div>

                    {showForm || editingAddress ? (
                        <AddressForm
                            initialData={editingAddress}
                            onSubmit={handleSubmit}
                            onCancel={() => { setShowForm(false); setEditingAddress(null); }}
                            isSubmitting={isSubmitting}
                        />
                    ) : (
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-8 h-8 text-[#8C0000] animate-spin" />
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                    <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium">No addresses saved yet.</p>
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="mt-4 text-[#8C0000] font-bold text-sm uppercase tracking-widest underline decoration-2 underline-offset-4"
                                    >
                                        Add your first address
                                    </button>
                                </div>
                            ) : (
                                addresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={cn(
                                            "p-6 rounded-2xl border transition-all duration-300",
                                            user?.default_address_id === addr.id
                                                ? "bg-white border-[#8C0000] shadow-xl shadow-[#8C0000]/5"
                                                : "bg-gray-50 border-gray-100 hover:border-gray-200"
                                        )}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                {user?.default_address_id === addr.id && (
                                                    <CheckCircle2 className="w-6 h-6 text-[#8C0000] mt-1 shrink-0" />
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="font-black text-[#100E0C] uppercase tracking-tight">
                                                            {addr.name}
                                                        </h3>
                                                        {user?.default_address_id === addr.id && (
                                                            <span className="bg-[#8C0000] text-white text-[8px] font-black uppercase px-2 py-1 rounded tracking-widest">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 text-sm mb-3 font-medium">
                                                        {addr.address}, {addr.city.name}, {addr.state.name}, {addr.country.name}
                                                    </p>
                                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                                        {addr.phone}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {user?.default_address_id !== addr.id && (
                                                    <button
                                                        onClick={() => handleSetDefault(addr.id)}
                                                        className="p-3 text-gray-400 hover:text-green-600 transition-colors"
                                                        title="Set as Default"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setEditingAddress(addr)}
                                                    className="p-3 text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(addr.id)}
                                                    className="p-3 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
