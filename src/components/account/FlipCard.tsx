"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpCircle, X } from "lucide-react";

interface FlipCardProps {
    title: string;
    description: string;
    subDescription?: string;
    frontIcon?: React.ReactNode;
    backContent: React.ReactNode;
}

export function FlipCard({
    title,
    description,
    subDescription,
    backContent
}: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="card-container relative h-[400px] w-full overflow-hidden">
            {/* Front Side */}
            <div
                className={cn(
                    "front absolute inset-0 flex items-center justify-center bg-[#2E3131] text-white transition-transform duration-500 ease-out z-10",
                    isFlipped ? "-translate-y-full" : "translate-y-0"
                )}
            >
                <div className="w-full text-center">
                    <div className="mb-6 h-24 text-center text-white">
                        <h3 className="text-2xl">{title}</h3>
                        <p className="text-xs">{description}</p>
                        {subDescription && (
                            <p className="text-center text-xs">
                                {subDescription.split(' ').slice(0, 2).join(' ')}<br />
                                {subDescription.split(' ').slice(2).join(' ')}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => setIsFlipped(true)}
                        className="showBack h-10 w-10 cursor-pointer bg-[#8C0000] hover:bg-gray-200 inline-flex items-center justify-center"
                    >
                        <ArrowUpCircle className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>

            {/* Back Side */}
            <div
                className={cn(
                    "back absolute inset-0 bg-white transition-transform duration-500 ease-out z-20",
                    isFlipped ? "translate-y-0" : "-translate-y-full"
                )}
            >
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setIsFlipped(false)}
                        className="closeBack cursor-pointer text-gray-500 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex h-[80%] flex-col items-center justify-center gap-4 px-4">
                    {backContent}
                </div>
            </div>
        </div>
    );
}
