import React from 'react';
import { VariantWithDiscount } from '../types';
import DiscountForm from './DiscountForm';
import { calculateDiscountedPrice, formatPrice } from '../utils/discount';

interface ProductVariantProps {
  variant: VariantWithDiscount;
  onApplyDiscount: (discount: { type: 'flat' | 'percentage'; value: number }) => void;
}

const ProductVariant: React.FC<ProductVariantProps> = ({ variant, onApplyDiscount }) => {
  const originalPrice = parseFloat(variant.price);
  const discountedPrice = calculateDiscountedPrice(originalPrice, variant.discount);

  return (
    <div className="flex items-center gap-4 p-2 bg-gray-50 rounded">
      <span className="font-medium">{variant.title}</span>
      <div className="flex items-center gap-2">
        <span className={`${variant.discount ? 'line-through text-gray-400' : 'text-gray-600'}`}>
          {formatPrice(originalPrice)}
        </span>
        {variant.discount && (
          <span className="text-green-600 font-medium">
            {formatPrice(discountedPrice)}
          </span>
        )}
      </div>
      <div className="flex-1">
        <DiscountForm
          discount={variant.discount}
          onApplyDiscount={onApplyDiscount}
        />
      </div>
    </div>
  );
};

export default ProductVariant;