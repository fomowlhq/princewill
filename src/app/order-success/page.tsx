"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, Package, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const invoiceNo = searchParams.get("invoice") || "";
  const paymentMethod = searchParams.get("method") || "paystack";

  const isCrypto = paymentMethod === "crypto";

  return (
    <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>

      <h1 className="text-2xl font-bold text-[#27231F] mb-2">
        Order Placed Successfully!
      </h1>

      <p className="text-gray-600 mb-4">
        Thank you for your order. {isCrypto
          ? "We will verify your crypto payment and process your order shortly."
          : "Your payment has been received and your order is being processed."
        }
      </p>

      {invoiceNo && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Invoice Number</p>
          <p className="text-xl font-bold text-[#8C0000]">{invoiceNo}</p>
        </div>
      )}

      {isCrypto && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Your order will be confirmed once we verify your crypto payment.
            This typically takes 15-30 minutes depending on network confirmation.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Link
          href="/account/orders"
          className="flex items-center justify-center gap-2 w-full bg-[#8C0000] text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors"
        >
          <Package className="w-5 h-5" />
          View My Orders
        </Link>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full border border-[#8C0000] text-[#8C0000] py-3 rounded-lg font-semibold hover:bg-[#8C0000] hover:text-white transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#8C0000] mx-auto" />
      <p className="text-gray-500 mt-4">Loading order details...</p>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#E3E3E3] flex items-center justify-center pt-28 pb-20 px-4">
      <Suspense fallback={<LoadingFallback />}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
