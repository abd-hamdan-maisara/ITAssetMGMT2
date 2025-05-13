import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getStockStatus(current: number, minimum: number): 'critical' | 'low' | 'normal' {
  if (current <= 0) {
    return 'critical';
  } else if (current <= minimum) {
    return 'low';
  } else {
    return 'normal';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function generateSKU(category: string, id: number): string {
  const prefix = category.substring(0, 3).toUpperCase();
  const paddedId = id.toString().padStart(5, '0');
  return `${prefix}-${paddedId}`;
}
