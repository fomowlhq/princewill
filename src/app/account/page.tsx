"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { FlipCard } from "@/components/account/FlipCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AccountPage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user-data");
        if (savedUser && savedUser !== "undefined") {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin" />
            </div>
        );
    }

    const firstName = user?.name ? user.name.split(' ')[0] : 'Guest';

    return (
        <ProtectedRoute>
            <div className="relative section-padding overflow-hidden pt-32 pb-20 bg-white min-h-screen">
                <div className="container-custom">
                    <div className="absolute right-2 top-[23%] hidden w-[30%] lg:block pointer-events-none">
                        <Image
                            className="opacity-10"
                            src="/images/princewil-logo-red.png"
                            alt="logo"
                            width={400}
                            height={500}
                        />
                    </div>

                    <div className="mb-4">
                        {/* Breadcrumb */}
                        <nav className="justify-between" aria-label="Breadcrumb">
                            <ol className="mb-3 inline-flex items-center space-x-1">
                                <li>
                                    <div className="flex items-center">
                                        <Link href="/" className="text-base font-normal text-[#C4C1BE] hover:text-gray-600">Home</Link>
                                    </div>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <span className="text-[#C4C1BE]">|</span>
                                        <span className="mx-1 text-base font-normal text-[#100E0C]">Profile</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="">
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                            <h1 className="whitespace-nowrap text-2xl font-bold text-[#100E0C] lg:text-4xl">
                                Hello {firstName}!
                            </h1>
                            <span className="whitespace-nowrap text-base text-[#4E463D] lg:text-2xl">
                                Welcome to your profile
                            </span>
                        </div>

                        <div className="my-8 w-full">
                            <div className="w-full lg:w-[65%]">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Card 1: Account */}
                                    <FlipCard
                                        title="Account"
                                        description="View | Edit"
                                        subDescription="your Personal information"
                                        backContent={
                                            <div className="flex flex-col gap-4 w-full">
                                                <Link
                                                    href="/account/profile"
                                                    className="w-full cursor-pointer whitespace-nowrap rounded bg-[#8C0000] py-3 text-center text-xs font-medium text-[#FAFDFD] hover:bg-black transition-colors"
                                                >
                                                    Edit Personal Information
                                                </Link>
                                                <Link
                                                    href="/account/password"
                                                    className="w-full cursor-pointer rounded bg-[#8C0000] py-3 text-center text-xs font-medium text-[#FAFDFD] hover:bg-black transition-colors"
                                                >
                                                    Reset Password
                                                </Link>
                                            </div>
                                        }
                                    />

                                    {/* Card 2: Orders */}
                                    <FlipCard
                                        title="Order"
                                        description="Track order | view"
                                        subDescription="order history"
                                        backContent={
                                            <div className="flex flex-col gap-4 w-full">
                                                <Link
                                                    href="/account/orders"
                                                    className="w-full whitespace-nowrap rounded bg-[#8C0000] py-3 text-center text-xs font-medium text-[#FAFDFD] hover:bg-black transition-colors"
                                                >
                                                    View Order History
                                                </Link>
                                                <Link
                                                    href="/account/orders/track"
                                                    className="w-full rounded bg-[#8C0000] py-3 text-center text-xs font-medium text-[#FAFDFD] hover:bg-black transition-colors"
                                                >
                                                    Track Order
                                                </Link>
                                            </div>
                                        }
                                    />

                                    {/* Card 3: Shipping */}
                                    <FlipCard
                                        title="Shipping"
                                        description="View | Edit"
                                        subDescription="your shipping address"
                                        backContent={
                                            <div className="flex flex-col gap-4 w-full">
                                                <Link
                                                    href="/account/addresses"
                                                    className="w-full cursor-pointer whitespace-nowrap rounded bg-[#8C0000] py-3 text-center text-xs font-medium text-[#FAFDFD] hover:bg-black transition-colors"
                                                >
                                                    Edit Shipping Address
                                                </Link>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>

                            <div className="lg:hidden my-12">
                                <h2 className="w-[75%] text-base text-[#100E0C]">
                                    Explore all Princewill products now and enjoy up to 10% off on our latest collection!
                                </h2>
                                <div className="mt-6">
                                    <Link href="/" className="inline-block rounded-md bg-[#8C0000] px-8 py-2.5 text-center text-sm font-medium text-[#FAFDFD] hover:bg-black transition-all">
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
