"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  CreditCard,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ContactModal } from "./ContactModal";
import { ShippingModal } from "./ShippingModal";

const footerLinks = {
  customerService: [
    { name: "back to top ↑", href: "#", isScroll: true },
    { name: "Contact Us", href: "/contact" },
    { name: "Track Your Order", href: "/track-order" },
    { name: "Shipping and Return", href: "/shipping" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Policy & Privacy", href: "/policy" },
    // { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

export default function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiClient('/settings');
        if (response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  // Dynamic social links based on settings
  const dynamicSocialLinks = [
    { name: "Instagram", icon: Instagram, href: settings?.instagram || "https://instagram.com" },
    { name: "Facebook", icon: Facebook, href: settings?.facebook || "https://facebook.com" },
    { name: "Twitter", icon: Twitter, href: settings?.twitter || "https://twitter.com" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400 py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Newsletter Column */}
          <div className="md:col-span-6 lg:col-span-5">
            <p className="text-white text-lg md:text-xl mb-8 leading-relaxed max-w-md">
              Subscribe now and never miss out on our latest collections and special deals
            </p>
            <form className="space-y-4 max-w-sm">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full bg-white text-gray-900 px-4 py-4 rounded-md focus:outline-none placeholder:text-gray-400 text-base"
              />
              <button
                type="submit"
                className="cursor-pointer w-full bg-[#8C0000] hover:bg-[#700000] text-white font-bold py-4 rounded-md transition-all duration-300 text-lg uppercase tracking-wider shadow-lg hover:shadow-[#8C0000]/20"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Columns */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-white font-black text-sm mb-8 uppercase tracking-widest">Customer Service</h4>
            <ul className="space-y-5">
              <li>
                <button onClick={scrollToTop} className="cursor-pointer text-sm hover:text-white transition-colors">
                  back to top ↑
                </button>
              </li>
              <li>
                <button onClick={() => setShowContactModal(true)} className="cursor-pointer text-sm hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => setShowShippingModal(true)} className="cursor-pointer text-sm hover:text-white transition-colors">
                  Shipping and Return
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-white font-black text-sm mb-8 uppercase tracking-widest">The Company</h4>
            <ul className="space-y-5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://expo.dev/accounts/vinworlds-organization/projects/princewill/builds/c42c4154-01b3-4af4-97c3-eb7b174a5d5b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  Download Android App
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social and Bottom Bar */}
        <div className="flex flex-col items-center pt-8 border-t border-gray-800">
          <div className="flex items-center gap-8 mb-8">
            {dynamicSocialLinks.map((social) => (
              social.href ? (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-all transform hover:scale-125"
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ) : null
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 text-[10px] md:text-xs text-gray-500">
            <p>© {currentYear} PrincewillWorld. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <CreditCard className="w-4 h-4" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <ShieldCheck className="w-4 h-4" />
                <span>SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      <ShippingModal isOpen={showShippingModal} onClose={() => setShowShippingModal(false)} />
    </footer>
  );
}
