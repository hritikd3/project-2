export interface Product {
  id: number;
  title: string;
  variants: Variant[];
  image: {
    id: number;
    product_id: number;
    src: string;
  };
}

export interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: string;
}

export interface ProductWithDiscount extends Product {
  discount?: {
    type: 'flat' | 'percentage';
    value: number;
  };
}

export interface VariantWithDiscount extends Variant {
  discount?: {
    type: 'flat' | 'percentage';
    value: number;
  };
}