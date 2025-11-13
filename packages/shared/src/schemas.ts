import { z } from 'zod';
import { UserRole, UserStatus, OrderStatus, PaymentStatus, CouponType, PostStatus } from './enums';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  twoFACode: z.string().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  firstName: z.string().min(1, 'Имя обязательно').optional(),
  lastName: z.string().min(1, 'Фамилия обязательна').optional(),
  phone: z.string().optional(),
});

// User schemas
export const createUserSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Название товара обязательно'),
  slug: z.string().min(1, 'URL товара обязателен'),
  sku: z.string().min(1, 'Артикул обязателен'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive('Цена должна быть положительной'),
  oldPrice: z.number().positive().optional(),
  currency: z.string().default('RUB'),
  stock: z.number().nonnegative('Остаток не может быть отрицательным'),
  isPublished: z.boolean().default(false),
  categoryId: z.string().min(1, 'Категория обязательна'),
  brand: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(24),
  sort: z.string().optional(),
});

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Название категории обязательно'),
  slug: z.string().min(1, 'URL категории обязателен'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  position: z.number().nonnegative().default(0),
  isVisible: z.boolean().default(true),
  imageKey: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'ID товара обязателен'),
  variantId: z.string().optional(),
  qty: z.number().positive('Количество должно быть положительным'),
});

export const updateCartItemSchema = z.object({
  qty: z.number().positive('Количество должно быть положительным'),
});

// Order schemas
export const addressSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Адрес обязателен'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Город обязателен'),
  region: z.string().min(1, 'Регион обязателен'),
  postalCode: z.string().min(1, 'Почтовый индекс обязателен'),
  country: z.string().min(1, 'Страна обязательна'),
});

export const createOrderSchema = z.object({
  email: z.string().email('Неверный формат email'),
  phone: z.string().min(1, 'Телефон обязателен'),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  notes: z.string().optional(),
});

// Coupon schemas
export const createCouponSchema = z.object({
  code: z.string().min(1, 'Код купона обязателен'),
  type: z.nativeEnum(CouponType),
  value: z.number().positive('Значение должно быть положительным'),
  minSubtotal: z.number().positive().optional(),
  startsAt: z.date().optional(),
  endsAt: z.date().optional(),
  usageLimit: z.number().positive().optional(),
});

export const updateCouponSchema = createCouponSchema.partial();

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Код купона обязателен'),
});

// Review schemas
export const createReviewSchema = z.object({
  productId: z.string().min(1, 'ID товара обязателен'),
  rating: z.number().min(1).max(5, 'Рейтинг должен быть от 1 до 5'),
  text: z.string().optional(),
});

export const updateReviewSchema = z.object({
  isApproved: z.boolean().optional(),
});

// Post schemas
export const createPostSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен'),
  slug: z.string().min(1, 'URL поста обязателен'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Содержимое обязательно'),
  coverKey: z.string().optional(),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
});

export const updatePostSchema = createPostSchema.partial();

// Media schemas
export const uploadMediaSchema = z.object({
  fileKey: z.string().min(1, 'Ключ файла обязателен'),
  mime: z.string().min(1, 'MIME тип обязателен'),
  size: z.number().positive('Размер должен быть положительным'),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  alt: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

// Settings schemas
export const updateSettingsSchema = z.object({
  key: z.string().min(1, 'Ключ настройки обязателен'),
  value: z.record(z.any()),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(24),
});

// Sort schema
export const sortSchema = z.object({
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type ProductFiltersSchema = z.infer<typeof productFiltersSchema>;
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
export type AddToCartSchema = z.infer<typeof addToCartSchema>;
export type UpdateCartItemSchema = z.infer<typeof updateCartItemSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;
export type CreateCouponSchema = z.infer<typeof createCouponSchema>;
export type UpdateCouponSchema = z.infer<typeof updateCouponSchema>;
export type ApplyCouponSchema = z.infer<typeof applyCouponSchema>;
export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
export type UpdateReviewSchema = z.infer<typeof updateReviewSchema>;
export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
export type UploadMediaSchema = z.infer<typeof uploadMediaSchema>;
export type UpdateSettingsSchema = z.infer<typeof updateSettingsSchema>;
