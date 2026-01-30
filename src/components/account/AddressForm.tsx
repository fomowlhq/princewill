"use client";

import { useState } from "react";
import { LocationSelector } from "./LocationSelector";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface AddressFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function AddressForm({ initialData, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        phone: initialData?.phone || "",
        street_address: initialData?.address || "",
        postcode: initialData?.postcode || "",
        bus_stop: initialData?.bus_stop || "",
        additional_info: initialData?.add_info || "",
        country_id: initialData?.country_id || 0,
        state_id: initialData?.state_id || 0,
        city_id: initialData?.city_id || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.country_id || !formData.state_id || !formData.city_id) {
            toast.error("Please select a complete location");
            return;
        }

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Recipient Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20"
                        placeholder="e.g. John Doe"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                    <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20"
                        placeholder="e.g. +234..."
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Street Address</label>
                <textarea
                    required
                    value={formData.street_address}
                    onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20 min-h-[100px]"
                    placeholder="e.g. 123 Luxury Lane"
                />
            </div>

            <LocationSelector
                selectedCountry={formData.country_id}
                selectedState={formData.state_id}
                selectedCity={formData.city_id}
                onChange={(loc) => setFormData({ ...formData, ...loc })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Postal Code</label>
                    <input
                        type="text"
                        value={formData.postcode}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nearest Bus Stop</label>
                    <input
                        type="text"
                        value={formData.bus_stop}
                        onChange={(e) => setFormData({ ...formData, bus_stop: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Additional Information</label>
                <input
                    type="text"
                    value={formData.additional_info}
                    onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20"
                />
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#8C0000] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                    {initialData ? "Update Address" : "Save Address"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-4 border-2 border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 transition-all"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
