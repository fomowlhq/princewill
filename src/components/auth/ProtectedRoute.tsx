"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireVerification?: boolean;
}

export function ProtectedRoute({ children, requireVerification = true }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        const userData = localStorage.getItem("user-data");

        if (!token || !userData || userData === "undefined") {
            // Dispatch event to open login drawer if needed, but for now just redirect
            router.push("/");
            // Optional: Store the intended destination to redirect back after login
            // localStorage.setItem("redirect-after-login", pathname);
            return;
        }

        // Check email verification status
        if (requireVerification) {
            try {
                const user = JSON.parse(userData);
                if (!user.email_verified_at) {
                    router.push("/verify-email");
                    return;
                }
            } catch {
                router.push("/");
                return;
            }
        }

        setIsAuthorized(true);
    }, [router, pathname, requireVerification]);

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
