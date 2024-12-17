import React from 'react';
import { X, GripVertical, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductWithDiscount } from '../types';
import DiscountForm from './DiscountForm';
import ProductVariant from './ProductVariant';
import { calculateDiscountedPrice, formatPrice } from '../utils/discount';

interface ProductCardProps {
  product: ProductWithDiscount;
  index: number;
  isExpanded: boolean;
  showRemoveButton: boolean;
  dragHandleProps: any;
  onEdit: () => void;
  onRemove: () => void;
  onToggleExpand: () => void;
  onApplyDiscount: (discount: { type: 'flat' | 'percentage'; value: number }) => void;
  onApplyVariantDiscount: (variantIndex: number, discount: { type: 'flat' | 'percentage'; value: number }) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isExpanded,
  showRemoveButton,
  dragHandleProps,
  onEdit,
  onRemove,
  onToggleExpand,
  onApplyDiscount,
  onApplyVariantDiscount,
}) => {
  const basePrice = Math.min(...product.variants.map(v => parseFloat(v.price)));
  const discountedPrice = calculateDiscountedPrice(basePrice, product.discount);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-4">
        <div {...dragHandleProps}>
          <GripVertical className="text-gray-400" />
        </div>
        <img
          src={product.image.src}
          alt={product.title}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{product.title}</h3>
            <div className="flex items-center gap-2">
              <span className={`${product.discount ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {formatPrice(basePrice)}
              </span>
              {product.discount && (
                <span className="text-green-600 font-medium">
                  {formatPrice(discountedPrice)}
                </span>
              )}
            </div>
          </div>
          <DiscountForm
            discount={product.discount}
            onApplyDiscount={onApplyDiscount}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Edit className="w-5 h-5" />
          </button>
          {showRemoveButton && (
            <button
              onClick={onRemove}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          )}
          {product.variants.length > 1 && (
            <button
              onClick={onToggleExpand}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pl-12 space-y-2">
          {product.variants.map((variant, vIndex) => (
            <ProductVariant
              key={variant.id}
              variant={variant}
              onApplyDiscount={(discount) => onApplyVariantDiscount(vIndex, discount)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;