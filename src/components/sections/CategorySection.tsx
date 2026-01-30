"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
  height?: "normal" | "tall";
}

function CategoryCard({ title, image, link, height = "normal" }: CategoryCardProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl group ${height === "tall"
          ? "h-80 md:h-132 2xl:h-162"
          : "h-92 md:h-146 2xl:h-182"
        }`}
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

      {/* Content */}
      <div className="absolute bottom-8 md:bottom-12 left-6 md:left-10 z-10">
        {/* Logo */}
        <div className="mb-3">
          <div className="w-12 h-9 md:w-16 md:h-12 rounded flex items-center justify-center shadow-lg">
            {/* <span className="text-[#8C0000] font-black text-sm md:text-base">PW</span> */}
            <Image
              src="/images/logo-small.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 drop-shadow-lg">
          {title}
        </h3>

        {/* CTA Button */}
        <Link
          href={link}
          className="group/btn inline-flex items-center gap-2 bg-[#8C0000] hover:bg-[#6d0000] text-white font-semibold px-5 md:px-8 py-2.5 md:py-3 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base"
        >
          Explore all
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default function CategorySection() {
  return (
    <section className="py-12 md:py-20">
      <div className="grid grid-cols-2 gap-2">
        <CategoryCard
          title="Men accessories"
          image="/images/categories/men-accessories.jpg"
          link="/collections/men-accessories"
          height="normal"
        />
        <CategoryCard
          title="Women accessories"
          image="/images/categories/women-accessories.jpg"
          link="/collections/women-accessories"
          height="tall"
        />
      </div>
    </section>
  );
}
