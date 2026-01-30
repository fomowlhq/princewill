"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user: any;
  onLogout: () => void;
  isScrolled?: boolean;
}

export function UserMenu({ user, onLogout, isScrolled }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 transition-colors cursor-pointer group",
          isScrolled ? "text-gray-600 hover:text-black" : "text-white hover:text-white/80"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center border transition-colors",
          isScrolled 
            ? "bg-gray-100 border-gray-200 group-hover:border-gray-300" 
            : "bg-white/10 border-white/20 group-hover:border-white/40"
        )}>
          <User className="w-4 h-4" />
        </div>
        <div className="hidden xl:flex flex-col items-start leading-none">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest mb-0.5",
            isScrolled ? "text-gray-400" : "text-white/40"
          )}>Welcome</span>
          <span className="text-xs font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
        </div>
        <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>

      {/* Dropdown */}
      <div className={cn(
        "absolute top-full right-0 mt-4 w-56 bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 transform origin-top-right z-50 border border-gray-100",
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      )}>
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
          <p className="text-sm font-black text-gray-900 truncate">{user.email}</p>
        </div>

        <div className="p-2">
          <Link 
            href="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-[#8C0000] hover:bg-red-50 rounded-xl transition-all font-bold"
          >
            <Settings className="w-4 h-4" />
            <span>My Account</span>
          </Link>
          
          <button 
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-[#8C0000] hover:bg-red-50 rounded-xl transition-all font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
