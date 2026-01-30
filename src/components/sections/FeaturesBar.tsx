"use client";

import Link from "next/link";
import { Sparkles, Truck, Shield, RotateCcw } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₦100,000",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure payment",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30 days return policy",
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "Authentic products",
  },
];

export default function FeaturesBar() {
  return (
    <section className="py-8 md:py-12 bg-gray-900 mb-12 md:mb-20">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-[#8C0000]/10 flex items-center justify-center group-hover:bg-[#8C0000]/20 transition-colors">
                <feature.icon className="w-5 h-5 text-[#8C0000]" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm md:text-base">
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-xs md:text-sm mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
