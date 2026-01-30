import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
}

export function calculateDiscount(originalPrice: number, discountPrice: number): number {
  if (!originalPrice || originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}
