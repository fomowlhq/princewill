"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "./types";

interface DesktopNavProps {
  items: MenuItem[];
  isScrolled?: boolean;
}

export function DesktopNav({ items, isScrolled }: DesktopNavProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden lg:block">
      <div className="container-custom py-3">
        <div className="flex items-center justify-center gap-10">
          {items.map((item) => (
            <div
              key={item.name}
              className="relative group"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "text-xs font-bold tracking-widest transition-colors flex items-center gap-1 cursor-pointer",
                  isScrolled ? "text-gray-600 hover:text-black" : "text-white hover:text-white/70"
                )}
              >
                {item.name}
              </Link>

              {item.hasDropdown && item.dropdownItems && (
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-60">
                  <div className="bg-white shadow-2xl min-w-[220px] py-3 border-t-2 border-[#8C0000]">
                    {item.dropdownItems.map((dropdownItem) => (
                      <div key={dropdownItem.name} className="relative group/sub">
                        <Link
                          href={dropdownItem.href}
                          className="flex items-center justify-between px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#8C0000] transition-colors"
                        >
                          <span>{dropdownItem.name}</span>
                          {dropdownItem.hasSubmenu && <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />}
                        </Link>

                        {dropdownItem.hasSubmenu && dropdownItem.submenuItems && (
                          <div className="absolute top-0 left-full pl-1 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                            <div className="bg-white rounded-lg shadow-2xl min-w-[180px] py-2 border border-gray-100">
                              {dropdownItem.submenuItems.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block px-5 py-2.5 text-sm text-gray-600 hover:text-[#8C0000] hover:bg-gray-50 transition-colors"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
