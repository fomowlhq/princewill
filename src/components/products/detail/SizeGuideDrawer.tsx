"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SizeGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideDrawer({ isOpen, onClose }: SizeGuideDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-110"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-120 shadow-2xl overflow-y-auto"
          >
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Size Guide</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Finding the perfect fit for you</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-[#8C0000] hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-16">
                {/* Male Section */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-1.5 h-8 bg-[#8C0000]" />
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Men's Measurement</h3>
                  </div>
                  <p className="text-xs text-gray-400 font-bold mb-8 uppercase tracking-widest leading-relaxed">
                    Check the chart below and pick your unique size. All sizes are measured in centimeters (CM).
                  </p>
                  
                  <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-gray-50/50">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white border-b border-gray-100 font-black text-[10px] uppercase tracking-widest text-gray-900">
                          <th className="px-6 py-6 font-black">General</th>
                          <th className="px-4 py-6 font-black">UK</th>
                          <th className="px-4 py-6 font-black">US</th>
                          <th className="px-4 py-6 font-black">Bust</th>
                          <th className="px-4 py-6 font-black">Waist</th>
                          <th className="px-4 py-6 font-black">Hips</th>
                          <th className="px-4 py-6 font-black">Shoulder</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-bold text-gray-500">
                        {[
                          { g: "XS", uk: "36", us: "36", b: "88", w: "73", h: "88", s: "41.5" },
                          { g: "S", uk: "38", us: "38", b: "92", w: "79", h: "94", s: "43" },
                          { g: "M", uk: "40", us: "40", b: "98", w: "85", h: "100", s: "44.5" },
                          { g: "L", uk: "42", us: "42", b: "104", w: "91", h: "106", s: "46" },
                          { g: "XL", uk: "44", us: "44", b: "112", w: "99", h: "114", s: "48.5" },
                          { g: "XXL", uk: "46", us: "46", b: "120", w: "107", h: "122", s: "51" },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-gray-100/50 last:border-0 hover:bg-white transition-colors">
                            <td className="px-6 py-5 font-black text-gray-900">{row.g}</td>
                            <td className="px-4 py-5">{row.uk}</td>
                            <td className="px-4 py-5">{row.us}</td>
                            <td className="px-4 py-5">{row.b}</td>
                            <td className="px-4 py-5">{row.w}</td>
                            <td className="px-4 py-5">{row.h}</td>
                            <td className="px-4 py-5">{row.s}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Female Section */}
                <section>
                   <div className="flex items-center gap-4 mb-6">
                    <div className="w-1.5 h-8 bg-[#8C0000]" />
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Women's Measurement</h3>
                  </div>
                  <p className="text-xs text-gray-400 font-bold mb-8 uppercase tracking-widest leading-relaxed">
                    Check the chart below and pick your unique size. All sizes are measured in centimeters (CM).
                  </p>
                  
                  <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-gray-50/50">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white border-b border-gray-100 font-black text-[10px] uppercase tracking-widest text-gray-900">
                          <th className="px-6 py-6 font-black">General</th>
                          <th className="px-2 py-6 font-black">UK</th>
                          <th className="px-2 py-6 font-black">US</th>
                          <th className="px-2 py-6 font-black text-nowrap">Bust</th>
                          <th className="px-2 py-6 font-black text-nowrap">Under Bust</th>
                          <th className="px-2 py-6 font-black text-nowrap">Waist</th>
                          <th className="px-2 py-6 font-black text-nowrap">Hips</th>
                          <th className="px-2 py-6 font-black text-nowrap">Sleeve</th>
                          <th className="px-2 py-6 font-black text-nowrap">Shoulder</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-bold text-gray-500">
                        {[
                          { g: "XS", uk: "6", us: "2", b: "84", ub: "70", w: "66", h: "90", sl: "80.4", s: "38" },
                          { g: "S", uk: "8", us: "4", b: "87", ub: "73", w: "69", h: "93", sl: "81.7", s: "39" },
                          { g: "M", uk: "10", us: "6", b: "90", ub: "76", w: "72", h: "96", sl: "83", s: "40" },
                          { g: "L", uk: "12", us: "8", b: "94", ub: "80", w: "76", h: "100", sl: "85", s: "41.4" },
                          { g: "XL", uk: "12", us: "10", b: "98", ub: "84", w: "80", h: "104", sl: "85.8", s: "42.4" },
                          { g: "XXL", uk: "16", us: "12", b: "103", ub: "89", w: "86", h: "109", sl: "86.6", s: "43.4" },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-gray-100/50 last:border-0 hover:bg-white transition-colors text-nowrap">
                            <td className="px-6 py-5 font-black text-gray-900">{row.g}</td>
                            <td className="px-2 py-5">{row.uk}</td>
                            <td className="px-2 py-5">{row.us}</td>
                            <td className="px-2 py-5">{row.b}</td>
                            <td className="px-2 py-5">{row.ub}</td>
                            <td className="px-2 py-5">{row.w}</td>
                            <td className="px-2 py-5">{row.h}</td>
                            <td className="px-2 py-5">{row.sl}</td>
                            <td className="px-2 py-5">{row.s}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              <div className="mt-20 p-8 rounded-[2.5rem] bg-linear-to-br from-gray-50 to-gray-100 border border-gray-100">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Still Not Sure?</h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-8">
                    Our customer experience team is here to help you find the perfect fit.
                </p>
                <button className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#8C0000] transition-colors">
                    Contact Support
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
