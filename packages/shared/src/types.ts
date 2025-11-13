import { UserRole, UserStatus, OrderStatus, PaymentStatus, CouponType, PostStatus, AuditAction } from './enums';

// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// User types
export interface User extends BaseEntity {
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  twoFASecret?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  twoFACode?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Product types
export interface Product extends BaseEntity {
  name: string;
  slug: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  price: number;
  oldPrice?: number;
  currency: string;
  stock: number;
  isPublished: boolean;
  rating: number;
  categoryId: string;
  brand?: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage extends BaseEntity {
  productId: string;
  fileKey: string;
  alt?: string;
  position: number;
  width?: number;
  height?: number;
}

export interface ProductVariant extends BaseEntity {
  productId: string;
  sku?: string;
  price?: number;
  stock?: number;
  barcode?: string;
  attributes: Record<string, any>;
}

// Category types
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  position: number;
  isVisible: boolean;
  imageKey?: string;
  parent?: Category;
  children?: Category[];
}

// Attribute types
export interface Attribute extends BaseEntity {
  name: string;
  slug: string;
  values?: AttributeValue[];
}

export interface AttributeValue extends BaseEntity {
  attributeId: string;
  value: string;
  slug: string;
}

// Cart types
export interface Cart extends BaseEntity {
  userId?: string;
  sessionId?: string;
  subtotal: number;
  total: number;
  currency: string;
  items?: CartItem[];
}

export interface CartItem extends BaseEntity {
  cartId: string;
  productId: string;
  variantId?: string;
  qty: number;
  priceAtAdd: number;
  currency: string;
  product?: Product;
  variant?: ProductVariant;
}

// Order types
export interface Order extends BaseEntity {
  userId?: string;
  email: string;
  phone: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discountTotal: number;
  total: number;
  currency: string;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
  items?: OrderItem[];
}

export interface OrderItem extends BaseEntity {
  orderId: string;
  productId: string;
  variantId?: string;
  qty: number;
  unitPrice: number;
  currency: string;
  product?: Product;
  variant?: ProductVariant;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

// Coupon types
export interface Coupon extends BaseEntity {
  code: string;
  type: CouponType;
  value: number;
  minSubtotal?: number;
  startsAt?: Date;
  endsAt?: Date;
  usageLimit?: number;
  usedCount: number;
}

// Review types
export interface Review extends BaseEntity {
  userId: string;
  productId: string;
  rating: number;
  text?: string;
  isApproved: boolean;
  user?: UserProfile;
  product?: Product;
}

// Media types
export interface Media extends BaseEntity {
  fileKey: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  createdBy: string;
  tags: string[];
}

// Blog types
export interface Post extends BaseEntity {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverKey?: string;
  publishedAt?: Date;
  authorId: string;
  status: PostStatus;
  author?: UserProfile;
}

// Audit types
export interface AuditLog extends BaseEntity {
  userId?: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  user?: UserProfile;
}

// Settings types
export interface Settings {
  id: string;
  key: string;
  value: Record<string, any>;
}

// Filter types
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  attributes?: Record<string, string[]>;
  search?: string;
}

export interface FilterPreset extends BaseEntity {
  title: string;
  query: Record<string, any>;
  isPublic: boolean;
  createdBy: string;
}
