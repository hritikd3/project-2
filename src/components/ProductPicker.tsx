import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Loader } from 'lucide-react';
import { Product } from '../types';
import { searchProducts } from '../api/products';
import SearchInput from './SearchInput';

interface ProductPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsSelect: (products: Product[]) => void;
}

const ProductPicker: React.FC<ProductPickerProps> = ({
  isOpen,
  onClose,
  onProductsSelect,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();

  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const newProducts = await searchProducts(search, page);
      setProducts(prev => [...prev, ...newProducts]);
      setHasMore(newProducts.length > 0);
      setLoading(false);
    };

    fetchProducts();
  }, [search, page]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
    setProducts([]);
  };

  const toggleProduct = (product: Product) => {
    setSelectedProducts(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select Products</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <SearchInput value={search} onChange={handleSearch} />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                ref={index === products.length - 1 ? lastProductRef : null}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedProducts.some(p => p.id === product.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleProduct(product)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image.src}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-600">
                      {product.variants.length} variant(s)
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-center p-4">
                <Loader className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onProductsSelect(selectedProducts);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={selectedProducts.length === 0}
          >
            Add Selected ({selectedProducts.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;