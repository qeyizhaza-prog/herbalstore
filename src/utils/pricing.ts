import type { ShippingMethod } from '../types/herbal.ts';

export const PROMO_CODE = 'HERBALAWAL';
export const PROMO_MIN_SUBTOTAL = 100000;
export const PROMO_DISCOUNT_PERCENT = 0.1;
export const FREE_SHIPPING_THRESHOLD = 150000;
export const REGULAR_SHIPPING_COST = 18000;
export const EXPRESS_SHIPPING_COST = 15000;

export function isPromoEligible(code: string | undefined, subtotal: number): boolean {
  return Boolean(
    code &&
    code.trim().toUpperCase() === PROMO_CODE &&
    subtotal >= PROMO_MIN_SUBTOTAL
  );
}

export function calculateDiscount(subtotal: number, promoCode?: string): number {
  if (isPromoEligible(promoCode, subtotal)) {
    return Math.round(subtotal * PROMO_DISCOUNT_PERCENT);
  }
  return 0;
}

export function calculateShippingCost(subtotal: number, method: ShippingMethod): number {
  if (method === 'express') {
    return EXPRESS_SHIPPING_COST;
  }
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : REGULAR_SHIPPING_COST;
}

export function calculateOrderTotals(
  subtotal: number,
  shippingMethod: ShippingMethod,
  promoCode?: string
): {
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  freeShippingReached: boolean;
  promoApplied: boolean;
} {
  const discount = calculateDiscount(subtotal, promoCode);
  const shippingCost = calculateShippingCost(subtotal, shippingMethod);
  const total = Math.max(0, subtotal - discount + shippingCost);
  const freeShippingReached = subtotal >= FREE_SHIPPING_THRESHOLD;
  const promoApplied = discount > 0;

  return {
    subtotal,
    discount,
    shippingCost,
    total,
    freeShippingReached,
    promoApplied,
  };
}
