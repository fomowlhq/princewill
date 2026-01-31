"use client";

import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <WifiOff className="w-24 h-24 mx-auto text-gray-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>

        <p className="text-gray-600 mb-8">
          It looks like you've lost your internet connection. Please check your connection and try again.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 w-full bg-[#8C0000] hover:bg-[#700000] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="block text-[#8C0000] hover:underline"
          >
            Go to Homepage
          </Link>
        </div>

        <p className="mt-12 text-sm text-gray-400">
          Some pages you've visited before may still be available offline.
        </p>
      </div>
    </div>
  );
}
