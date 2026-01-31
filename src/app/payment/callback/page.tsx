"use client";

import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const verificationAttempted = useRef(false);

  const verifyPayment = useCallback(async (paymentRef: string, attempt: number = 1): Promise<boolean> => {
    try {
      const response = await apiClient("/verify-payment", {
        method: "POST",
        body: JSON.stringify({ reference: paymentRef }),
      });

      if (response.success) {
        setStatus("success");
        setMessage("Payment verified successfully!");
        setInvoiceNo(response.data?.invoice_no || "");

        // Clear cart and affiliate code from localStorage
        localStorage.removeItem("princewill_cart");
        localStorage.removeItem("affiliate_code");
        sessionStorage.removeItem("pending_payment_ref");
        window.dispatchEvent(new CustomEvent("cart-updated"));
        return true;
      } else {
        // If it's a temporary error and we haven't exhausted retries
        if (attempt < MAX_RETRIES && response.status >= 500) {
          setRetryCount(attempt);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return verifyPayment(paymentRef, attempt + 1);
        }

        setStatus("error");
        setMessage(response.message || "Payment verification failed. Please contact support if payment was deducted.");
        return false;
      }
    } catch (error) {
      console.error("Payment verification error:", error);

      // Retry on network errors
      if (attempt < MAX_RETRIES) {
        setRetryCount(attempt);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return verifyPayment(paymentRef, attempt + 1);
      }

      setStatus("error");
      setMessage("Network error while verifying payment. Please check your connection and try again.");
      return false;
    }
  }, []);

  useEffect(() => {
    // Prevent double verification
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");
    const paymentRef = reference || trxref;

    if (!paymentRef) {
      // Try to recover from sessionStorage
      const pendingRef = sessionStorage.getItem("pending_payment_ref");
      if (pendingRef) {
        verifyPayment(pendingRef);
      } else {
        setStatus("error");
        setMessage("No payment reference found. If you completed a payment, please contact support.");
      }
      return;
    }

    verifyPayment(paymentRef);
  }, [searchParams, verifyPayment]);

  const handleManualRetry = async () => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    if (!reference) return;

    setIsRetrying(true);
    setStatus("loading");
    setRetryCount(0);
    verificationAttempted.current = false;

    await verifyPayment(reference);
    setIsRetrying(false);
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 animate-spin text-[#8C0000] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-[#27231F] mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Retry attempt {retryCount} of {MAX_RETRIES}...
            </p>
          )}
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          {invoiceNo && (
            <p className="text-sm text-gray-500 mb-6">
              Invoice No: <span className="font-semibold">{invoiceNo}</span>
            </p>
          )}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-[#8C0000] text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account/orders"
              className="block w-full border border-[#8C0000] text-[#8C0000] py-3 rounded-lg font-semibold hover:bg-[#8C0000] hover:text-white transition-colors"
            >
              View Orders
            </Link>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-y-3">
            <button
              onClick={handleManualRetry}
              disabled={isRetrying}
              className="flex items-center justify-center gap-2 w-full bg-[#8C0000] text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-50"
            >
              {isRetrying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              {isRetrying ? "Retrying..." : "Retry Verification"}
            </button>
            <Link
              href="/account/orders"
              className="block w-full border border-[#8C0000] text-[#8C0000] py-3 rounded-lg font-semibold hover:bg-[#8C0000] hover:text-white transition-colors"
            >
              Check My Orders
            </Link>
            <Link
              href="/"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Reference: {searchParams.get("reference") || searchParams.get("trxref") || "N/A"}
          </p>
        </>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
      <Loader2 className="w-16 h-16 animate-spin text-[#8C0000] mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-[#27231F] mb-2">Loading...</h2>
      <p className="text-gray-600">Please wait...</p>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <div className="min-h-screen bg-[#E3E3E3] flex items-center justify-center pt-28 pb-20 px-4">
      <Suspense fallback={<LoadingFallback />}>
        <PaymentCallbackContent />
      </Suspense>
    </div>
  );
}
