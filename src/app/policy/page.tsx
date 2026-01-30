"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface PolicyData {
    policy: string;
}

export default function PolicyPage() {
    const [policyData, setPolicyData] = useState<PolicyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPolicyData = async () => {
            try {
                const response = await apiClient('/policy');
                if (response.success) {
                    setPolicyData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch policy data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPolicyData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin" />
            </div>
        );
    }

    if (!policyData) {
        return null;
    }

    return (
        <div className="overflow-hidden section-padding bg-white pt-32 pb-20 min-h-screen">
            <div className="container-custom">
                <div className="mb-10 mt-8 md:my-12">
                    {/* Breadcrumb */}
                    <nav className="justify-between" aria-label="Breadcrumb">
                        <ol className="mb-3 inline-flex items-center space-x-1">
                            <li>
                                <div className="flex items-center">
                                    <Link href="/" className="text-base font-normal text-[#C4C1BE] hover:text-gray-600">Home</Link>
                                </div>
                            </li>

                            <li>
                                <div className="flex items-center">
                                    <span className="text-[#C4C1BE]">|</span>
                                    <span className="mx-1 text-base font-normal text-[#100E0C]">Privacy</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="mt-8">
                        <div
                            className="text-base text-[#1A1714] leading-relaxed space-y-4 [&>h1]:text-2xl [&>h1]:md:text-3xl [&>h1]:font-medium [&>h1]:text-[#100E0C] [&>h1]:mb-4 [&>h1]:mt-8 [&>p]:mb-4"
                            dangerouslySetInnerHTML={{ __html: policyData.policy }}
                        />
                        {/* <div
                            className=""
                            dangerouslySetInnerHTML={{ __html: policyData.policy }}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
