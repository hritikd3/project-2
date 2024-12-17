import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProductList from './components/ProductList';
import ProductPicker from './components/ProductPicker';
import { Product, ProductWithDiscount } from './types';

function App() {
  const [products, setProducts] = useState<ProductWithDiscount[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleProductsSelect = (selectedProducts: Product[]) => {
    if (editingIndex !== null) {
      const newProducts = [...products];
      newProducts.splice(editingIndex, 1, ...selectedProducts);
      setProducts(newProducts);
      setEditingIndex(null);
    } else {
      setProducts([...products, ...selectedProducts]);
    }
  };

  const handleEditProduct = (index: number) => {
    setEditingIndex(index);
    setIsPickerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <button
            onClick={() => setIsPickerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        <ProductList
          products={products}
          onProductsChange={setProducts}
          onEditProduct={handleEditProduct}
        />

        <ProductPicker
          isOpen={isPickerOpen}
          onClose={() => {
            setIsPickerOpen(false);
            setEditingIndex(null);
          }}
          onProductsSelect={handleProductsSelect}
        />
      </div>
    </div>
  );
}

export default App;