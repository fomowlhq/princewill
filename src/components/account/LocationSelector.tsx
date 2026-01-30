"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

interface LocationSelectorProps {
    selectedCountry?: string | number;
    selectedState?: string | number;
    selectedCity?: string | number;
    onChange: (data: { country_id: number; state_id: number; city_id: number }) => void;
}

export function LocationSelector({
    selectedCountry,
    selectedState,
    selectedCity,
    onChange
}: LocationSelectorProps) {
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const [countryId, setCountryId] = useState<number>(Number(selectedCountry) || 0);
    const [stateId, setStateId] = useState<number>(Number(selectedState) || 0);
    const [cityId, setCityId] = useState<number>(Number(selectedCity) || 0);

    const [isLoadingCountries, setIsLoadingCountries] = useState(false);
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        if (countryId) {
            fetchStates(countryId);
        } else {
            setStates([]);
            setCities([]);
        }
    }, [countryId]);

    useEffect(() => {
        if (stateId) {
            fetchCities(stateId);
        } else {
            setCities([]);
        }
    }, [stateId]);

    useEffect(() => {
        if (countryId && stateId && cityId) {
            onChange({ country_id: countryId, state_id: stateId, city_id: cityId });
        }
    }, [countryId, stateId, cityId]);

    const fetchCountries = async () => {
        setIsLoadingCountries(true);
        try {
            const res = await apiClient("/countries");
            if (res.success) setCountries(res.data);
        } catch (error) {
            console.error("Fetch countries error:", error);
        } finally {
            setIsLoadingCountries(false);
        }
    };

    const fetchStates = async (cid: number) => {
        setIsLoadingStates(true);
        try {
            const res = await apiClient(`/states/${cid}`);
            if (res.success) setStates(res.data);
        } catch (error) {
            console.error("Fetch states error:", error);
        } finally {
            setIsLoadingStates(false);
        }
    };

    const fetchCities = async (sid: number) => {
        setIsLoadingCities(true);
        try {
            const res = await apiClient(`/cities/${sid}`);
            if (res.success) setCities(res.data);
        } catch (error) {
            console.error("Fetch cities error:", error);
        } finally {
            setIsLoadingCities(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Country */}
            <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Country</label>
                <div className="relative">
                    <select
                        value={countryId}
                        onChange={(e) => {
                            setCountryId(Number(e.target.value));
                            setStateId(0);
                            setCityId(0);
                        }}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20 appearance-none"
                        disabled={isLoadingCountries}
                    >
                        <option value="0">Select Country</option>
                        {countries.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {isLoadingCountries && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-[#8C0000]" />
                        </div>
                    )}
                </div>
            </div>

            {/* State */}
            <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">State</label>
                <div className="relative">
                    <select
                        value={stateId}
                        onChange={(e) => {
                            setStateId(Number(e.target.value));
                            setCityId(0);
                        }}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20 appearance-none"
                        disabled={!countryId || isLoadingStates}
                    >
                        <option value="0">Select State</option>
                        {states.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    {isLoadingStates && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-[#8C0000]" />
                        </div>
                    )}
                </div>
            </div>

            {/* City */}
            <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">City</label>
                <div className="relative">
                    <select
                        value={cityId}
                        onChange={(e) => setCityId(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C0000]/20 appearance-none"
                        disabled={!stateId || isLoadingCities}
                    >
                        <option value="0">Select City</option>
                        {cities.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {isLoadingCities && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-[#8C0000]" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
