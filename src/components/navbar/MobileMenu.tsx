"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Search, ChevronDown, ChevronRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem, DropdownItem } from "./types";
import { useCurrency } from "@/context/CurrencyContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  handleLogout: () => void;
  setAuthOpen: (open: boolean) => void;
  setAuthMode: (mode: "login" | "register") => void;
  items: MenuItem[];
  onSearchOpen: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  user,
  handleLogout,
  setAuthOpen,
  setAuthMode,
  items,
  onSearchOpen
}: MobileMenuProps) {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const handleClose = () => {
    setActiveDrawer(null);
    onClose();
  };

  return (
    <div
      className={cn(
        "lg:hidden fixed inset-0 z-100 bg-white transition-all duration-500 ease-in-out transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full bg-white relative overflow-hidden">
        {/* Root Menu View */}
        <div className={cn(
          "flex flex-col h-full transition-transform duration-500",
          activeDrawer ? "-translate-x-full" : "translate-x-0"
        )}>
          {/* Menu Header */}
          <div className="p-6 flex flex-col gap-6 bg-[#1a1a1a]">
            <button
              onClick={handleClose}
              className="text-white hover:rotate-90 transition-transform duration-300 w-fit cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>

            <div
              className="relative cursor-pointer"
              onClick={() => {
                onClose();
                onSearchOpen();
              }}
            >
              <div className="w-full bg-white text-gray-400 px-5 py-4 rounded-xl shadow-lg text-base flex items-center justify-between">
                <span>What are you looking for?</span>
                <Search className="text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={handleClose}
                className="text-white text-xl font-bold cursor-pointer"
              >
                Home
              </Link>

              <div className="relative">
                <button
                  onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-colors hover:bg-white/10"
                >
                  {currency === "NGN" ? (
                    <div className="w-5 h-3.5 relative overflow-hidden flex rounded-[1px] shrink-0">
                      <div className="w-1/3 h-full bg-green-600" />
                      <div className="w-1/3 h-full bg-white" />
                      <div className="w-1/3 h-full bg-green-600" />
                    </div>
                  ) : (
                    <div className="w-5 h-3.5 relative overflow-hidden bg-[#002868] rounded-[1px] flex items-start shrink-0">
                      <div className="absolute inset-0 flex flex-col">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-[#BF0A30]" : "bg-white"}`} />
                        ))}
                      </div>
                      <div className="absolute top-0 left-0 w-[40%] h-[57%] bg-[#002868]" />
                    </div>
                  )}
                  <span className="font-bold">{currency === "NGN" ? "NGN ₦" : "USD $"}</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", currencyMenuOpen && "rotate-180")} />
                </button>

                {/* Currency Dropdown */}
                {currencyMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        setCurrency("NGN");
                        setCurrencyMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3.5 text-sm transition-colors cursor-pointer",
                        currency === "NGN" ? "bg-red-50 text-[#8C0000] font-bold" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-3.5 relative overflow-hidden flex rounded-[1px] shrink-0 shadow-sm border border-gray-100">
                          <div className="w-1/3 h-full bg-green-600" />
                          <div className="w-1/3 h-full bg-white" />
                          <div className="w-1/3 h-full bg-green-600" />
                        </div>
                        <span>NGN ₦</span>
                      </div>
                      {currency === "NGN" && <Check className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setCurrency("USD");
                        setCurrencyMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3.5 text-sm transition-colors cursor-pointer",
                        currency === "USD" ? "bg-red-50 text-[#8C0000] font-bold" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-3.5 relative overflow-hidden bg-[#002868] rounded-[1px] flex items-start shrink-0 shadow-sm border border-gray-100">
                          <div className="absolute inset-0 flex flex-col">
                            {[...Array(7)].map((_, i) => (
                              <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-[#BF0A30]" : "bg-white"}`} />
                            ))}
                          </div>
                          <div className="absolute top-0 left-0 w-[40%] h-[57%] bg-[#002868]" />
                        </div>
                        <span>USD $</span>
                      </div>
                      {currency === "USD" && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex-1 overflow-y-auto pt-8">
            <div className="px-6 space-y-4">
              {items.map((item) => (
                <div key={item.name} className="border-b border-gray-50 last:border-0 pb-4">
                  {item.hasDropdown ? (
                    <button
                      onClick={() => setActiveDrawer(item.name)}
                      className="w-full flex items-center justify-between text-left font-normal text-gray-900 uppercase tracking-tighter text-lg cursor-pointer"
                    >
                      {item.name}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleClose}
                      className="block text-left font-normal text-gray-900 uppercase tracking-tighter text-lg cursor-pointer"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {!user && (
              <div className="mx-6 my-10 p-8 rounded-2xl bg-linear-to-br from-[#f9dbdb] to-[#fee2e2] text-gray-900 shadow-sm">
                <p className="text-lg leading-snug mb-5 font-bold">
                  Experience the elegance of Nigerian fashion and enjoy 10% discount on your first order
                </p>
                {/* <Link
                  href="/register"
                  onClick={handleClose}
                  className="inline-block bg-[#8C0000] text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider"
                >
                  Sign Up Now
                </Link> */}

                <button
                  onClick={() => {
                    onClose();
                    setAuthMode("login");
                    setAuthOpen(true);
                  }}
                  className="inline-block bg-[#8C0000] text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider"
                >
                  Sign Up Now
                </button>
              </div>
            )}

            <div className="px-6 pb-16 space-y-4">
              {user ? (
                <div className="space-y-4">
                  <div className="text-center py-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-gray-900 font-black uppercase tracking-widest text-sm">{user.name}</p>
                  </div>

                  <Link
                    href="/account"
                    onClick={handleClose}
                    className="block w-full text-center py-4 border-2 border-gray-100 rounded-xl text-gray-900 font-black uppercase tracking-widest text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    My Account
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      handleClose();
                    }}
                    className="block w-full text-center py-4 border-2 border-red-50 rounded-xl text-red-600 font-black uppercase tracking-widest text-sm cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    setAuthMode("login");
                    setAuthOpen(true);
                  }}
                  className="block w-full text-center py-4 border-2 border-gray-100 rounded-xl text-gray-900 font-black uppercase tracking-widest text-sm cursor-pointer"
                >
                  Log in
                </button>
              )}
              <Link
                href={user?.isAffiliate ? "/affiliate/dashboard" : "/affiliate"}
                onClick={handleClose}
                className="block w-full text-center py-4 bg-[#8C0000] text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#8C0000]/20 cursor-pointer"
              >
                {user?.isAffiliate ? "Affiliate Dashboard" : "Become an Affiliate"}
              </Link>
            </div>
          </div>
        </div>

        {/* Sub-Drawers */}
        {items.filter(item => item.hasDropdown).map((item) => (
          <div
            key={`drawer-${item.name}`}
            className={cn(
              "absolute inset-0 bg-white transition-transform duration-500 z-10",
              activeDrawer === item.name ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex h-40 items-center bg-[#F5D3D4]/30 px-6">
                <button
                  onClick={() => setActiveDrawer(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <p className="flex-1 text-center text-xl font-normal uppercase text-gray-700 tracking-wider">
                  {item.name}
                </p>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-8">
                {item.name === "NEW ARRIVALS" ? (
                  /* New Arrivals Accordion Style */
                  <div className="space-y-6">
                    {item.dropdownItems?.map((dropdownCategory) => (
                      <NewArrivalAccordion
                        key={dropdownCategory.name}
                        item={dropdownCategory}
                        closeMenu={handleClose}
                      />
                    ))}
                  </div>
                ) : (
                  /* Standard Category List Style */
                  <ul className="space-y-8">
                    {item.dropdownItems?.map((dropdownItem) => (
                      <li key={dropdownItem.name} className="group">
                        <Link
                          href={dropdownItem.href}
                          onClick={handleClose}
                          className="text-base capitalize text-gray-800 hover:text-[#8C0000] transition-colors inline-block w-full"
                        >
                          {dropdownItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewArrivalAccordion({ item, closeMenu }: { item: DropdownItem; closeMenu: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0 pb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-base font-medium text-gray-800 uppercase tracking-tighter py-2"
      >
        {item.name}
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded ? "rotate-180" : "")} />
      </button>

      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"
      )}>
        <ul className="space-y-4 pl-4">
          {item.submenuItems?.map((subItem) => (
            <li key={subItem.name}>
              <Link
                href={subItem.href}
                onClick={closeMenu}
                className="text-gray-500 hover:text-[#8C0000] transition-colors text-base"
              >
                {subItem.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
