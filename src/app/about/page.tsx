"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface AboutData {
    about: string;
    mission: string;
    story: string;
    vision: string;
    design_for: string;
    join_us: string;
}

export default function AboutPage() {
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await apiClient('/about');
                if (response.success) {
                    setAboutData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch about data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin" />
            </div>
        );
    }

    if (!aboutData) {
        return null;
    }

    return (
        <div className="section-padding overflow-hidden bg-white pt-32 pb-20">
            <div className="container-custom">
                <div className="mb-4">
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
                                    <span className="mx-1 text-base font-normal text-[#100E0C]">About</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <div className="flex items-stretch">
                        <div className="space-y-8 lg:space-y-12 w-full">
                            <div className="">
                                <h2 className="mb-4 text-3xl font-medium text-[#100E0C] 2xl:text-[40px]">About our Brand</h2>
                                <div
                                    className="text-base text-[#1A1714] leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: aboutData.about }}
                                />
                            </div>
                            <div className="">
                                <h2 className="mb-4 text-3xl font-medium text-[#100E0C] 2xl:text-[40px]">Our Mission</h2>
                                <div
                                    className="text-base text-[#1A1714] leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: aboutData.mission }}
                                />
                            </div>
                            <div className="">
                                <h2 className="mb-4 text-3xl font-medium text-[#100E0C] 2xl:text-[40px]">Our Story</h2>
                                <div
                                    className="text-base text-[#1A1714] leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: aboutData.story }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center shadow-2xl p-8 bg-gray-50/50 rounded-lg">
                        <div className="relative w-full h-full min-h-[400px]">
                            <Image
                                src="/images/princewil-logo-red.png"
                                alt="Princewill World"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 lg:mt-16 space-y-8 lg:space-y-12">
                    <div className="">
                        <h2 className="mb-4 text-3xl font-medium text-[#100E0C] 2xl:text-[40px]">Our Vision</h2>
                        <div
                            className="text-base text-[#1A1714] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: aboutData.vision }}
                        />
                    </div>
                    <div className="">
                        <h2 className="mb-4 text-3xl font-medium text-[#100E0C] 2xl:text-[40px]">Who we Design For?</h2>
                        <div
                            className="text-base text-[#1A1714] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: aboutData.design_for }}
                        />
                    </div>
                    <div className="">
                        <h2 className="mb-4 text-3xl font-medium text-[#100E0C] 2xl:text-[40px]">Join Us</h2>
                        <div
                            className="w-full md:w-[70%] text-base text-[#1A1714] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: aboutData.join_us }}
                        />
                    </div>
                </div>

                <div className="mt-12 lg:mt-16 border-t border-gray-100 pt-8">
                    <p className="text-lg text-[#1A1714] font-medium tracking-wide">PRINCEWILL WORLD</p>
                    <p className="text-lg text-[#1A1714] font-medium tracking-wide">WEAR YOUR VALUE</p>
                </div>
            </div>
        </div>
    );
}
