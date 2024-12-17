export const calculateDiscountedPrice = (
  originalPrice: number,
  discount?: { type: 'flat' | 'percentage'; value: number }
): number => {
  if (!discount) return originalPrice;

  if (discount.type === 'flat') {
    return Math.max(0, originalPrice - discount.value);
  } else {
    return Math.max(0, originalPrice * (1 - discount.value / 100));
  }
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};