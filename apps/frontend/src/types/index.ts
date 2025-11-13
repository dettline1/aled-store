export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  category: string;
  brand: string;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  characteristics: Record<string, string>;
  variations?: ProductVariation[];
}

export interface ProductVariation {
  id: string;
  name: string;
  type: 'color' | 'size' | 'length' | 'socket';
  value: string;
  price?: number;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productsCount: number;
  parent?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  variationId?: string;
  variation?: ProductVariation;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  itemsCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  isNew: boolean;
  colors?: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  deliveryMethod: 'pickup' | 'courier' | 'post';
  paymentMethod: 'card' | 'cash' | 'transfer';
  comments?: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount?: number;
}

export interface SearchParams {
  q?: string;
  category?: string;
  brand?: string;
  min?: string;
  max?: string;
  sort?: string;
  page?: string;
  inStock?: string;
  isNew?: string;
}
