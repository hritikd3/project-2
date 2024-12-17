import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ProductWithDiscount } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: ProductWithDiscount[];
  onProductsChange: (products: ProductWithDiscount[]) => void;
  onEditProduct: (index: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductsChange,
  onEditProduct,
}) => {
  const [expandedProducts, setExpandedProducts] = useState<number[]>([]);

  const toggleProduct = (productId: number) => {
    setExpandedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onProductsChange(items);
  };

  const removeProduct = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    onProductsChange(newProducts);
  };

  const updateProductDiscount = (productIndex: number, discount: { type: 'flat' | 'percentage'; value: number }) => {
    const newProducts = [...products];
    newProducts[productIndex] = {
      ...newProducts[productIndex],
      discount,
    };
    onProductsChange(newProducts);
  };

  const updateVariantDiscount = (productIndex: number, variantIndex: number, discount: { type: 'flat' | 'percentage'; value: number }) => {
    const newProducts = [...products];
    const variants = [...newProducts[productIndex].variants];
    variants[variantIndex] = {
      ...variants[variantIndex],
      discount,
    };
    newProducts[productIndex].variants = variants;
    onProductsChange(newProducts);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="products">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {products.map((product, index) => (
              <Draggable
                key={`${product.id}-${index}`}
                draggableId={`${product.id}-${index}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <ProductCard
                      product={product}
                      index={index}
                      isExpanded={expandedProducts.includes(product.id)}
                      showRemoveButton={products.length > 1}
                      dragHandleProps={provided.dragHandleProps}
                      onEdit={() => onEditProduct(index)}
                      onRemove={() => removeProduct(index)}
                      onToggleExpand={() => toggleProduct(product.id)}
                      onApplyDiscount={(discount) => updateProductDiscount(index, discount)}
                      onApplyVariantDiscount={(variantIndex, discount) =>
                        updateVariantDiscount(index, variantIndex, discount)
                      }
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ProductList;