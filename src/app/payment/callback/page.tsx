"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    const paymentRef = reference || trxref;

    if (!paymentRef) {
      setStatus("error");
      setMessage("No payment reference found");
      return;
    }

    const verifyPayment = async () => {
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
          window.dispatchEvent(new CustomEvent("cart-updated"));
        } else {
          setStatus("error");
          setMessage(response.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage("An error occurred while verifying payment");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 animate-spin text-[#8C0000] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-[#27231F] mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
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
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-y-3">
            <Link
              href="/checkout"
              className="block w-full bg-[#8C0000] text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
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
