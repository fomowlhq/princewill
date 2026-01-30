// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount?: number;
  images: string[];
  mainImage: string[];
  categoryId: number;
  subcategoryId?: number;
  description?: string;
  qty: number;
  isActive: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  unisex: boolean;
  recommended: boolean;
  color?: Color;
  category?: Category;
  subcategory?: SubCategory;
  shippingDetail?: string;
  variationGroupId?: number;
  completeGroupId?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDetail extends Product {
  sizeDetails: Size[];
  completeDetails: Product[];
  variations: Product[];
}

export interface Color {
  id: number;
  name: string;
  code: string;
}

export interface Size {
  id: number;
  name: string;
  sizeCode: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  status: boolean;
  image?: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  status: boolean;
  categoryId: number;
}

// Banner Types
export interface AdBanner {
  id: number;
  firstTitle?: string;
  firstBannerImage: string[];
  firstBannerLink?: string;
  secondTitle?: string;
  secondBannerImages: string[];
  secondBannerLink?: string;
}

export interface HomeAccessory {
  id: number;
  image: string;
  bgImage: string;
}

// Currency Types
export interface Currency {
  id: number;
  code: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isAffiliate: boolean;
}

// Cart Types
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

// Wishlist Types
export interface WishlistItem {
  id: number;
  productId: number;
  product: Product;
}

// Order Types
export interface Order {
  id: number;
  userId: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

// Affiliate Types
export interface Affiliate {
  id: number;
  userId: number;
  affiliateCode: string;
  commissionRate: number;
  totalEarnings: number;
  isActive: boolean;
  bankName: string | null;
  accountNumber: string | null;
}

export interface AffiliateStats {
  totalClicks: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  totalEarnings: number;
  pendingEarnings: number;
  approvedPurchasesCount: number;
  availablePayout: number;
}

export interface AffiliateTransaction {
  id: number;
  type: 'deposit' | 'withdraw';
  amount: number;
  createdAt: string;
  meta: {
    reference?: string;
    orderId?: number;
    note?: string;
    commissionId?: number;
  };
  productName?: string;
  status: string;
}

export interface AffiliateCommission {
  id: number;
  affiliateId: number;
  orderId: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'paid';
  order: OrderWithTracking;
}

export interface OrderWithTracking {
  id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  orderDate: string;
  processingDate?: string;
  shippedDate?: string;
  deliveredDate?: string;
}

export interface AffiliateFaq {
  id: number;
  title: string;
  content: string;
}

export interface AffiliateOfMonth {
  id: number;
  image: string;
  name: string;
  description: string;
}

export interface Bank {
  name: string;
  code: string;
}

export interface AffiliateDashboardData {
  affiliate: Affiliate;
  stats: AffiliateStats;
  products: { id: number; name: string }[];
  affiliateLink: string;
  frequentAffiliateBuyers: number;
}

export interface AffiliateLandingData {
  faqs: AffiliateFaq[];
  bestAffiliates: AffiliateOfMonth[];
}
