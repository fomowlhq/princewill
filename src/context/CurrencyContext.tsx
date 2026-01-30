"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

interface CurrencyData {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  is_default: boolean;
}

interface CurrencyContextType {
  currency: "NGN" | "USD";
  symbol: string;
  exchangeRate: number;
  currencies: CurrencyData[];
  setCurrency: (code: "NGN" | "USD") => void;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<"NGN" | "USD">("NGN");
  const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [symbol, setSymbol] = useState<string>("₦");

  useEffect(() => {
    // Load saved currency preference
    const saved = localStorage.getItem("selected_currency");
    if (saved === "USD" || saved === "NGN") {
      setCurrencyState(saved);
    }

    // Fetch available currencies from API
    const fetchCurrencies = async () => {
      try {
        const response = await apiClient("/currencies");
        if (response.success && response.data) {
          setCurrencies(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  // Update symbol and exchange rate when currency or currencies list changes
  useEffect(() => {
    if (currencies.length === 0) return;

    if (currency === "NGN") {
      setSymbol("₦");
      setExchangeRate(1);
    } else {
      const usd = currencies.find((c) => c.code === "USD");
      if (usd) {
        setSymbol(usd.symbol || "$");
        setExchangeRate(usd.exchange_rate);
      } else {
        setSymbol("$");
        setExchangeRate(1);
      }
    }
  }, [currency, currencies]);

  const setCurrency = useCallback((code: "NGN" | "USD") => {
    setCurrencyState(code);
    localStorage.setItem("selected_currency", code);
  }, []);

  const formatPrice = useCallback(
    (amount: number): string => {
      if (currency === "USD") {
        // Prices are stored in NGN; divide by exchange_rate to get USD
        // exchange_rate is how many NGN per 1 USD (e.g. 1500)
        const usdAmount = exchangeRate > 0 ? amount / exchangeRate : amount;
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(usdAmount);
      }

      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    },
    [currency, exchangeRate]
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, symbol, exchangeRate, currencies, setCurrency, formatPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
