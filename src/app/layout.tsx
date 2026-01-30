import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Princewill World | Premium Fashion & Lifestyle",
    template: "%s | Princewill World",
  },
  description: "Discover premium fashion, clothing, and accessories at Princewill World. Shop the latest trends in men's and women's fashion with worldwide shipping.",
  keywords: ["fashion", "clothing", "accessories", "online shopping", "Princewill World", "premium fashion", "men's fashion", "women's fashion"],
  authors: [{ name: "Princewill World" }],
  creator: "Princewill World",
  publisher: "Princewill World",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-small.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo-small.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://princewillworld.netlify.app",
    siteName: "Princewill World",
    title: "Princewill World | Premium Fashion & Lifestyle",
    description: "Discover premium fashion, clothing, and accessories at Princewill World. Shop the latest trends with worldwide shipping.",
    images: [
      {
        url: "/images/logo-small.png",
        width: 800,
        height: 600,
        alt: "Princewill World",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Princewill World | Premium Fashion & Lifestyle",
    description: "Discover premium fashion, clothing, and accessories at Princewill World.",
    images: ["/images/logo-small.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://princewillworld.netlify.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <CurrencyProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <Toaster position="bottom-right" toastOptions={{
                style: {
                  background: '#100E0C',
                  color: '#fff',
                  border: '1px solid #333',
                },
              }} />
            </CartProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
