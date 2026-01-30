"use client";

import { useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function AffiliateTrackContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = params.code as string;

    useEffect(() => {
        async function trackAndRedirect() {
            // Skip known sub-routes that aren't affiliate codes
            if (["dashboard", "register"].includes(code)) {
                return;
            }

            try {
                const productParam = searchParams.get("product");
                const url = `${API_URL}/affiliate/track/${code}${productParam ? `?product=${productParam}` : ""}`;

                const res = await fetch(url, {
                    credentials: "include",
                });
                const data = await res.json();

                // Store affiliate code in localStorage so it persists
                // across the checkout flow (cookies don't work cross-origin)
                if (data.success) {
                    localStorage.setItem("affiliate_code", code);
                }

                if (data.redirect) {
                    router.replace(data.redirect);
                } else {
                    router.replace("/");
                }
            } catch {
                router.replace("/");
            }
        }

        trackAndRedirect();
    }, [code, searchParams, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
            <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin" />
            <p className="text-gray-500 text-sm">Redirecting...</p>
        </div>
    );
}

export default function AffiliateTrackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
                <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin" />
                <p className="text-gray-500 text-sm">Loading...</p>
            </div>
        }>
            <AffiliateTrackContent />
        </Suspense>
    );
}
