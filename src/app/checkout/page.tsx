"use client";

import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  Truck,
  CreditCard,
  Loader2,
  MapPin,
  User,
  Mail,
  Phone,
  Tag,
  Check,
  Copy,
  X,
  ChevronDown
} from "lucide-react";

interface UserData {
  name: string;
  email: string;
  phone?: string;
}

interface Address {
  id: number;
  address: string;
  city_id: number;
  state_id: number;
  country_id: number;
  postcode?: string;
  bus_stop?: string;
  add_info?: string;
  city: { name: string; id: number };
  state: { name: string; id: number };
  country: { name: string; id: number };
}

interface CountryData {
  id: number;
  name: string;
}

interface StateData {
  id: number;
  name: string;
}

interface CityData {
  id: number;
  name: string;
}

interface CryptoAddress {
  id: number;
  type: string;
  address: string;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");

  // Address list
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(true);
  const [saveAddress, setSaveAddress] = useState(false);

  // Selection data
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [states, setStates] = useState<StateData[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);

  // Form state
  const [address, setAddress] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState<number | string>("");
  const [selectedStateId, setSelectedStateId] = useState<number | string>("");
  const [selectedCityId, setSelectedCityId] = useState<number | string>("");
  const [postcode, setPostcode] = useState("");
  const [busStop, setBusStop] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Shipping & Payment
  const [shippingMethod, setShippingMethod] = useState("rider");
  const [shippingFee, setShippingFee] = useState(0);
  const [taxRate, setTaxRate] = useState(0);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponValid, setCouponValid] = useState(false);

  // Processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Crypto payment
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [cryptoAddresses, setCryptoAddresses] = useState<CryptoAddress[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAddress | null>(null);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [copied, setCopied] = useState(false);
  const [cryptoTimer, setCryptoTimer] = useState(3600); // 60 minutes in seconds

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "crypto">("paystack");

  // Check auth and load user data
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user-data');

    if (!token) {
      router.push('/cart?auth=login');
      return;
    }

    setIsLoggedIn(true);

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setFullName(parsed.name || "");
        setEmail(parsed.email || "");
        setPhone(parsed.phone || "");
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }

    // Fetch initial data
    const fetchInitialData = async () => {
      // Fetch addresses
      try {
        const addressesRes = await apiClient('/addresses');
        if (addressesRes.success) {
          setAddresses(addressesRes.data);
          if (addressesRes.data.length > 0) {
            setShowNewAddressForm(false);
          }
        }
      } catch (e) {
        console.error("Failed to fetch addresses:", e);
      }

      // Fetch countries - critical for checkout
      try {
        const countriesRes = await apiClient('/countries');
        if (countriesRes.success) setCountries(countriesRes.data);
      } catch (e) {
        console.error("Failed to fetch countries:", e);
      }

      // Fetch crypto addresses - optional
      try {
        const cryptoRes = await apiClient('/crypto-addresses');
        if (cryptoRes.success) setCryptoAddresses(cryptoRes.data);
      } catch (e) {
        console.error("Failed to fetch crypto addresses:", e);
      }

      // Fetch exchange rate - optional
      try {
        const exchangeRes = await apiClient('/exchange-rate');
        if (exchangeRes.success) setExchangeRate(exchangeRes.data.rate);
      } catch (e) {
        console.error("Failed to fetch exchange rate:", e);
      }

      setIsLoading(false);
    };

    fetchInitialData();

    // Auth change listener
    const handleAuthChange = (event: any) => {
      if (event.detail?.logout) {
        setIsLoggedIn(false);
        router.push('/');
      }
    };
    window.addEventListener('auth-state-changed', handleAuthChange as EventListener);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange as EventListener);
  }, [router]);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountryId) {
      setStates([]);
      return;
    }
    const fetchStates = async () => {
      try {
        const res = await apiClient(`/states/${selectedCountryId}`);
        if (res.success) setStates(res.data);
      } catch (e) { console.error(e); }
    };
    fetchStates();
  }, [selectedCountryId]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedStateId) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const res = await apiClient(`/cities/${selectedStateId}`);
        if (res.success) setCities(res.data);
      } catch (e) { console.error(e); }
    };
    fetchCities();
  }, [selectedStateId]);

  // Fetch shipping info when city or method changes
  useEffect(() => {
    if (!selectedCityId || !shippingMethod) return;
    const fetchShipping = async () => {
      try {
        const res = await apiClient(`/shipping-info/${selectedCityId}/${shippingMethod}`);
        if (res.success) {
          setShippingFee(res.data.shipping_fee || 0);
          setTaxRate(res.data.tax || 0);
        }
      } catch (e) { console.error(e); }
    };
    fetchShipping();
  }, [selectedCityId, shippingMethod]);

  // Crypto timer countdown
  useEffect(() => {
    if (!showCryptoModal) {
      setCryptoTimer(3600); // Reset timer when modal closes
      return;
    }

    const interval = setInterval(() => {
      setCryptoTimer(prev => {
        if (prev <= 1) {
          setShowCryptoModal(false);
          setOrderError("Payment session expired. Please try again.");
          return 3600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showCryptoModal]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddressSelect = (addrId: number) => {
    const addr = addresses.find(a => a.id === addrId);
    if (addr) {
      setSelectedAddressId(addrId);
      setAddress(addr.address);
      setSelectedCountryId(addr.country_id);
      setSelectedStateId(addr.state_id);
      setSelectedCityId(addr.city_id);
      setPostcode(addr.postcode || "");
      setBusStop(addr.bus_stop || "");
      setAdditionalInfo(addr.add_info || "");
      setShowNewAddressForm(false);
    }
  };

  // Order placement state
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Redirect if cart is empty, unless order was just placed
  useEffect(() => {
    if (!isLoading && cartItems.length === 0 && !isOrderPlaced) {
      router.push('/cart');
    }
  }, [cartItems, isLoading, router, isOrderPlaced]);

  const { formatPrice } = useCurrency();

  const formatUSD = (price: number) => {
    const usdAmount = price / exchangeRate;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdAmount);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const response = await apiClient('/apply-coupon', {
        method: 'POST',
        body: JSON.stringify({ code: couponCode, cart_total: cartTotal }),
      });

      if (response.success) {
        setCouponDiscount(response.discount || 0);
        setCouponMessage(response.message || "Coupon applied!");
        setCouponValid(true);
      } else {
        setCouponMessage(response.message || "Invalid coupon");
        setCouponDiscount(0);
        setCouponValid(false);
      }
    } catch (error) {
      setCouponMessage("Failed to apply coupon");
      setCouponDiscount(0);
      setCouponValid(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponMessage("");
    setCouponValid(false);
  };

  const taxAmount = (cartTotal - couponDiscount) * (taxRate / 100);
  const orderTotal = cartTotal + shippingFee + taxAmount - couponDiscount;

  const handleProceedToPayment = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!phone.trim()) errors.phone = "Phone number is required";
    if (!address.trim()) errors.address = "Address is required";
    if (!selectedCountryId) errors.country = "Please select a country";
    if (!selectedStateId) errors.state = "Please select a state";
    if (!selectedCityId) errors.city = "Please select a city";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setShowPayment(true);
  };

  const handleSaveAddress = async () => {
    if (!saveAddress) return;

    try {
      await apiClient('/addresses', {
        method: 'POST',
        body: JSON.stringify({
          street_address: address,
          city_id: Number(selectedCityId),
          state_id: Number(selectedStateId),
          country_id: Number(selectedCountryId),
          postcode: postcode,
          bus_stop: busStop,
          additional_info: additionalInfo,
          name: fullName,
          phone: phone
        })
      });
    } catch (e) {
      console.error("Failed to save address:", e);
    }
  };

  const handlePaystackPayment = async () => {
    // Prevent double-clicks
    if (isProcessing) return;

    setIsProcessing(true);
    setOrderError("");

    try {
      // Step 1: Validate stock before proceeding
      const stockValidation = await apiClient('/validate-stock', {
        method: 'POST',
        body: JSON.stringify({
          cart_items: cartItems.map(item => ({
            product_id: item.productId,
            quantity: item.qty,
          }))
        }),
      });

      if (!stockValidation.success) {
        const errorDetails = stockValidation.details || stockValidation.message || "Some items are no longer available";
        setOrderError(errorDetails);
        setIsProcessing(false);
        return;
      }

      // Step 2: Initialize payment
      const affiliateCode = localStorage.getItem("affiliate_code");

      const paymentData = {
        name: fullName,
        email: email,
        phone: phone,
        street_address: address,
        city_id: Number(selectedCityId),
        state_id: Number(selectedStateId),
        country_id: Number(selectedCountryId),
        postcode: postcode,
        notes: additionalInfo,
        shipping_method: shippingMethod,
        subtotal: cartTotal,
        shipping_fee: shippingFee,
        tax: taxAmount,
        discount: couponDiscount,
        amount: orderTotal,
        save_address: saveAddress && showNewAddressForm,
        ...(affiliateCode && { affiliate_code: affiliateCode }),
        cart_items: cartItems.map(item => ({
          product_id: item.productId,
          product_name: item.name,
          price: item.price,
          quantity: item.qty,
          size_id: item.sizeId?.toString(),
          color_id: item.colorId,
          color_name: item.colorName
        }))
      };

      const response = await apiClient('/paystack/initialize', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });

      if (response.success && response.data?.authorization_url) {
        // Store reference for potential recovery
        sessionStorage.setItem('pending_payment_ref', response.data.reference);
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        setOrderError(response.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setOrderError("An error occurred while initializing payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCryptoPayment = async () => {
    if (!selectedCrypto || isProcessing) return;

    setIsProcessing(true);
    setOrderError("");

    try {
      // Step 1: Validate stock before proceeding
      const stockValidation = await apiClient('/validate-stock', {
        method: 'POST',
        body: JSON.stringify({
          cart_items: cartItems.map(item => ({
            product_id: item.productId,
            quantity: item.qty,
          }))
        }),
      });

      if (!stockValidation.success) {
        const errorDetails = stockValidation.details || stockValidation.message || "Some items are no longer available";
        setOrderError(errorDetails);
        setIsProcessing(false);
        return;
      }

      // Save address if requested
      if (saveAddress && showNewAddressForm) {
        await handleSaveAddress();
      }

      const affiliateCode = localStorage.getItem("affiliate_code");

      const orderData = {
        name: fullName,
        email: email,
        phone: phone,
        street_address: address,
        city_id: Number(selectedCityId),
        state_id: Number(selectedStateId),
        country_id: Number(selectedCountryId),
        postcode: postcode,
        notes: additionalInfo,
        shipping_method: shippingMethod,
        payment_reference: `CRYPTO_${selectedCrypto.type}_${Date.now()}`,
        payment_method: 'crypto',
        payment_type: selectedCrypto.type.toUpperCase(),
        subtotal: cartTotal,
        shipping_fee: shippingFee,
        tax: taxAmount,
        discount: couponDiscount,
        total: orderTotal,
        ...(affiliateCode && { affiliate_code: affiliateCode }),
        cart_items: cartItems.map(item => ({
          product_id: item.productId,
          product_name: item.name,
          price: item.price,
          quantity: item.qty,
          size_id: item.sizeId?.toString(),
          color_id: item.colorId,
          color_name: item.colorName
        }))
      };

      const response = await apiClient('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      if (response.success) {
        setShowCryptoModal(false);
        // Set flag to prevent redirect to cart when cart is cleared
        setIsOrderPlaced(true);
        // Clear affiliate code and cart
        localStorage.removeItem("affiliate_code");
        clearCart();
        // Redirect to success page
        const invoiceNo = response.data.invoice_no;
        router.push(`/order-success?invoice=${invoiceNo}&method=crypto`);
      } else {
        setOrderError(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      setOrderError("An error occurred while processing your order");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E3E3E3] flex items-center justify-center pt-28">
        <Loader2 className="w-8 h-8 animate-spin text-[#8C0000]" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#E3E3E3] pt-28 md:pt-32 pb-20">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-[#C4C1BE] hover:text-[#6C655D] transition-colors">Home</Link>
            </li>
            <li className="text-[#C4C1BE]">|</li>
            <li className="text-[#100E0C]">Checkout</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Contact & Shipping */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg p-6 shadow-md">
              {/* Contact Section */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-medium text-[#27231F]">Contact</h2>
                {addresses.length > 0 && (
                  <select
                    className="text-sm border-0 text-[#27231F] cursor-pointer bg-transparent outline-none"
                    onChange={(e) => handleAddressSelect(Number(e.target.value))}
                    value={selectedAddressId || ""}
                  >
                    <option value="" disabled>Load Saved Address</option>
                    {addresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.address.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-4">
                {/* Success/Error Messages */}
                {orderSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    {orderSuccess}
                  </div>
                )}
                {orderError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {orderError}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#413A33] mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none ${formErrors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="John Doe"
                      disabled
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#413A33] mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none ${formErrors.email ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="john@example.com"
                        disabled
                      />
                    </div>
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#413A33] mb-2">Phone No</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none ${formErrors.phone ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="+234 800 000 0000"

                      />
                    </div>
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                {/* Shipping Address Section */}
                <div className="flex items-center gap-3 mt-8 mb-4">
                  <Truck className="w-5 h-5 text-[#8C0000]" />
                  <h3 className="text-xl font-medium text-[#27231F]">Shipping Address</h3>
                </div>

                {/* Saved Addresses List */}
                {addresses.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-600">Select a saved address or enter a new one:</p>

                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === addr.id && !showNewAddressForm ? 'border-[#8C0000] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <input
                          type="radio"
                          name="addressSelection"
                          checked={selectedAddressId === addr.id && !showNewAddressForm}
                          onChange={() => handleAddressSelect(addr.id)}
                          className="mt-1 w-4 h-4 text-[#8C0000] focus:ring-[#8C0000]"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#27231F]">{addr.address}</p>
                          <p className="text-xs text-gray-500">
                            {addr.city?.name}, {addr.state?.name}, {addr.country?.name}
                            {addr.postcode && ` - ${addr.postcode}`}
                          </p>
                        </div>
                      </label>
                    ))}

                    {/* New Address Option */}
                    <label
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${showNewAddressForm ? 'border-[#8C0000] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="addressSelection"
                        checked={showNewAddressForm}
                        onChange={() => {
                          setShowNewAddressForm(true);
                          setSelectedAddressId(null);
                          setAddress("");
                          setSelectedCountryId("");
                          setSelectedStateId("");
                          setSelectedCityId("");
                          setPostcode("");
                          setBusStop("");
                          setAdditionalInfo("");
                        }}
                        className="mt-1 w-4 h-4 text-[#8C0000] focus:ring-[#8C0000]"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#27231F]">Enter a new address</p>
                        <p className="text-xs text-gray-500">Add a different delivery address</p>
                      </div>
                    </label>
                  </div>
                )}

                {/* New Address Form - Show if no addresses or if new address is selected */}
                {(addresses.length === 0 || showNewAddressForm) && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#413A33] mb-2">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={2}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none resize-none ${formErrors.address ? 'border-red-500' : 'border-gray-200'}`}
                          placeholder="Enter your street address"
                        />
                      </div>
                      {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#413A33] mb-2">Country</label>
                        <select
                          value={selectedCountryId}
                          onChange={(e) => setSelectedCountryId(e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none bg-white ${formErrors.country ? 'border-red-500' : 'border-gray-200'}`}
                        >
                          <option value="">Select Country</option>
                          {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {formErrors.country && <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#413A33] mb-2">State</label>
                        <select
                          value={selectedStateId}
                          onChange={(e) => setSelectedStateId(e.target.value)}
                          disabled={!selectedCountryId}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none bg-white disabled:opacity-50 ${formErrors.state ? 'border-red-500' : 'border-gray-200'}`}
                        >
                          <option value="">Select State</option>
                          {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#413A33] mb-2">City</label>
                        <select
                          value={selectedCityId}
                          onChange={(e) => setSelectedCityId(e.target.value)}
                          disabled={!selectedStateId}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none bg-white disabled:opacity-50 ${formErrors.city ? 'border-red-500' : 'border-gray-200'}`}
                        >
                          <option value="">Select City</option>
                          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#413A33] mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none"
                          placeholder="e.g. 100001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#413A33] mb-2">Nearest Bus Stop (Optional)</label>
                      <input
                        type="text"
                        value={busStop}
                        onChange={(e) => setBusStop(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none"
                        placeholder="Ogijo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#413A33] mb-2">Additional Information</label>
                      <input
                        type="text"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none"
                        placeholder="Special delivery instructions"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveAddress"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-4 h-4 text-[#8C0000] rounded border-gray-300 focus:ring-[#8C0000]"
                      />
                      <label htmlFor="saveAddress" className="text-sm text-gray-700 cursor-pointer">
                        Save this address for future orders
                      </label>
                    </div>
                  </div>
                )}

                {/* Shipping Method Section */}
                <div className="flex items-center gap-3 mt-8 mb-4">
                  <Truck className="w-5 h-5 text-[#8C0000]" />
                  <h3 className="text-xl font-medium text-[#27231F]">Shipping Method</h3>
                </div>
                <p className="text-sm text-[#4E463D] mb-4">Select your preferred shipping method</p>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-[#8C0000] transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value="rider"
                        checked={shippingMethod === "rider"}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="w-4 h-4 text-[#8C0000] focus:ring-[#8C0000]"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <Truck className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-[#151515]">Company Rider</span>
                      </div>
                    </div>
                    <span className="font-medium text-[#151515]">{selectedCityId ? formatPrice(shippingFee) : formatPrice(0)}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl md:text-3xl font-medium text-[#27231F] mb-6">Order Summary</h2>

              {/* Coupon Input */}
              <div className="flex gap-2 mb-6">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8C0000] focus:border-transparent outline-none text-sm"
                    placeholder="Enter coupon code"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  className="cursor-pointer px-5 py-2.5 border border-[#8C0000] text-[#8C0000] rounded-lg font-medium text-sm hover:bg-[#8C0000] hover:text-white transition-colors"
                >
                  Apply
                </button>
              </div>

              {couponMessage && (
                <div className={`text-sm mb-4 flex items-center justify-between ${couponValid ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{couponMessage}</span>
                  {couponValid && (
                    <button onClick={removeCoupon} className="text-red-600 text-xs cursor-pointer">Remove</button>
                  )}
                </div>
              )}

              {/* Order Breakdown */}
              <div className="space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-[#27231F]">Items Subtotal:</span>
                  <span className="text-[#27231F]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#27231F]">Shipping Fee:</span>
                  <span className="text-[#27231F]">{formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#27231F]">Tax ({taxRate}%):</span>
                  <span className="text-[#27231F]">{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#27231F]">Discount:</span>
                  <span className="text-[#27231F]">-{formatPrice(couponDiscount)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-[#27231F]">Order Total:</span>
                  <span className="text-lg font-bold text-[#27231F]">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="cursor-pointer w-full mt-6 bg-[#8C0000] text-white py-4 rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>

            {/* Payment Methods - Show after clicking proceed */}
            {showPayment && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-[#8C0000]" />
                  <h2 className="text-xl font-semibold text-[#27231F]">Payment Method</h2>
                </div>
                <p className="text-sm text-[#C4C1BE] mb-4">Select your preferred payment method</p>

                <div className="space-y-4">
                  {/* Paystack Option */}
                  <div
                    onClick={() => setPaymentMethod("paystack")}
                    className={`cursor-pointer p-4 border-2 rounded-xl hover:border-[#8C0000] transition-colors ${paymentMethod === "paystack" ? "border-[#8C0000]" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="paystack"
                          checked={paymentMethod === "paystack"}
                          onChange={() => setPaymentMethod("paystack")}
                          className="w-4 h-4 text-[#8C0000]"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Paystack</span>
                          <p className="text-xs text-gray-500">Cards, Bank Transfer, USSD</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-white">P</span>
                      </div>
                    </div>
                  </div>

                  {/* Crypto Payment Option */}
                  {cryptoAddresses.length > 0 && (
                    <div className={`border-2 rounded-xl transition-colors ${paymentMethod === "crypto" ? "border-[#8C0000]" : "border-gray-200"}`}>
                      <div
                        onClick={() => {
                          setPaymentMethod("crypto");
                          setShowCryptoDropdown(!showCryptoDropdown);
                        }}
                        className="cursor-pointer p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="payment"
                              value="crypto"
                              checked={paymentMethod === "crypto"}
                              onChange={() => setPaymentMethod("crypto")}
                              className="w-4 h-4 text-[#8C0000]"
                            />
                            <div>
                              <span className="font-medium text-gray-900">Cryptocurrency</span>
                              <p className="text-xs text-gray-500">USDC, USDT</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                              {cryptoAddresses.slice(0, 2).map((c, i) => (
                                <div key={c.id} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                                  {c.type.charAt(0)}
                                </div>
                              ))}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCryptoDropdown ? "rotate-180" : ""}`} />
                          </div>
                        </div>
                      </div>

                      {showCryptoDropdown && (
                        <div className="px-4 pb-4 space-y-2">
                          <h4 className="text-sm font-medium text-[#27231F] mb-2">Select Cryptocurrency</h4>
                          {cryptoAddresses.map(crypto => (
                            <label
                              key={crypto.id}
                              onClick={() => {
                                setSelectedCrypto(crypto);
                                setShowCryptoModal(true);
                              }}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input type="radio" name="crypto" className="w-4 h-4 text-[#8C0000]" />
                              <span className="text-sm">{crypto.type}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pay Now Button */}
                  <button
                    onClick={paymentMethod === "paystack" ? handlePaystackPayment : () => { }}
                    disabled={isProcessing || (paymentMethod === "crypto" && !selectedCrypto)}
                    className="cursor-pointer w-full mt-4 bg-[#8C0000] text-white py-4 rounded-lg font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Complete Payment
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Cart Items Preview */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium text-[#27231F] mb-4">Your Items ({cartCount})</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#100E0C] line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      {item.sizeName && <p className="text-xs text-gray-500">Size: {item.sizeName}</p>}
                      <p className="text-sm font-bold text-[#8C0000]">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crypto Modal */}
      {showCryptoModal && selectedCrypto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCryptoModal(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-xl w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#6C655D]">
                Pay {formatUSD(orderTotal)} with {selectedCrypto.type.toUpperCase()}
              </h3>
              <button
                onClick={() => setShowCryptoModal(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-[#6C655D] mb-4">
              You can make payment by sending {selectedCrypto.type.toUpperCase()} token to this address below
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={selectedCrypto.address}
                readOnly
                className="flex-1 p-3 border border-[#100E0C] rounded bg-transparent text-sm text-[#6C655D]"
              />
              <button
                onClick={() => copyToClipboard(selectedCrypto.address)}
                className="px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer relative"
              >
                <Copy className="w-4 h-4" />
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                    Copied!
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={handleCryptoPayment}
              disabled={isProcessing}
              className="w-full mt-6 bg-[#8C0000] text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Click Here After Payment"}
            </button>

            <div className="mt-4 text-center">
              <span className="text-[#6C655D]">Note: This address is valid for </span>
              <span className={`font-mono ${cryptoTimer < 300 ? 'text-red-500' : 'text-[#FFAE0D]'}`}>
                {formatTimer(cryptoTimer)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
