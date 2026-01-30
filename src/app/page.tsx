import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import { NewArrivals, BestSellers, UnisexSection } from "@/components/products";
import { CollectionBanner } from "@/components/banners";
import { CategorySection, FeaturesBar } from "@/components/sections";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* New Arrivals Section */}
      <NewArrivals currency="NGN" />
      
      {/* Best Sellers Section */}
      <BestSellers currency="NGN" />
      
      {/* Collection Banner - Men's */}
      <CollectionBanner
        title="MEN'S"
        images={["/images/banners/men-collection.jpg"]}
        link="/category/men"
        variant="primary"
      />
      
      {/* Unisex Section */}
      <UnisexSection currency="NGN" />
      
      {/* Collection Banner - Women's */}
      <CollectionBanner
        title="WOMEN'S"
        images={["/images/banners/women-collection.jpg"]}
        link="/category/women"
        variant="secondary"
      />
      
      {/* Category Section - Accessories */}
      <CategorySection />
      
      {/* Features Bar */}
      {/* <FeaturesBar /> */}
    </main>
  );
}
