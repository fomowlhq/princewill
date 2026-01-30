"use client";

import { useState } from "react";
import { Plus, Minus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductAccordionsProps {
  description: string;
  shippingDetail?: string;
}

export default function ProductAccordions({ description, shippingDetail }: ProductAccordionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sections = [
    { title: "Product Description", content: description, type: "html" },
    { title: "Shipping & Returns", content: shippingDetail || "We offer fast and reliable shipping options. Returns are accepted within 30 days of purchase in original condition.", type: "html" },
    { title: "Our Commitment", type: "benefits" }
  ];

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div key={index} className="border-b border-gray-100 last:border-0 pb-4">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-4 text-xs font-black uppercase tracking-widest text-gray-900 group"
          >
            <span className="group-hover:text-[#8C0000] transition-colors">{section.title}</span>
            {openIndex === index ? (
              <Minus className="w-4 h-4 text-[#8C0000]" />
            ) : (
              <Plus className="w-4 h-4 text-gray-400 group-hover:text-black" />
            )}
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pb-6">
                  {section.type === "html" ? (
                    <div 
                        className="text-sm text-gray-500 leading-relaxed font-medium prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content || "" }}
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <BenefitItem 
                            icon={<Truck className="w-4 h-4" />}
                            title="Global Shipping"
                            desc="Premium doorstep delivery worldwide"
                        />
                         <BenefitItem 
                            icon={<RotateCcw className="w-4 h-4" />}
                            title="Easy Returns"
                            desc="Hassle-free 30-day return policy"
                        />
                         <BenefitItem 
                            icon={<ShieldCheck className="w-4 h-4" />}
                            title="Secure Payment"
                            desc="100% encrypted payment gateway"
                        />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function BenefitItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="bg-white p-2 rounded-lg shadow-sm text-[#8C0000]">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-0.5">{title}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{desc}</p>
            </div>
        </div>
    );
}
